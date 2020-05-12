import moment from 'moment';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-cycle
import { checkNumber, curDate, getRegExp } from '../../helpers/utils';
import { binConverter } from '../../helpers/utils'

class TransactionService {
  constructor() {
    this.Transaction = process.env.IS_MIDDLEWARE ? MwTransaction : Transaction;

    this.$match = {};
    if (process.env.IS_MIDDLEWARE) this.$match[transMod.getField('mti')] = '0200';
    if (process.env.BANK_TERM_PREFIXES) {
      const terms = process.env.BANK_TERM_PREFIXES.split(',').map(item => getRegExp(item.trim()));
      this.$match[transMod.getField('terminal_id')] = { $in: terms };
    }
    if (process.env.ITEX_USAGE) this.$match[transMod.getField('terminal_id')] = { $in: ITEX_TERMINALS };

    this.$limit = 50;
    this.$skip = 0;
  }

  setIDs(ids) {
    if (ids) {
      if (!Array.isArray(ids)) ids = [ids];
      ids = ids.map(id => mongoose.Types.ObjectId(id));
      console.log('ids :', ids);
      
      this.$match._id = { $in: ids };
    }
    return this;
  }

  setID(id) {
    if (id) {
      id =  mongoose.Types.ObjectId(id);
      this.$match._id = id;
    }
    return this;
  }


  setDate(start, end, range = 'd') {
    if (start) {
      this.$match[transMod.getField('transaction_date')] = {
        $gte: moment(start, 'YYYY-MM-DD')
          .tz(process.env.TZ)
          .startOf(range).toDate(),
        $lte: moment(end || start, 'YYYY-MM-DD')
          .tz(process.env.TZ)
          .endOf(range).toDate(),
      };
    }
    return this;
  }

  setLimit(limit) {
    if (checkNumber(limit)) this.$limit = parseInt(limit, 10);
    return this;
  }

  setPage(page) {
    if (page) {
      const pageNo = checkNumber(page) ? parseInt(page, 10) : 1;
      this.$skip = (pageNo - 1) * this.$limit;
    }
    return this;
  }

  setMerchant(mid) {
    if (mid) {
      if (!Array.isArray(mid)) mid = [mid];
      this.$match[transMod.getField('merchant_id')] = { $in: mid };
    }
    return this;
  }

  setTerminal(tid) {
    if (tid) {
      if (!Array.isArray(tid)) tid = [tid];
      this.$match[transMod.getField('terminal_id')] = { $in: tid };
    }
    return this;
  }

  setRRNs(rrns) {
    if (rrns) {
      if (!Array.isArray(rrns)) rrns = [rrns];
      this.$match[transMod.getField('rrn')] = { $in: rrns };
    }
    return this;
  }

  setStatus(status) {
    if (status) {
      const responseCode = {};
      const opr = status === 'failed' ? '$ne' : '$eq';
      responseCode[opr] = '00';
      this.$match[transMod.getField('response_code')] = responseCode;
    }
    return this;
  }

  setSearch(search) {
    const getSObj = (key) => {
      const obj = {};
      if (checkNumber(search)) obj[key] = { $eq: parseInt(search, 10) };
      else obj[key] = { $regex: getRegExp(search) };
      return obj;
    };

    if (search) {
      const $or = [];
      $or.push(getSObj(transMod.getField('terminal_id')));
      $or.push(getSObj(transMod.getField('merchant_id')));
      $or.push(getSObj(transMod.getField('merchant_name')));
      $or.push(getSObj(transMod.getField('stan')));
      $or.push(getSObj(transMod.getField('pan')));
      $or.push(getSObj(transMod.getField('rrn')));
      if (checkNumber(search)) $or.push(getSObj(transMod.getField('amount')));

      this.$match.$or = $or;
    }
    return this;
  }

  setSource(source) {
    if (source) this.$match[transMod.getField('handler_used')] = getRegExp(source);
    return this;
  }

  setSort(field, dir = 'desc') {
    if (field) {
      const sort = {};
      sort[field] = dir === 'asc' ? 1 : -1;
      this.$sort = sort;
    }
    return this;
  }

  setCountry(a2code) {
    if (a2code) this.$match.country_a2code = getRegExp(a2code);
    return this;
  }

  setSettled(status) {
    if (status) this.$match.settled = null || 'unsettled';
    return this;
  }

  async history() {
    const $project = {
      terminal_id: `$${transMod.getField('terminal_id')}`,
      amount: `$${transMod.getField('amount')}`,
      transaction_date: `$${transMod.getField('transaction_date')}`,
      merchant_id: `$${transMod.getField('merchant_id')}`,
      merchant_name: `$${transMod.getField('merchant_name')}`,
      rrn: `$${transMod.getField('rrn')}`,
      pan: `$${transMod.getField('pan')}`,
      authcode: `$${transMod.getField('authcode')}`,
      stan: `$${transMod.getField('stan')}`,
      response_msg: `$${transMod.getField('response_msg')}`,
      response_code: `$${transMod.getField('response_code')}`,
      country_code: `$${transMod.getField('country_code')}`,
      country_a2code: `$${transMod.getField('country_a2code')}`,
      currency_code: `$${transMod.getField('currency_code')}`,
      currency_symbol: `$${transMod.getField('currency_symbol')}`,
      bin: `$${transMod.getField('bin')}`,
      settled: `$settled`,
      panNo: { $substr: [`$${transMod.getField('pan')}`, 0, 6] },
    };
    const $sort = {};
    $sort[transMod.getField('transaction_date')] = -1;
    const transactions = await this.Transaction.aggregate([
      { $match: this.$match },
      { $sort },
      { $skip: this.$skip },
      { $limit: this.$limit },
      { $project },
    ]);
    transactions.map(item => {
      item.brand = binConverter(item.panNo) !== undefined ? binConverter(item.panNo).brand : 'NIL',
      item.bank = binConverter(item.panNo) !== undefined ? binConverter(item.panNo).bank : 'NIL'
    })
    return transactions;
  }

  async time() {
    const group = {
      _id: {
        $hour: {
          date: `$${transMod.getField('transaction_date')}`,
          timezone: process.env.TZ,
        },
      },
      total: { $sum: `$${transMod.getField('amount')}` },
    };

    const rows = await this.Transaction.aggregate([
      { $match: this.$match },
      { $group: group },
    ]);

    const data = [];

    const isToday = moment().diff((this.$match[transMod.getField('transaction_date')] || {}).$gte || curDate(), 'd') === 0;
    const hour = moment().hour();

    for (let i = 0; i < 24; i++) {
      const nullValue = isToday && i <= hour ? 0 : null;
      const allTransaction = rows.find(elem => elem._id === i);
      const allValue = allTransaction ? parseInt(allTransaction.total, 10) : nullValue;
      data[i] = allValue;
    }

    return data;
  }

  /**
  * Gets summary of transactions per type for given date
  * @param {Date} date
  */
  async summary(short = true) {
    const startDate = (this.$match[transMod.getField('transaction_date')] || {}).$gte || curDate();

    const group = {
      _id: {
        $dayOfMonth: {
          date: `$${transMod.getField('transaction_date')}`,
          timezone: process.env.TZ,
        },
      },
      total: { $sum: { $toDouble: `$${transMod.getField('amount')}` } },
      volume: { $sum: 1 },
    };

    const project = {
      _id: 0,
      year: {
        $year: {
          date: new Date(startDate),
          timezone: process.env.TZ,
        },
      },
      month: {
        $month: {
          date: new Date(startDate),
          timezone: process.env.TZ,
        },
      },
      day: '$_id',
      total: 1,
      volume: 1,
    };

    const { $match } = this;
    $match[transMod.getField('response_code')] = '00';

    let rows = await this.Transaction.aggregate([
      { $match },
      { $group: group },
      { $project: project },
    ]);
    rows = rows.map((item) => {
      if (item.year && item.month && item.day) {
        item.date = moment(`${item.year}-${item.month}-${item.day}`, 'YYYY-MM-DD').format('DD-MMM-YYYY');
      }
      return item;
    });
    rows.sort((a, b) => (a.day > b.day ? 1 : -1));

    if (short) return rows;

    $match[transMod.getField('response_code')] = { $ne: '00' };
    const failedTransactions = await this.Transaction.aggregate([
      { $match },
      { $group: group },
      { $project: project },
    ]).allowDiskUse(true);

    rows = rows.map((item) => {
      const rec = { date: moment(item.date, 'DD-MMM-YYYY').format('YYYY-MM-DD') };
      const failedTrans = failedTransactions.find(a => a.day === item.day) || {};
      rec.successful_volume = (item.volume || 0);
      rec.successful_value = (item.total || 0) / 100;
      rec.failed_volume = (failedTrans.volume || 0);
      rec.failed_value = (failedTrans.total || 0) / 100;
      rec.total_value = rec.successful_value + rec.failed_value;
      rec.total_volume = rec.successful_volume + rec.failed_volume;
      return rec;
    });

    return rows;
  }

  /**
  * Gets transaction statistics for given start and end dates
  * @param {Date} startDate
  * @param {Date} endDate
  */
  async stat() {
    const merchant_id = this.$match[transMod.getField('merchant_id')] || null;

    const statData = await this.Transaction.aggregate([
      { $match: this.$match },
      {
        $group: {
          _id: null,
          total_value: { $sum: `$${transMod.getField('amount')}` },
          total_volume: { $sum: 1 },
          terminals: { $addToSet: `$${transMod.getField('terminal_id')}` },
        },
      },
    ]);

    const { $match } = this;
    $match[transMod.getField('response_code')] = '00';

    const successCounter = await this.Transaction.aggregate([
      { $match },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: `$${transMod.getField('amount')}` },
          count: { $sum: 1 }
        }
      }
    ]);

    const data = (statData || [])[0] || {};
    const { total_value = 0, total_volume = 0, terminals = [] } = data;
    const success_count = ((successCounter || [])[0] || {}).count || 0;
    const success_value = ((successCounter || [])[0] || {}).totalAmount || 0;
    const failed_value = total_value - success_value;

    const success_percent = parseFloat((success_count * 100 / (total_volume || 1)).toFixed(2));
    const failed_count = total_volume - success_count;
    const failed_percent = parseFloat((100 - success_percent).toFixed(2));

    const terminal_count = await TerminalService.getAllCount(merchant_id);

    const utilized_terminals = terminals.length;
    const utilized_terminals_percent = parseFloat((utilized_terminals * 100 / (terminal_count || 1)).toFixed(2));
    let non_utilized_terminals = terminal_count - utilized_terminals;
    non_utilized_terminals = non_utilized_terminals < 0 ? 0 : non_utilized_terminals;
    let non_utilized_terminals_percent = parseFloat((100 - utilized_terminals_percent).toFixed(2));
    non_utilized_terminals_percent = non_utilized_terminals_percent < 0 ? 0 : non_utilized_terminals_percent;

    return {
      total_value,
      total_volume,
      success_count,
      success_value,
      success_percent,
      failed_count,
      failed_value,
      failed_percent,
      utilized_terminals,
      utilized_terminals_percent,
      non_utilized_terminals,
      non_utilized_terminals_percent,
    };
  }

  /**
  * Gets transaction statistics for given start and end dates
  * @param {Date} startDate
  * @param {Date} endDate
  */
  async statSummary() {
    const merchant_id = this.$match[transMod.getField('merchant_id')] || null;

    const statData = await this.Transaction.aggregate([
      { $match: this.$match },
      {
        $group: {
          _id: null,
          total_value: { $sum: `$${transMod.getField('amount')}` },
        },
      },
    ]);

    const { $match } = this;
    $match[transMod.getField('response_code')] = '00';

    const successCounter = await this.Transaction.aggregate([
      { $match },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: `$${transMod.getField('amount')}` },
        }
      }
    ]);

    const data = (statData || [])[0] || {};
    const { total_value = 0 } = data;
    const success_value = ((successCounter || [])[0] || {}).totalAmount || 0;
    const failed_value = total_value - success_value;


    return {
      total_value,
      success_value,
      failed_value,
    };
  }
  
  async failureReason() {
    const $group = {
      _id: { message: `$${transMod.getField('response_msg')}` },
      responses: { $sum: 1 },
    };

    const $project = {
      _id: 0,
      message: '$_id.message',
      count: '$responses',
    };

    const reasons = await this.Transaction.aggregate([
      { $match: this.$match },
      { $group },
      { $project },
      { $sort: { count: -1 } },
    ]);
    return reasons;
  }

  /**
  * This returns the aggregate transactions for every merchants for given filter in $match
  */
  async merchSummary() {
    const group = {
      _id: { merchant_id: `$${transMod.getField('merchant_id')}` },
      trans_value: { $sum: `$${transMod.getField('amount')}` },
      trans_volume: { $sum: 1 },
      active_terminals: { $addToSet: `$${transMod.getField('terminal_id')}` },
    };

    const $project = {
      _id: 0,
      merchant_id: '$_id.merchant_id',
      trans_value: '$trans_value',
      trans_volume: '$trans_volume',
      active_terminals: { $size: '$active_terminals' },
    };

    const { $match } = this;
    $match[transMod.getField('response_code')] = '00';

    let rows = await this.Transaction.aggregate([
      { $match },
      { $group: group },
      { $sort: { trans_value: -1 } },
      { $skip: this.$skip },
      { $limit: this.$limit },
      { $project },
    ]).allowDiskUse(true);

    const merchantIds = rows.map(a => a.merchant_id);
    $match[transMod.getField('response_code')] = { $ne: '00' };
    $match[transMod.getField('merchant_id')] = { $in: merchantIds };

    const failedTransactions = await this.Transaction.aggregate([
      { $match },
      { $group: group },
      { $project },
    ]).allowDiskUse(true);

    rows = rows.map((item) => {
      const rec = { merchant_id: item.merchant_id, merchant_name: item.merchant_name };
      const failedTrans = failedTransactions.find(a => a.merchant_id === item.merchant_id) || {};
      rec.successful_volume = (item.trans_volume || 0);
      rec.successful_value = (item.trans_value || 0) / 100;
      rec.failed_volume = (failedTrans.trans_volume || 0);
      rec.failed_value = (failedTrans.trans_value || 0) / 100;
      rec.total_value = rec.successful_value + rec.failed_value;
      rec.total_volume = rec.successful_volume + rec.failed_volume;
      return rec;
    });

    return rows;
  }

  /**
  * This returns the aggregate transactions for every merchants for given dates
  * It does same for previous date range and compare to get value and volume changes
  * @param {Date} startDate
  * @param {Date} endDate
  * @param {String} sort - Field to sort with
  * @param {String} dir - Sort direction
  * @param {Number} page
  * @param {Number} limit
  */
  async performance(type = 'merchant') {
    const $group = {
      trans_value: { $sum: `$${transMod.getField('amount')}` },
      trans_volume: { $sum: 1 },
    };

    const $project = {
      _id: 0,
      merchant_name: 1,
      trans_value: '$trans_value',
      trans_volume: '$trans_volume',
    };

    if (type === 'merchant') {
      $group._id = { merchant_id: `$${transMod.getField('merchant_id')}` };
      $group.active_terminals = { $addToSet: `$${transMod.getField('terminal_id')}` };
      $group.merchant_name = { $first: `$${transMod.getField('merchant_name')}` };

      $project.merchant_id = '$_id.merchant_id';
      $project.active_terminals = { $size: '$active_terminals' };
    } else {
      $group._id = { terminal_id: `$${transMod.getField('terminal_id')}` };

      $project.terminal_id = '$_id.terminal_id';
    }

    const totalGroup = {
      _id: null,
      total_volume: { $sum: '$trans_volume' },
      total_value: { $sum: '$trans_value' },
    };

    const $facet = {
      rows: [{ $skip: this.$skip }, { $limit: this.$limit }],
      total: [{ $group: totalGroup }],
    };

    const pipelines = [
      { $match: this.$match },
      { $group },
      { $project },
    ];

    if (this.$sort) {
      pipelines.push({ $sort: this.$sort });
    }
    pipelines.push({ $facet });

    let transData = await this.Transaction.aggregate(pipelines).allowDiskUse(true);
    [transData = {}] = transData;

    const transactions = transData.rows || [];
    const summary = { ...(transData.total || [])[0] };
    delete summary._id;

    return { transactions, summary };
  }

  /**
   * Get Terminals statistics from transactions, online or active terminal count
   * @param {String} type - can be 'online' or 'active'
   */
  async transTermStat(type, merchant_id = null) {
    let secs = 0;
    if (type === 'active') secs = await ConfigService.getKeyValue('active_terminal_seconds') || 7 * 24 * 60 * 60;
    else secs = await ConfigService.getKeyValue('online_terminal_seconds') || 30;

    const last = new Date((new Date()).getTime() - (secs * 1000));
    const { $match } = this;
    $match[transMod.getField('transaction_date')] = { $gt: last };
    if (merchant_id) $match[transMod.getField('merchant_id')] = merchant_id;

    const stat = await this.Transaction.aggregate([
      { $match },
      { $group: { _id: { terminal: `$${transMod.getField('terminal_id')}` } } },
      { $count: 'count' },
    ]);

    return ((stat || [])[0] || {}).count || 0;
  }

  async terminalIDs() {
    const { $match } = this;
    const trans = await this.Transaction.aggregate([
      { $match },
      { $group: { _id: `$${transMod.getField('terminal_id')}` } },
    ]);
    return trans.map(item => item._id);
  }

  /**
   * Gets summary of transactions per type for given date
   * @param {Date} date
   */
  async bankSummary(type = 'month') {
    const endDate = this.$match[transMod.getField('transaction_date')].$lte;
    const startDate = this.$match[transMod.getField('transaction_date')].$gte;

    const group = {
      _id: {
        day: {
          $dayOfMonth: {
            date: `$${transMod.getField('transaction_date')}`,
            timezone: process.env.TZ,
          },
        },
        terminal: `$${transMod.getField('terminal_id')}`,
      },
      total: { $sum: { $toDouble: `$${transMod.getField('amount')}` } },
      volume: { $sum: 1 },
      bank: { $addToSet: { $substr: [`$${transMod.getField('terminal_id')}`, 0, 4] } },
    };

    const project = {
      _id: 0,
      year: {
        $year: {
          date: new Date(startDate),
          timezone: process.env.TZ,
        },
      },
      month: {
        $month: {
          date: new Date(startDate),
          timezone: process.env.TZ,
        },
      },
      day: '$_id.day',
      total: 1,
      total_settlement: 1,
      volume: 1,
      charge: 1,
      terminal: '$_id.terminal',
      bank: '$_id.bank',
    };

    const group2 = {
      _id: {
        bank: '$bank',
        day: '$_id.day',
      },
      total: { $sum: { $toDouble: '$total' } },
      volume: { $sum: '$volume' },
    };

    let rows = await this.Transaction.aggregate([
      { $match: this.$match },
      { $group: group },
      { $unwind: '$bank' },
      { $group: group2 },
      { $project: project },
    ]).allowDiskUse(true);
    rows.sort((a, b) => (a.day > b.day ? 1 : -1));

    if (type === 'd' && !rows.length) {
      rows.push({
        year: moment(startDate).year(),
        month: moment(startDate).month() + 1,
        day: moment(startDate).date(),
        total: 0,
        total_settlement: 0,
        volume: 0,
        charge: 0,
      });
    } else if (type !== 'd') {
      const startDay = moment(startDate).date();
      const endDay = moment(endDate).date();
      for (let i = startDay; i <= endDay; i++) {
        if (!rows.find(item => item.day === i)) {
          rows.push({
            year: moment(endDate).date(i).year(),
            month: moment(endDate).date(i).month() + 1,
            day: i,
            total: 0,
            total_settlement: 0,
            volume: 0,
            charge: 0,
          });
        }
      }
    }

    rows = rows.map((item) => {
      if (item.year && item.month && item.day) {
        item.date = moment(`${item.year}-${item.month}-${item.day}`, 'YYYY-MM-DD').format('DD-MMM-YYYY');
      }
      return item;
    });

    return rows;
  }
}

export default TransactionService;
