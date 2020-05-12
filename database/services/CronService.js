/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
import { Worker } from 'webworker-threads';
import cron from 'node-cron';
import moment from 'moment';
import SettlementSDConfig from '../mongodb/models/SettlementSDConfig';
import SettlementSD from '../mongodb/models/SettlementSD';
import sendEmailSms from '../../helpers/emailSender';
import Logger from '../../helpers/Logger';
import SettlementSDTrans from '../mongodb/models/SettlementSDTrans';
import { sendNotification, events, getActiveSocketsCount } from '../../socket';
import { curDate, validateEmail, getRegExp } from '../../helpers/utils';
import ConfigService from './ConfigService';
import SqlMerchantService from './sql/MerchantService';
import SqlTerminalService from './sql/TerminalService';
import Merchant from '../mongodb/models/Merchant';
import Terminal from '../mongodb/models/Terminal';
import MerchantService from './MerchantService';
import MwTransaction from '../mongodb/middleware/models/MwTransaction';
import Transaction from '../mongodb/models/Transaction';
import TermStateService from './middleware/TermStateService';
import MwTermState from '../mongodb/middleware/models/MwTermState';
import BankTerminal from '../mongodb/models/BankTerminal';
import BankMerchant from '../mongodb/models/BankMerchant';
import TransactionService from './TransactionService';
import SettlementService from './SettlementService';
import XLSXGen from '../../lib/XLSXGen';

import FTP from 'ftpimp';
import XLSXReader from '../../lib/XLSXReader';
import VasReport from '../mongodb/middleware/models/VasReport';
import MwVasReport from '../mongodb/middleware/models/MwVasReport';
import { ObjectID, ObjectId } from 'mongodb';

/**
* @class Cron Service
* Handle scheduled jobs and all cron related processes
*/
class CronService {
  async syncBankMerTerm(prefixs) {
    const $in = prefixs.map(item => getRegExp(item));
    const terms = await Terminal.find({ terminal_id: { $in } });
    const mids = terms.map(item => item.merchant_id);
    const merchs = await Merchant.find({ merchant_id: { $in: mids } });
    try {
      await BankTerminal.insertMany(terms, { ordered: false, rawResult: true });
      await BankMerchant.insertMany(merchs, { ordered: false, rawResult: true });
    } catch (err) { Logger.log(err.message); }
    Logger.log('syncBankMerTerms ran.');
  }

  async syncTrans($skip = 0) {
    const lastSkip = $skip || await ConfigService.getKeyValue('sync_trans_last_skip') || 0;

    $skip = lastSkip || 0;
    const $limit = 500;

    const $match = {
      transactionTime: { $gte: new Date('2019-09-01') },
      responseCode: { $exists: true },
    };

    const $project = {
      _id: 0,
      id: '$_id',
      merchant_name: '$merchantName',
      merchant_address: '$merchantAddress',
      merchant_id: '$merchantId',
      terminal_id: '$terminalId',
      rrn: 1,
      stan: '$STAN',
      transaction_date: '$transactionTime',
      mcc: '$merchantCategoryCode',
      pan: '$maskedPan',
      processing_code: '$processingCode',
      amount: 1,
      currency_code: '$currencyCode',
      response_msg: '$messageReason',
      authcode: '$authCode',
      response_code: '$responseCode',
      handler_used: '$handlerUsed',
      mti: '$MTI',
    };

    const transactions = await MwTransaction.aggregate([
      { $match },
      { $sort: { transactionTime: 1 } },
      { $skip },
      { $limit },
      { $project },
    ]);

    try {
      await Transaction.insertMany(transactions, { ordered: false, rawResult: true });
    } catch (err) { Logger.log(err.message); }

    Logger.log($skip);
    await ConfigService.setKeyValue('sync_trans_last_skip', $skip += transactions.length);
    if (transactions.length === 500) this.syncTrans($skip);
  }

  /**
* This handles getting transactions summary for merchants.
* @param {express.Request} req Express request param
* @param {express.Response} res Express response param
*/
  async   vasTrans($skip = 0) {
    const $limit = 500;
    // const lastSkip = $skip || await ConfigService.getKeyValue('sync_vas_trans_last_skip') || '2020-03-31T23:59:59Z';
    // $skip = lastSkip;
    // console.log('skip value: ', lastSkip);
    let lastSkip = await VasReport.find({}).limit(1).sort({ _id: -1 }).select('createdAt');

    if (lastSkip.length) {
      $skip = lastSkip[0].createdAt;
    } else {
      $skip = '2020-03-31T23:59:59Z';
    }

    try {
      const $match = {
        'data.product.paymentMethod': 'card',
        'createdAt': { $gt: $skip },
      };
      console.log('match : ', $match)
      const transactions = await MwVasReport.find($match).limit($limit);
      console.log('trans : ', transactions)
      const data = transactions.map(trans => {
        let responseData = {};
        responseData["_id"] = trans._id;
        responseData["createdAt"] = trans.createdAt
        responseData["virtualTID"] = trans.data.product.virtualTID;
        responseData["amountSettled"] = trans.data.amountSettled;
        responseData['terminal'] = trans.data.product.pfm.state.tid;
        responseData['description'] = trans.data.description || trans.data.description;
        responseData['nairaAmount'] = trans.data.product.nairaAmount;
        responseData['amount'] = trans.data.product.amount;
        responseData['VASCustomerAccount'] = trans.data.product.VASCustomerAccount;
        responseData['VASCustomerPhone'] = trans.data.product.VASCustomerPhone;
        responseData['VASProviderName'] = trans.data.product.VASProviderName;
        responseData["paymentMethod"] = trans.data.product.paymentMethod;
        responseData["reference"] = trans.data.product.reference;
        responseData["beneficiaryWallet"] = trans.data.beneficiaryWallet;
        responseData["category"] = trans.data.product.category;
        responseData["product"] = trans.data.product.product;
        responseData["channel"] = trans.data.product.channel;
        responseData["rrn"] = trans.data.product.pfm.journal.rrn;
        responseData["pan"] = trans.data.product.pfm.journal.mPan;
        responseData["dateTime"] = trans.data.product.pfm.journal.timestamp;
        return responseData;
      })

      // console.log('data: ', data) 
      // console.log('new :', data);

      //save bulk transaction 
      await VasReport.insertMany(data, { ordered: false, rawResult: true });
      // Logger.log('Last Skip is :', $skip);
      // console.log('first : ', data.unshift())
      // console.log('last : ', data.pop());
      // const lastDocument = data.pop();
      // console.log('data : ', lastDocument.createdAt);

      await ConfigService.setKeyValue('sync_vas_trans_last_skip', $skip);
      Logger.log('Pulling Done with last id ', $skip)
    } catch (error) { console.log(error) }
  }

  async syncTermStat(skip = 0) {
    const lastSkip = skip || await ConfigService.getKeyValue('term_stat_l_skip');
    const limit = 500;

    const termis = await Terminal.find({}).skip(lastSkip).limit(limit);
    const tids = termis.map(item => item.terminal_id);

    const terms = await TermStateService.syncTermStates(tids);
    for (const term of terms) {
      await Terminal.updateOne({ terminal_id: term.terminal_id }, { $set: term });
    }

    Logger.log(skip + termis.length);
    if (termis.length === limit) this.syncTermStat(skip + termis.length);
    else Logger.log('Term Stat Sync Done!!!');
  }

  async deleteMerchWithoutTermID($skip = 0) {
    const lastSkip = $skip || await ConfigService.getKeyValue('mongo_dele_merch_last_skip') || 0;

    let skip = lastSkip || 0;
    const limit = 1000;

    const merchs = await Merchant.find({}).skip(skip).limit(limit).lean();
    for (const merch of merchs) {
      const term = await Terminal.findOne({ merchant_id: merch.merchant_id });
      if (!term) await Merchant.deleteOne({ merchant_id: merch.merchant_id });
    }

    skip += merchs.length;
    await ConfigService.setKeyValue('mongo_resolve_last_skip', skip);
    Logger.log(skip);
    if (merchs.length === limit) return this.deleteMerchWithoutTermID(skip);
    Logger.log('Done');
    return false;
  }

  async resolveMerch($skip = 0) {
    const lastSkip = $skip || await ConfigService.getKeyValue('mongo_resolve_last_skip') || 0;

    let skip = lastSkip || 0;
    const limit = 500;

    const terminals = await Terminal.find({}).skip(skip).limit(limit).lean();
    skip += terminals.length;
    if (!terminals.length) {
      Logger.log('Ran resolveMerch.');
      return false;
    }

    const tids = terminals.map(item => item.terminal_id);
    const trans = await MwTransaction.aggregate([
      { $match: { terminalId: { $in: tids } } },
      {
        $group: {
          _id: '$terminalId',
          merchant_name: { $last: '$merchantName' },
          merchant_address: { $last: '$merchantAddress' },
          merchant_id: { $last: '$merchantId' },
          terminal_id: { $last: '$terminalId' },
        },
      },
    ]);

    for (const item of trans) {
      const terminal = terminals.find(rec => rec.terminal_id === item.terminal_id);
      if (!terminal) continue;
      try {
        const term = await Terminal.findOne({
          merchant_id: terminal.merchant_id || '',
          tams_mid: { $exists: false },
        });

        const merchant = await Merchant.findOne({ merchant_id: terminal.merchant_id });
        if (merchant) {
          const mm_id = merchant.merchant_id;
          merchant.tams_mid = merchant.merchant_id;
          merchant.merchant_id = item.merchant_id;
          try {
            await merchant.save();
          } catch (error) {
            if (error.code === 11000) {
              await Merchant.updateOne({ merchant_id: item.merchant_id }, { $addToSet: { tams_mids: mm_id } });
              await Merchant.updateOne({ merchant_id: mm_id }, { $set: { mid_link: item.merchant_id } });
            }
            Logger.log(error.code, error.message);
          }
        }

        if (term) {
          term.tams_mid = term.merchant_id;
          term.merchant_id = item.merchant_id;
          try {
            await term.save();
          } catch (error) {
            Logger.log(error.message);
          }
        }
      } catch (err) { Logger.log(err.message); }
    }

    await ConfigService.setKeyValue('mongo_resolve_last_skip', skip);
    Logger.log(skip);
    if (terminals.length === limit) return this.resolveMerch(skip);
    this.deleteMerchWithoutTermID();
    return this.syncTermStat();
  }

  /**
  * Processes merchants terminals synchronization
  */
  async termSync() {
    const limit = 500;

    let tLastId = await ConfigService.getKeyValue('term_sync_last_id') || 0;
    Logger.log('merchTermSync invoked with lastIDs; t:', tLastId);

    const terminalsData = await SqlTerminalService.getTerminals(1, limit, null, tLastId);
    Logger.log(tLastId);
    const terminals = terminalsData.rows;
    if (terminals.length) {
      try {
        await Terminal.insertMany(terminals, { ordered: false, rawResult: true });
      } catch (err) { Logger.log(err.message); }
      tLastId = terminals.pop().id;
    } else Logger.log('No terminals data.');
    await ConfigService.setKeyValue('term_sync_last_id', tLastId);

    Logger.log(tLastId, terminals.length);

    if ((limit - 1) === terminals.length) return this.termSync();
    Logger.log('Merchant sync ran, with lastIDs, t:', tLastId);
    return this.resolveMerch();
  }

  /**
  * Processes merchants terminals synchronization
  */
  async merchSync() {
    if (process.env.CHECK_SQL !== 'true') return false;
    const limit = 500;

    let mLastId = await ConfigService.getKeyValue('merch_sync_last_id') || 0;
    Logger.log('merchTermSync invoked with lastIDs; m:', mLastId);

    const merchantsData = await SqlMerchantService.getMerchants(1, limit, null, mLastId);
    const merchants = merchantsData.rows;
    if (merchants.length) {
      try {
        await Merchant.insertMany(merchants, { ordered: false, rawResult: true });
      } catch (err) { Logger.log(err.message); }
      mLastId = merchants.pop().id;
    } else Logger.log('No merchants data.');
    await ConfigService.setKeyValue('merch_sync_last_id', mLastId);

    Logger.log(mLastId, merchants.length);

    if ((limit - 1) === merchants.length) return this.merchSync();
    Logger.log('Merchant sync ran, with lastIDs, m:', mLastId);
    return this.termSync();
  }

  async merchExpectedSettlementNotify() {
    if (!process.env.MERCH_SUMMARY_NOTIFY) return;

    const date = curDate();
    const limit = 100;

    const run = async (page = 1) => {
      const tranServ = new TransactionService();
      tranServ.setDate(date).setPage(page);
      // const data = await TransactionService2.getMerchTransSummary(date, date, page, limit);
      let transData = await tranServ.merchSummary();
      const merchantIDs = transData.map(a => a.merchant_id);
      const merchants = await MerchantService.getMerchantsForIds(merchantIDs);
      transData = transData.map((item) => {
        const merchant = merchants.find(a => a.merchant_id === item.merchant_id) || {};
        return {
          ...item,
          merchant_email: merchant.merchant_email || null,
          merchant_phone: merchant.merchant_phone || null,
          merchant_name: merchant.merchant_name || null,
          transaction_date: date,
          interval: 24,
        };
      });
      // eslint-disable-next-line no-use-before-define
      for (const trans of transData) sendMerchTransEmail(trans);
      return { count: transData.length };
    };

    let page = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      page++;
      const runRes = await run(page);
      const { count } = runRes;
      if (count < limit) break;
    }

    Logger.log('Ran daily merchant txn summary notification');
  }

  async merchSettlementNotify() {
    if (!process.env.MERCH_SUMMARY_NOTIFY) return;

    const date = moment().subtract(1, 'd').toDate();
    const limit = 100;

    const run = async (page = 1) => {
      let transData = await SettlementService.merchSummary(date, page, limit);
      const merchantIDs = transData.map(a => a.merchant_id);
      const merchants = await MerchantService.getMerchantsForIds(merchantIDs);
      transData = transData.map((item) => {
        const merchant = merchants.find(a => a.merchant_id === item.merchant_id) || {};
        return {
          ...item,
          merchant_email: merchant.merchant_email || null,
          merchant_phone: merchant.merchant_phone || null,
          merchant_name: merchant.merchant_name || null,
          transaction_date: date,
          interval: 24,
        };
      });
      // eslint-disable-next-line no-use-before-define
      for (const trans of transData) sendMerchTransEmail(trans, false);
      return { count: transData.length };
    };

    let page = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      page++;
      const runRes = await run(page);
      const { count } = runRes;
      if (count < limit) break;
    }

    Logger.log('Ran daily merchant txn summary notification');
  }

  async updateTermStat() {
    const d = moment().subtract(30, 'minutes').toDate();
    const $match = {
      stateInformation: { $exists: true },
      updatedAt: { $gte: d },
    };
    const $project = {
      _id: 0, terminal_id: '$_id.terminalId', stateInformation: 1, lastCrAt: 1,
    };
    const termStates = await MwTermState.aggregate([
      { $match },
      { $group: { _id: { terminalId: '$terminalId' }, stateInformation: { $last: '$stateInformation' }, lastCrAt: { $last: '$createdAt' } } },
      { $project },
    ]);

    for (const item of termStates) {
      const term = await TermStateService.getTermState(item);
      await Terminal.updateOne({ terminal_id: term.terminal_id }, { $set: term });
    }

    Logger.log('Term Stat Update Done!!!', termStates.length);
  }

  /**
  * Processes same day settlements for merchants
  */
  async settlementSameDay() {
    const now = new Date();
    const hour = now.getHours();
    const endDate = new Date(now.setMinutes(0, 0, 0));

    const merchantsConfig = await SettlementSDConfig.find({
      settlement_hours: hour,
    });

    const settlements = [];
    for (const config of merchantsConfig) {
      const interval = config.interval * 60 * 60 * 1000;
      const startDate = new Date(endDate.getTime() - interval);

      let mDate = new Date(endDate.getTime() - (interval / 2));
      [mDate] = mDate.toISOString().split('T');

      const merchantId = config.merchant_id;
      /** Get merchants transactions between settlement interval */

      const tranServ = new TransactionService();
      tranServ.setMerchant(merchantId).setDate(startDate, endDate).setLimit(Number.MAX_SAFE_INTEGER);
      // const transactionsData = await TransactionService2.getTransactionHistory(1, null, { merchantId }, startDate, endDate);
      const transactions = await tranServ.history();

      const transactionRef = [];
      for (const transaction of transactions) {
        transactionRef.push({
          transaction_id: transaction._id,
          rrn: transaction.rrn,
          terminal_id: transaction.terminal_id,
          amount: transaction.amount,
          statusMessage: transaction.status,
          responseCode: transaction.status_code,
        });
      }

      let settlementSD = new SettlementSD({
        merchant_id: config.merchant_id,
        merchant_name: config.merchant_name,
        interval: config.interval,
        transaction_date: mDate,
      });
      settlementSD = await settlementSD.save();

      const sDtrans = transactionRef.map((item) => {
        item.settlement_sd_id = settlementSD._id;
        return item;
      });

      try {
        await SettlementSDTrans.insertMany(sDtrans, { ordered: false, rawResult: true });
      } catch (error) { Logger.log(error.message); }

      const match = { settlement_sd_id: settlementSD._id };

      const $group = {
        _id: { settlement_sd_id: '$settlement_sd_id' },
        total_value: { $sum: '$amount' },
        total_volume: { $sum: 1 },
      };

      const $project = { _id: 0, total_value: '$total_value', total_volume: '$total_volume' };

      let successTrans = await SettlementSDTrans.aggregate([
        { $match: { ...match, responseCode: '00' } },
        { $group },
        { $project },
      ]);
      [successTrans] = successTrans;

      let failedTrans = await SettlementSDTrans.aggregate([
        { $match: { ...match, responseCode: { $ne: '00' } } },
        { $group },
        { $project },
      ]);

      if (successTrans) {
        [failedTrans = {}] = failedTrans;
        settlementSD.successful_volume = (successTrans.total_volume || 0);
        settlementSD.successful_value = (successTrans.total_value || 0) / 100;
        settlementSD.failed_volume = (failedTrans.total_volume || 0);
        settlementSD.failed_value = (failedTrans.total_value || 0) / 100;
        settlementSD.total_value = settlementSD.successful_value + settlementSD.failed_value;
        settlementSD.total_volume = settlementSD.successful_volume + settlementSD.failed_volume;
        settlementSD = await settlementSD.save();
      }
      settlements.push(settlementSD);
    }

    // eslint-disable-next-line no-use-before-define
    if (settlements.length) await sendSDSAdviceEmail(hour, settlements);
    Logger.log('Ran settlement job for:', `${hour}:00 ::: `, settlements.length, 'settlements.');
  }

  async posSupportNotify() {
    const posSupportEmails = await ConfigService.getKeyValue('pos_support');
    const checkPrinter = await ConfigService.getKeyValue('notify_bad_printer');
    const checkConnectDate = await ConfigService.getKeyValue('notify_inactive_terminal');
    const connectDays = await ConfigService.getKeyValue('notify_inactive_terminal_day') || 30;
    const printerOkMsg = ['Printer OK', 'PrinterAvailable', 'PrinterOK'];

    const printer_status = {
      $exists: true,
      $nin: printerOkMsg,
    };
    const last_connect_date = {
      $lte: moment().subtract(connectDays, 'd').toDate(),
    };
    const $or = [];
    if (checkConnectDate) $or.push({ last_connect_date });
    if (checkPrinter) $or.push({ printer_status });

    if (!$or.length || !posSupportEmails.length) return;

    const $match = {
      $and: [
        {
          $or: [
            { last_notify_date: { $exists: false } },
            { last_notify_date: { $lte: moment().subtract(connectDays, 'd').toDate() } },
          ],
        },
        { $or },
      ],
    };
    const terminals = await Terminal.aggregate([
      { $match },
      { $limit: 500 },
    ]);

    const mids = terminals.map(item => item.merchant_id);
    const tids = terminals.map(item => item.terminal_id);
    const merchants = await Merchant.find({ merchant_id: { $in: mids } });

    const data = terminals.map((item) => {
      const merchant = merchants.find(rec => rec.merchant_id === item.merchant_id) || {};
      let condition = '';
      if (moment().diff(moment(item.last_connect_date), 'd') > connectDays) condition += 'Inactive';
      if (item.printer_status && !printerOkMsg.includes(item.printer_status)) condition += (condition ? '/' : '') + item.printer_status;
      return {
        merchant_name: merchant.merchant_name,
        merchant_address: merchant.merchant_address,
        merchant_phone: merchant.merchant_phone,
        merchant_email: merchant.merchant_email,
        terminal_id: item.terminal_id,
        merchant_id: item.merchant_id,
        serial_no: item.serial_no,
        location: item.lat ? `http://maps.google.com/maps?z=8&t=m&q=loc:${item.lat}+${item.lon}` : '',
        condition,
      };
    });

    if (!data.length) return;
    const path = await XLSXGen.termSupport(data, `POS-Support${new Date().getTime()}.xlsx`);

    sendEmailSms({
      emailRecipients: posSupportEmails,
      emailBody: `
      Hello Support Officer, <br>
      <p>A list of ${terminals.length} terminals requires support. These are terminals which have either Printer Issues or has not been active for ${connectDays} days.</p><p>You can find this list in the Excel file attached.</p><br>
      Thanks.<br> <br>
      © ${process.env.APP_NAME}<br>
      Powered by ITEX<br>
      </div>
      `,
      emailSubject: 'POS Support - Attention is required for these Terminals',
      attachments: [
        {
          path,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    });

    await Terminal.updateMany({ terminal_id: { $in: tids } }, { $set: { last_notify_date: new Date() } });
    Logger.log(`Sent Auto POS Support Email to ${posSupportEmails.join(', ')}`);
  }

  /**
  * Pushes realtime data to online users
  */
  async realTimeNotification() {
    const socketRoom = 'adminSocket';
    /** Check if there is active sockets */
    if (!getActiveSocketsCount(socketRoom)) return;

    /** Send real time updates to transaction history */
    try {
      const tranServ = new TransactionService();
      tranServ.setLimit(50);
      // const transactionsHistory = await TransactionService2.getTransactionHistory(1, 30);
      const transactions = await tranServ.history();
      sendNotification(socketRoom, events.thNotify, { data: transactions });
    } catch (err) { Logger.log(err); }

    /** Send real time updates to transaction graph */
    try {
      const tranServ = new TransactionService();
      tranServ.setDate(curDate());
      // const transactionsGraph = await TransactionService2.getTransactionTime(curDate());
      const transactionsGraph = await tranServ.time();
      sendNotification(socketRoom, events.tgNotify, transactionsGraph);
    } catch (err) { Logger.log(err); }

    /** Send real time updates to transaction stat */
    try {
      const tranServ = new TransactionService();
      tranServ.setDate(curDate());
      // const transactionsStats = await TransactionService2.getTransactionStat(curDate(), curDate());
      const transactionsStats = await tranServ.stat();
      sendNotification(socketRoom, events.tsNotify, transactionsStats);
    } catch (err) { Logger.log(err); }

    /** Send real time updates to online terminals */
    try {
      const tranServ = new TransactionService();
      tranServ.setDate(curDate());
      // const onlineTerminals = await TransactionService2.getTransTermStat('online');
      const onlineTerminals = await tranServ.transTermStat('online');
      sendNotification(socketRoom, events.otNotify, onlineTerminals);
    } catch (err) { Logger.log(err); }
  }

  /**
   * download settlement file from ftp server and upload to settlemen table
   */

  async UploadSettlementFromFTP() {
    // config to connect to ftp server
    const config = {
      host: 'speedtest.tele2.net',
      port: 21,
      user: 'anonymous',
      pass: 'anonymous',
      debug: false
    };

    const ftp = FTP.create(config, false);
    ftp.connect(() => {
      // list all the file 
      ftp.ls('/', function (err, filelist) {
        if (filelist) {
          //get the last file name and date from the config 
          const lastFileName = ConfigService.getKeyValue('last_file_name').then(data => console.log('done')) || null;
          const lastFileTime = ConfigService.getKeyValue('last_file_time').then(data => console.log('done')) || null;

          // console.log('date', filelist[filelist.length - 1].mtime);
          //save the last time on the db and the file name

          const fileName = filelist[filelist.length - 2].filename;
          const fileDate = new Date((filelist[filelist.length - 1].mtime)).toISOString().slice(11, -1);

          if (fileName !== lastFileName && fileDate !== lastFileTime) {
            ConfigService.setKeyValue('last_file_name', fileName).then(data => console.log('done'));
            ConfigService.setKeyValue('last_file_time', fileDate).then(data => console.log('done'));

            //download the file unto the system and start upload the content to settle model
            ftp.save([`/${fileName}`, `files/settlements/${fileName}`], function (err, filename) {
              console.log(err, filename);
              //save upload history if save and no error
              if (filename) {
                XLSXReader.settlement(filename, 'UPSL_UBA', {})
              }
              //read back the file and process for download
            });

          }

          //if the last file and the last filenae save is not the save then  save the new one
          console.log('time : ', new Date((filelist[filelist.length - 1].mtime)).toISOString().slice(11, -1));
          console.log('date : ', new Date(filelist[filelist.length - 1].mtime));
        }
        if (err) console.error(err)
      });
      console.log('Ftp connected');

    });
  }

  async ReconcileSettlement($skip = 0) {
    //get the last id of pull transaction
    const lastSkip = $skip || await ConfigService.getKeyValue('mongo_reconcillation_last_skip') || 0;
    let skip = lastSkip || 0;
    const limit = 500;
    //calculate the limit
    try {
      // const tranServ = new TransactionService();
      // tranServ.setStatus('successful').setLimit(limit)
      //   .setSettled('unsettled');

      // const transactions = await tranServ.history();
      // step 1 get total count of transactions
      const totalCount = await MwTransaction.countDocuments({ settled: null })
      // Logger.log('total Count : ', totalCount)
      // step 2 set retry to 0 then divide the total count of transaction by modulus of limit ( 500 ) 4
      retry = () => {
        const transactions = MwTransaction.find({ settled: null }).skip(skip).limit(limit).lean().then(data => data);
        skip += transactions.length;
        Logger.log('skip : ', skip, 'total : ', totalCount, 'change : ', totalCount - skip)
        const rrns = transactions.map(item => item.rrn).filter(item => item).map(item => item.toString());
        const terminals = transactions.map(item => item.terminal_id);

        const settlements = SettlementService.getTIDsRRNsTrans(terminals, rrns).then(data => data);

        for (const item of transactions) {
          // Logger.log('transacation Details', item.settled);
          let settled = !!settlements.find(rec => Number(item.rrn) === Number(rec.rrn) && item.terminal_id === rec.terminal_id)

          //update settlement for status of settlement
          if (settled) {
            Transaction.updateOne({ terminal_id: item.terminal_id }, { $set: { settled: 'settled' } }).then(data => data);
          }
          let change = totalCount - skip;
          console.lean('change: ', change)
          if (change >= 0) {
            ConfigService.setKeyValue('mongo_reconcillation_last_skip', 0).then(data => data);
            Logger.log('Skip value reset : ', skip);

          } else {
            ConfigService.setKeyValue('mongo_reconcillation_last_skip', skip).then(data => data);
            Logger.log('Skip value and continue', skip);
            // step 3 if step 2 equeal to zero reset the the skip back to zero
            retry();
          }
        }

      }
    } catch (error) {


    }
  }


  async ReconcileVasSettlement() {
    const limit = 50;
    try {
      //get the pull all unsettle transaction from vas report 
      const transactions = await VasReport.find({ settled: { $ne: "true" } }).limit(limit).lean();

      // console.log('Trans Data', JSON.stringify(transactions))
      const rrns = transactions.map(item => item.rrn).filter(item => item).map(item => item.toString());
      const amounts = transactions.map(item => (item.amount / 100)).filter(item => item);
      const terminals = transactions.map(item => [item.virtualTID, item.terminal]);
      const pans = transactions.map(item => item.pan).map(pan => {
        //  console.info('pan length : ',  pan.length)
        if (pan.length == 19) return pan.replace(/XXXXXXXXX/gi, '*********')
        if (pan.length == 18) return pan.replace(/XXXXXXXX/gi, '********')
        if (pan.length == 16) return pan.replace(/XXXXXX/gi, '********')
        else return pan
      });
      // console.log('original rrn : ', rrns);

      const filetrTerminals = terminals.map(item => {
        let output;
        if (item[0] == undefined) {
          output = item[1];

        } else {
          output = item[0];
        }
        return output;
      });
      const settlements = await SettlementService.getTIDsRRNsTrans(filetrTerminals, rrns, amounts, pans);
      // console.log(`settlements Record`, JSON.stringify(settlements));

      const records = transactions.map((item) => {
        // console.log('trxn : ', parseInt(item.rrn, 10))
        item.settled = settlements.filter((sett) => {
          // console.log('trxn : ', parseInt(sett.rrn, 10))

          if (item.rrn.toString() === sett.rrn.toString() || parseInt(item.rrn, 10) == parseInt(sett.rrn, 10) && (sett.transaction_amount) == (item.amount / 100)) {
            console.log('rrn : ', parseInt(item.rrn, 10), ' = ', parseInt(sett.rrn, 10))
            item.settledTrxAmount = sett.transaction_amount;
            item.SettlementAmount = sett.settlement_amount;
            item.settleTerminal = sett.terminal_id;
            item.processor = sett.processor;
            item.charges = sett.charge;
            item.merchant_id = sett.merchant_id;
            item.pan_sett = sett.pan;
            return sett.terminal_id;
          }

        });
        // console.log('output :', item.settled)
        item.settled = item.settled.length ? true : false;
        return item;
      });

      // console.log('data length : ', JSON.stringify(records))
      // update the vas report collections for updte of settlement record
      if (records.length) {
        console.log('Settled Transaction Begin Matched Found: ', records.length)
        for (const item of records) {
          // console.log('record to update: ', item)
          // console.log('status : ', item.settled)
          if (item.settled == true) {
            console.log('status : ', item.settled)
            await VasReport.findByIdAndUpdate({ _id: item._id },
              {
                settledTrxAmount: item.settledTrxAmount,
                SettlementAmount: item.SettlementAmount,
                settleTerminal: item.settleTerminal,
                processor: item.processor,
                charges: item.charges,
                merchant_id: item.merchant_id,
                pan_sett: item.pan_sett,
                settled: item.settled
              });
          }

        }
      }
      console.log('Settled Transaction  End Done : ', records.length)

    } catch (error) {
      Logger.log(error);
    }


  }
  /**
  * Starts the cron jobs in a worker thread
  */
  startCron() {

    const worker = new Worker(function () {
      this.onmessage = function (event) {
        this.postMessage(event);
        // eslint-disable-next-line no-undef
        self.close();
      };
    });
    worker.onmessage = () => {
      // Run same day settlement hourly cron
      cron.schedule('0 * * * *', async () => {
        // try { await this.settlementSameDay(); } catch (error) { Logger.log(error.message); }
      });

      // Run auto upload of settlement file  hourly cron
      cron.schedule('*/45 * * * * *', async () => {
        // try { await this.UploadSettlementFromFTP(); } catch (error) { Logger.log(error.message); }
      });


      // Run auto settlement for vasReport transaction file  hourly cron
      cron.schedule('*/60 * * * *  *', async () => {
        // try { await this.ReconcileVasSettlement(); } catch (error) { Logger.log(error.message); }
      });

      // Run auto settlemeny of transaction file  hourly cron
      cron.schedule('*/45 * * * * *', async () => {
        // try { await this.ReconcileSettlement(); } catch (error) { Logger.log(error.message); }
      });

      // Send real-time records every 45 secs
      cron.schedule('*/45 * * * * *', async () => {
        // try { await this.realTimeNotification(); } catch (error) { Logger.log(error.message); }
      });



      // Send real-time records of vas transactions at every 1 Minutes
      cron.schedule('*/30 * * * * *', async () => {
        // try { await this.vasTrans(); } catch (error) { Logger.log(error.message); }
      });

      // Sync terminals and merchants every 30 minutes
      cron.schedule('*/30 * * * *', async () => {
        // try { await this.merchSync(); } catch (error) { Logger.log(error.message); }
      });
      // Update terminal statistics every 30 minutes
      cron.schedule('*/30 * * * *', async () => {
        // try { await this.updateTermStat(); } catch (error) { Logger.log(error.message); }
      });
      // Run auto POS support every day[midnight]
      cron.schedule('0 0 * * *', async () => {
        // try { await this.posSupportNotify(); } catch (error) { Logger.log(error.message); }
      });
      // Send merchants notification of expected settlement every day[midnight]
      cron.schedule('0 0 * * *', async () => {
        // try { await this.merchExpectedSettlementNotify(); } catch (error) { Logger.log(error.message); }
      });
      // Send merchants notification of settlement every day[noon]
      cron.schedule('0 12 * * *', async () => {
        // try { await this.merchSettlementNotify(); } catch (error) { Logger.log(error.message); }
      });
    };
    worker.postMessage({});
  }
}

/**
* Send Merchants Transactions Summary Email
* @param {Array} settlements - Settlements
*/
const sendMerchTransEmail = async (settlement, expected = true) => {
  const email = settlement.merchant_email;
  if (!email || !validateEmail(email)) return;
  const emails = [email];

  let settlementDetails = '';

  if (!settlement.total_value) return;
  settlementDetails += `<br><strong>Merchant ID:</strong> ${settlement.merchant_id}<br><strong>Merchant Name:</strong> ${settlement.merchant_name}<br>`;
  if (expected) {
    settlementDetails += `<strong>Successful Transaction Amount:</strong> ${(settlement.successful_value || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}<br>
    <strong>Successful Transaction Volume:</strong> ${(settlement.successful_volume || 0).toLocaleString()}<br>
    <strong>Failed Transaction Amount:</strong> ${(settlement.failed_value || 0).toLocaleString()}<br>
    <strong>Failed Transaction Volume:</strong> ${(settlement.failed_volume || 0).toLocaleString()}<br><br>`;
  }
  settlementDetails += `<strong>Total Transaction Amount:</strong> ${(settlement.total_value || 0).toLocaleString()}<br>
  <strong>Total Transaction Volume:</strong> ${(settlement.total_volume || 0).toLocaleString()}<br>
  <strong>Interval:</strong> ${settlement.interval} hours<br>
  <strong>Date:</strong> ${settlement.transaction_date}<br>
  <br>`;

  if (!settlementDetails) return;

  const body = `
  <div style="font-size: 16px">
  <strong>Hello ${settlement.merchant_name},</strong><br>
  <br>
  Find below the summary of you ${expected ? 'transactions' : 'settlements'} for ${settlement.transaction_date}.<br>
  <br>
  <strong>Transaction Details:</strong><br>
  <br>
  
  ${settlementDetails}
  
  Thanks.<br>
  
  <br>
  © ${process.env.APP_NAME}<br>
  Powered by ITEX<br>
  </div>
  `;

  sendEmailSms({ emailRecipients: emails, emailBody: body, emailSubject: `${expected ? 'Transactions' : 'Settlements'} Summary for the Day: ${settlement.transaction_date}.` });
};

/**
* Send Same Day Settlement advice email
* @param {Number} hour - Settlement hour
* @param {Array} settlements - Settlements
*/
const sendSDSAdviceEmail = async (hour, settlements) => {
  const emails = await ConfigService.getKeyValue('sd_advice_emails');
  if (!emails || !emails.length) return;

  const link = `${process.env.UI_URL}/settlements/same-day`;
  let settlementDetails = '';

  for (const settlement of settlements) {
    if (!settlement.total_value) continue;
    settlementDetails += `   <br> 
    <strong>Merchant ID:</strong> ${settlement.merchant_id}<br>
    <strong>Merchant Name:</strong> ${settlement.merchant_name}<br>
    <strong>Successful Transaction Amount:</strong> ${(settlement.successful_value || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}
    <br>
    <strong>Successful Transaction Volume:</strong> ${(settlement.successful_volume || 0).toLocaleString()}<br>
    <strong>Failed Transaction Amount:</strong> ${(settlement.failed_value || 0).toLocaleString()}<br>
    <strong>Failed Transaction Volume:</strong> ${(settlement.failed_volume || 0).toLocaleString()}<br><br>
    <strong>Total Transaction Amount:</strong> ${(settlement.total_value || 0).toLocaleString()}<br>
    <strong>Total Transaction Volume:</strong> ${(settlement.total_volume || 0).toLocaleString()}<br>
    <strong>Interval:</strong> ${settlement.interval} hours<br>
    <strong>Date:</strong> ${settlement.transaction_date} hours<br>
    <br>`;
  }
  if (!settlementDetails) return;

  hour = `${hour}`.padStart(2, 0);
  const body = `
  <div style="font-size: 16px">
  <strong>Good Day,</strong><br>
  <br>
  Find below the details of the merchants to be settled.<br>
  <strong>Hour of the Day: ${hour}:00</strong><br>
  <br>
  <strong>Settlement Details:</strong><br>
  <br>
  
  ${settlementDetails}
  
  <br>
  Kindly confirm on the platform when you settle these merchants.<br>
  <a href="${link}">${link}</a><br>
  Thanks.<br>
  
  <br>
  © ${process.env.APP_NAME}<br>
  Powered by ITEX<br>
  </div>
  `;

  sendEmailSms({ emailRecipients: emails, emailBody: body, emailSubject: `Settlement Advice for the Hour: ${hour}:00.` });
};

export default new CronService();
