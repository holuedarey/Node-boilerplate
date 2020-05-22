'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _maxSafeInteger = require('babel-runtime/core-js/number/max-safe-integer');

var _maxSafeInteger2 = _interopRequireDefault(_maxSafeInteger);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _webworkerThreads = require('webworker-threads');

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _SettlementSDConfig = require('../mongodb/models/SettlementSDConfig');

var _SettlementSDConfig2 = _interopRequireDefault(_SettlementSDConfig);

var _SettlementSD = require('../mongodb/models/SettlementSD');

var _SettlementSD2 = _interopRequireDefault(_SettlementSD);

var _emailSender = require('../../helpers/emailSender');

var _emailSender2 = _interopRequireDefault(_emailSender);

var _Logger = require('../../helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _SettlementSDTrans = require('../mongodb/models/SettlementSDTrans');

var _SettlementSDTrans2 = _interopRequireDefault(_SettlementSDTrans);

var _socket = require('../../socket');

var _utils = require('../../helpers/utils');

var _ConfigService = require('./ConfigService');

var _ConfigService2 = _interopRequireDefault(_ConfigService);

var _MerchantService = require('./sql/MerchantService');

var _MerchantService2 = _interopRequireDefault(_MerchantService);

var _TerminalService = require('./sql/TerminalService');

var _TerminalService2 = _interopRequireDefault(_TerminalService);

var _Merchant = require('../mongodb/models/Merchant');

var _Merchant2 = _interopRequireDefault(_Merchant);

var _Terminal = require('../mongodb/models/Terminal');

var _Terminal2 = _interopRequireDefault(_Terminal);

var _MerchantService3 = require('./MerchantService');

var _MerchantService4 = _interopRequireDefault(_MerchantService3);

var _MwTransaction = require('../mongodb/middleware/models/MwTransaction');

var _MwTransaction2 = _interopRequireDefault(_MwTransaction);

var _Transaction = require('../mongodb/models/Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _TermStateService = require('./middleware/TermStateService');

var _TermStateService2 = _interopRequireDefault(_TermStateService);

var _MwTermState = require('../mongodb/middleware/models/MwTermState');

var _MwTermState2 = _interopRequireDefault(_MwTermState);

var _BankTerminal = require('../mongodb/models/BankTerminal');

var _BankTerminal2 = _interopRequireDefault(_BankTerminal);

var _BankMerchant = require('../mongodb/models/BankMerchant');

var _BankMerchant2 = _interopRequireDefault(_BankMerchant);

var _TransactionService = require('./TransactionService');

var _TransactionService2 = _interopRequireDefault(_TransactionService);

var _SettlementService = require('./SettlementService');

var _SettlementService2 = _interopRequireDefault(_SettlementService);

var _XLSXGen = require('../../lib/XLSXGen');

var _XLSXGen2 = _interopRequireDefault(_XLSXGen);

var _ftpimp = require('ftpimp');

var _ftpimp2 = _interopRequireDefault(_ftpimp);

var _XLSXReader = require('../../lib/XLSXReader');

var _XLSXReader2 = _interopRequireDefault(_XLSXReader);

var _VasReport = require('../mongodb/middleware/models/VasReport');

var _VasReport2 = _interopRequireDefault(_VasReport);

var _MwVasReport = require('../mongodb/middleware/models/MwVasReport');

var _MwVasReport2 = _interopRequireDefault(_MwVasReport);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @class Cron Service
* Handle scheduled jobs and all cron related processes
*/
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
var CronService = function () {
  function CronService() {
    (0, _classCallCheck3.default)(this, CronService);
  }

  (0, _createClass3.default)(CronService, [{
    key: 'syncBankMerTerm',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(prefixs) {
        var $in, terms, mids, merchs;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                $in = prefixs.map(function (item) {
                  return (0, _utils.getRegExp)(item);
                });
                _context.next = 3;
                return _Terminal2.default.find({ terminal_id: { $in: $in } });

              case 3:
                terms = _context.sent;
                mids = terms.map(function (item) {
                  return item.merchant_id;
                });
                _context.next = 7;
                return _Merchant2.default.find({ merchant_id: { $in: mids } });

              case 7:
                merchs = _context.sent;
                _context.prev = 8;
                _context.next = 11;
                return _BankTerminal2.default.insertMany(terms, { ordered: false, rawResult: true });

              case 11:
                _context.next = 13;
                return _BankMerchant2.default.insertMany(merchs, { ordered: false, rawResult: true });

              case 13:
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context['catch'](8);
                _Logger2.default.log(_context.t0.message);

              case 18:
                _Logger2.default.log('syncBankMerTerms ran.');

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 15]]);
      }));

      function syncBankMerTerm(_x) {
        return _ref.apply(this, arguments);
      }

      return syncBankMerTerm;
    }()
  }, {
    key: 'syncTrans',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var $skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var lastSkip, $limit, $match, $project, transactions;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t1 = $skip;

                if (_context2.t1) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 4;
                return _ConfigService2.default.getKeyValue('sync_trans_last_skip');

              case 4:
                _context2.t1 = _context2.sent;

              case 5:
                _context2.t0 = _context2.t1;

                if (_context2.t0) {
                  _context2.next = 8;
                  break;
                }

                _context2.t0 = 0;

              case 8:
                lastSkip = _context2.t0;


                $skip = lastSkip || 0;
                $limit = 500;
                $match = {
                  transactionTime: { $gte: new Date('2019-09-01') },
                  responseCode: { $exists: true }
                };
                $project = {
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
                  mti: '$MTI'
                };
                _context2.next = 15;
                return _MwTransaction2.default.aggregate([{ $match: $match }, { $sort: { transactionTime: 1 } }, { $skip: $skip }, { $limit: $limit }, { $project: $project }]);

              case 15:
                transactions = _context2.sent;
                _context2.prev = 16;
                _context2.next = 19;
                return _Transaction2.default.insertMany(transactions, { ordered: false, rawResult: true });

              case 19:
                _context2.next = 24;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t2 = _context2['catch'](16);
                _Logger2.default.log(_context2.t2.message);

              case 24:

                _Logger2.default.log($skip);
                _context2.next = 27;
                return _ConfigService2.default.setKeyValue('sync_trans_last_skip', $skip += transactions.length);

              case 27:
                if (transactions.length === 500) this.syncTrans($skip);

              case 28:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[16, 21]]);
      }));

      function syncTrans() {
        return _ref2.apply(this, arguments);
      }

      return syncTrans;
    }()

    /**
    * This handles getting transactions summary for merchants.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'vasTrans',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var $skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var $limit, lastSkip, $match, transactions, data;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                $limit = 500;
                // const lastSkip = $skip || await ConfigService.getKeyValue('sync_vas_trans_last_skip') || '2020-03-31T23:59:59Z';
                // $skip = lastSkip;
                // console.log('skip value: ', lastSkip);

                _context3.next = 3;
                return _VasReport2.default.find({}).limit(1).sort({ _id: -1 }).select('createdAt');

              case 3:
                lastSkip = _context3.sent;


                if (lastSkip.length) {
                  $skip = lastSkip[0].createdAt;
                } else {
                  $skip = '2020-03-31T23:59:59Z';
                }

                _context3.prev = 5;
                $match = {
                  'data.product.paymentMethod': 'card',
                  'createdAt': { $gt: $skip }
                };

                console.log('match : ', $match);
                _context3.next = 10;
                return _MwVasReport2.default.find($match).limit($limit);

              case 10:
                transactions = _context3.sent;

                console.log('trans : ', transactions);
                data = transactions.map(function (trans) {
                  var responseData = {};
                  responseData["_id"] = trans._id;
                  responseData["createdAt"] = trans.createdAt;
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
                });

                // console.log('data: ', data) 
                // console.log('new :', data);

                //save bulk transaction 

                _context3.next = 15;
                return _VasReport2.default.insertMany(data, { ordered: false, rawResult: true });

              case 15:
                _context3.next = 17;
                return _ConfigService2.default.setKeyValue('sync_vas_trans_last_skip', $skip);

              case 17:
                _Logger2.default.log('Pulling Done with last id ', $skip);
                _context3.next = 23;
                break;

              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3['catch'](5);
                console.log(_context3.t0);
              case 23:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 20]]);
      }));

      function vasTrans() {
        return _ref3.apply(this, arguments);
      }

      return vasTrans;
    }()
  }, {
    key: 'syncTermStat',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var lastSkip, limit, termis, tids, terms, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, term;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.t0 = skip;

                if (_context4.t0) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 4;
                return _ConfigService2.default.getKeyValue('term_stat_l_skip');

              case 4:
                _context4.t0 = _context4.sent;

              case 5:
                lastSkip = _context4.t0;
                limit = 500;
                _context4.next = 9;
                return _Terminal2.default.find({}).skip(lastSkip).limit(limit);

              case 9:
                termis = _context4.sent;
                tids = termis.map(function (item) {
                  return item.terminal_id;
                });
                _context4.next = 13;
                return _TermStateService2.default.syncTermStates(tids);

              case 13:
                terms = _context4.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 17;
                _iterator = (0, _getIterator3.default)(terms);

              case 19:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 26;
                  break;
                }

                term = _step.value;
                _context4.next = 23;
                return _Terminal2.default.updateOne({ terminal_id: term.terminal_id }, { $set: term });

              case 23:
                _iteratorNormalCompletion = true;
                _context4.next = 19;
                break;

              case 26:
                _context4.next = 32;
                break;

              case 28:
                _context4.prev = 28;
                _context4.t1 = _context4['catch'](17);
                _didIteratorError = true;
                _iteratorError = _context4.t1;

              case 32:
                _context4.prev = 32;
                _context4.prev = 33;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 35:
                _context4.prev = 35;

                if (!_didIteratorError) {
                  _context4.next = 38;
                  break;
                }

                throw _iteratorError;

              case 38:
                return _context4.finish(35);

              case 39:
                return _context4.finish(32);

              case 40:

                _Logger2.default.log(skip + termis.length);
                if (termis.length === limit) this.syncTermStat(skip + termis.length);else _Logger2.default.log('Term Stat Sync Done!!!');

              case 42:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[17, 28, 32, 40], [33,, 35, 39]]);
      }));

      function syncTermStat() {
        return _ref4.apply(this, arguments);
      }

      return syncTermStat;
    }()
  }, {
    key: 'deleteMerchWithoutTermID',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var $skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var lastSkip, skip, limit, merchs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, merch, term;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.t1 = $skip;

                if (_context5.t1) {
                  _context5.next = 5;
                  break;
                }

                _context5.next = 4;
                return _ConfigService2.default.getKeyValue('mongo_dele_merch_last_skip');

              case 4:
                _context5.t1 = _context5.sent;

              case 5:
                _context5.t0 = _context5.t1;

                if (_context5.t0) {
                  _context5.next = 8;
                  break;
                }

                _context5.t0 = 0;

              case 8:
                lastSkip = _context5.t0;
                skip = lastSkip || 0;
                limit = 1000;
                _context5.next = 13;
                return _Merchant2.default.find({}).skip(skip).limit(limit).lean();

              case 13:
                merchs = _context5.sent;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context5.prev = 17;
                _iterator2 = (0, _getIterator3.default)(merchs);

              case 19:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context5.next = 30;
                  break;
                }

                merch = _step2.value;
                _context5.next = 23;
                return _Terminal2.default.findOne({ merchant_id: merch.merchant_id });

              case 23:
                term = _context5.sent;

                if (term) {
                  _context5.next = 27;
                  break;
                }

                _context5.next = 27;
                return _Merchant2.default.deleteOne({ merchant_id: merch.merchant_id });

              case 27:
                _iteratorNormalCompletion2 = true;
                _context5.next = 19;
                break;

              case 30:
                _context5.next = 36;
                break;

              case 32:
                _context5.prev = 32;
                _context5.t2 = _context5['catch'](17);
                _didIteratorError2 = true;
                _iteratorError2 = _context5.t2;

              case 36:
                _context5.prev = 36;
                _context5.prev = 37;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 39:
                _context5.prev = 39;

                if (!_didIteratorError2) {
                  _context5.next = 42;
                  break;
                }

                throw _iteratorError2;

              case 42:
                return _context5.finish(39);

              case 43:
                return _context5.finish(36);

              case 44:

                skip += merchs.length;
                _context5.next = 47;
                return _ConfigService2.default.setKeyValue('mongo_resolve_last_skip', skip);

              case 47:
                _Logger2.default.log(skip);

                if (!(merchs.length === limit)) {
                  _context5.next = 50;
                  break;
                }

                return _context5.abrupt('return', this.deleteMerchWithoutTermID(skip));

              case 50:
                _Logger2.default.log('Done');
                return _context5.abrupt('return', false);

              case 52:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[17, 32, 36, 44], [37,, 39, 43]]);
      }));

      function deleteMerchWithoutTermID() {
        return _ref5.apply(this, arguments);
      }

      return deleteMerchWithoutTermID;
    }()
  }, {
    key: 'resolveMerch',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var _this = this;

        var $skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var lastSkip, skip, limit, terminals, tids, trans, _loop, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, _ret;

        return _regenerator2.default.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.t1 = $skip;

                if (_context7.t1) {
                  _context7.next = 5;
                  break;
                }

                _context7.next = 4;
                return _ConfigService2.default.getKeyValue('mongo_resolve_last_skip');

              case 4:
                _context7.t1 = _context7.sent;

              case 5:
                _context7.t0 = _context7.t1;

                if (_context7.t0) {
                  _context7.next = 8;
                  break;
                }

                _context7.t0 = 0;

              case 8:
                lastSkip = _context7.t0;
                skip = lastSkip || 0;
                limit = 500;
                _context7.next = 13;
                return _Terminal2.default.find({}).skip(skip).limit(limit).lean();

              case 13:
                terminals = _context7.sent;

                skip += terminals.length;

                if (terminals.length) {
                  _context7.next = 18;
                  break;
                }

                _Logger2.default.log('Ran resolveMerch.');
                return _context7.abrupt('return', false);

              case 18:
                tids = terminals.map(function (item) {
                  return item.terminal_id;
                });
                _context7.next = 21;
                return _MwTransaction2.default.aggregate([{ $match: { terminalId: { $in: tids } } }, {
                  $group: {
                    _id: '$terminalId',
                    merchant_name: { $last: '$merchantName' },
                    merchant_address: { $last: '$merchantAddress' },
                    merchant_id: { $last: '$merchantId' },
                    terminal_id: { $last: '$terminalId' }
                  }
                }]);

              case 21:
                trans = _context7.sent;
                _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(item) {
                  var terminal, term, merchant, mm_id;
                  return _regenerator2.default.wrap(function _loop$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          terminal = terminals.find(function (rec) {
                            return rec.terminal_id === item.terminal_id;
                          });

                          if (terminal) {
                            _context6.next = 3;
                            break;
                          }

                          return _context6.abrupt('return', 'continue');

                        case 3:
                          _context6.prev = 3;
                          _context6.next = 6;
                          return _Terminal2.default.findOne({
                            merchant_id: terminal.merchant_id || '',
                            tams_mid: { $exists: false }
                          });

                        case 6:
                          term = _context6.sent;
                          _context6.next = 9;
                          return _Merchant2.default.findOne({ merchant_id: terminal.merchant_id });

                        case 9:
                          merchant = _context6.sent;

                          if (!merchant) {
                            _context6.next = 27;
                            break;
                          }

                          mm_id = merchant.merchant_id;

                          merchant.tams_mid = merchant.merchant_id;
                          merchant.merchant_id = item.merchant_id;
                          _context6.prev = 14;
                          _context6.next = 17;
                          return merchant.save();

                        case 17:
                          _context6.next = 27;
                          break;

                        case 19:
                          _context6.prev = 19;
                          _context6.t0 = _context6['catch'](14);

                          if (!(_context6.t0.code === 11000)) {
                            _context6.next = 26;
                            break;
                          }

                          _context6.next = 24;
                          return _Merchant2.default.updateOne({ merchant_id: item.merchant_id }, { $addToSet: { tams_mids: mm_id } });

                        case 24:
                          _context6.next = 26;
                          return _Merchant2.default.updateOne({ merchant_id: mm_id }, { $set: { mid_link: item.merchant_id } });

                        case 26:
                          _Logger2.default.log(_context6.t0.code, _context6.t0.message);

                        case 27:
                          if (!term) {
                            _context6.next = 38;
                            break;
                          }

                          term.tams_mid = term.merchant_id;
                          term.merchant_id = item.merchant_id;
                          _context6.prev = 30;
                          _context6.next = 33;
                          return term.save();

                        case 33:
                          _context6.next = 38;
                          break;

                        case 35:
                          _context6.prev = 35;
                          _context6.t1 = _context6['catch'](30);

                          _Logger2.default.log(_context6.t1.message);

                        case 38:
                          _context6.next = 43;
                          break;

                        case 40:
                          _context6.prev = 40;
                          _context6.t2 = _context6['catch'](3);
                          _Logger2.default.log(_context6.t2.message);
                        case 43:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _loop, _this, [[3, 40], [14, 19], [30, 35]]);
                });
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context7.prev = 26;
                _iterator3 = (0, _getIterator3.default)(trans);

              case 28:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context7.next = 37;
                  break;
                }

                item = _step3.value;
                return _context7.delegateYield(_loop(item), 't2', 31);

              case 31:
                _ret = _context7.t2;

                if (!(_ret === 'continue')) {
                  _context7.next = 34;
                  break;
                }

                return _context7.abrupt('continue', 34);

              case 34:
                _iteratorNormalCompletion3 = true;
                _context7.next = 28;
                break;

              case 37:
                _context7.next = 43;
                break;

              case 39:
                _context7.prev = 39;
                _context7.t3 = _context7['catch'](26);
                _didIteratorError3 = true;
                _iteratorError3 = _context7.t3;

              case 43:
                _context7.prev = 43;
                _context7.prev = 44;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 46:
                _context7.prev = 46;

                if (!_didIteratorError3) {
                  _context7.next = 49;
                  break;
                }

                throw _iteratorError3;

              case 49:
                return _context7.finish(46);

              case 50:
                return _context7.finish(43);

              case 51:
                _context7.next = 53;
                return _ConfigService2.default.setKeyValue('mongo_resolve_last_skip', skip);

              case 53:
                _Logger2.default.log(skip);

                if (!(terminals.length === limit)) {
                  _context7.next = 56;
                  break;
                }

                return _context7.abrupt('return', this.resolveMerch(skip));

              case 56:
                this.deleteMerchWithoutTermID();
                return _context7.abrupt('return', this.syncTermStat());

              case 58:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee6, this, [[26, 39, 43, 51], [44,, 46, 50]]);
      }));

      function resolveMerch() {
        return _ref6.apply(this, arguments);
      }

      return resolveMerch;
    }()

    /**
    * Processes merchants terminals synchronization
    */

  }, {
    key: 'termSync',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var limit, tLastId, terminalsData, terminals;
        return _regenerator2.default.wrap(function _callee7$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                limit = 500;
                _context8.next = 3;
                return _ConfigService2.default.getKeyValue('term_sync_last_id');

              case 3:
                _context8.t0 = _context8.sent;

                if (_context8.t0) {
                  _context8.next = 6;
                  break;
                }

                _context8.t0 = 0;

              case 6:
                tLastId = _context8.t0;

                _Logger2.default.log('merchTermSync invoked with lastIDs; t:', tLastId);

                _context8.next = 10;
                return _TerminalService2.default.getTerminals(1, limit, null, tLastId);

              case 10:
                terminalsData = _context8.sent;

                _Logger2.default.log(tLastId);
                terminals = terminalsData.rows;

                if (!terminals.length) {
                  _context8.next = 25;
                  break;
                }

                _context8.prev = 14;
                _context8.next = 17;
                return _Terminal2.default.insertMany(terminals, { ordered: false, rawResult: true });

              case 17:
                _context8.next = 22;
                break;

              case 19:
                _context8.prev = 19;
                _context8.t1 = _context8['catch'](14);
                _Logger2.default.log(_context8.t1.message);

              case 22:
                tLastId = terminals.pop().id;
                _context8.next = 26;
                break;

              case 25:
                _Logger2.default.log('No terminals data.');

              case 26:
                _context8.next = 28;
                return _ConfigService2.default.setKeyValue('term_sync_last_id', tLastId);

              case 28:

                _Logger2.default.log(tLastId, terminals.length);

                if (!(limit - 1 === terminals.length)) {
                  _context8.next = 31;
                  break;
                }

                return _context8.abrupt('return', this.termSync());

              case 31:
                _Logger2.default.log('Merchant sync ran, with lastIDs, t:', tLastId);
                return _context8.abrupt('return', this.resolveMerch());

              case 33:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee7, this, [[14, 19]]);
      }));

      function termSync() {
        return _ref7.apply(this, arguments);
      }

      return termSync;
    }()

    /**
    * Processes merchants terminals synchronization
    */

  }, {
    key: 'merchSync',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var limit, mLastId, merchantsData, merchants;
        return _regenerator2.default.wrap(function _callee8$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(process.env.CHECK_SQL !== 'true')) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt('return', false);

              case 2:
                limit = 500;
                _context9.next = 5;
                return _ConfigService2.default.getKeyValue('merch_sync_last_id');

              case 5:
                _context9.t0 = _context9.sent;

                if (_context9.t0) {
                  _context9.next = 8;
                  break;
                }

                _context9.t0 = 0;

              case 8:
                mLastId = _context9.t0;

                _Logger2.default.log('merchTermSync invoked with lastIDs; m:', mLastId);

                _context9.next = 12;
                return _MerchantService2.default.getMerchants(1, limit, null, mLastId);

              case 12:
                merchantsData = _context9.sent;
                merchants = merchantsData.rows;

                if (!merchants.length) {
                  _context9.next = 26;
                  break;
                }

                _context9.prev = 15;
                _context9.next = 18;
                return _Merchant2.default.insertMany(merchants, { ordered: false, rawResult: true });

              case 18:
                _context9.next = 23;
                break;

              case 20:
                _context9.prev = 20;
                _context9.t1 = _context9['catch'](15);
                _Logger2.default.log(_context9.t1.message);

              case 23:
                mLastId = merchants.pop().id;
                _context9.next = 27;
                break;

              case 26:
                _Logger2.default.log('No merchants data.');

              case 27:
                _context9.next = 29;
                return _ConfigService2.default.setKeyValue('merch_sync_last_id', mLastId);

              case 29:

                _Logger2.default.log(mLastId, merchants.length);

                if (!(limit - 1 === merchants.length)) {
                  _context9.next = 32;
                  break;
                }

                return _context9.abrupt('return', this.merchSync());

              case 32:
                _Logger2.default.log('Merchant sync ran, with lastIDs, m:', mLastId);
                return _context9.abrupt('return', this.termSync());

              case 34:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee8, this, [[15, 20]]);
      }));

      function merchSync() {
        return _ref8.apply(this, arguments);
      }

      return merchSync;
    }()
  }, {
    key: 'merchExpectedSettlementNotify',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        var _this2 = this;

        var date, limit, run, page, runRes, count;
        return _regenerator2.default.wrap(function _callee10$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (process.env.MERCH_SUMMARY_NOTIFY) {
                  _context11.next = 2;
                  break;
                }

                return _context11.abrupt('return');

              case 2:
                date = (0, _utils.curDate)();
                limit = 100;

                run = function () {
                  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                    var tranServ, transData, merchantIDs, merchants, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, trans;

                    return _regenerator2.default.wrap(function _callee9$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            tranServ = new _TransactionService2.default();

                            tranServ.setDate(date).setPage(page);
                            // const data = await TransactionService2.getMerchTransSummary(date, date, page, limit);
                            _context10.next = 4;
                            return tranServ.merchSummary();

                          case 4:
                            transData = _context10.sent;
                            merchantIDs = transData.map(function (a) {
                              return a.merchant_id;
                            });
                            _context10.next = 8;
                            return _MerchantService4.default.getMerchantsForIds(merchantIDs);

                          case 8:
                            merchants = _context10.sent;

                            transData = transData.map(function (item) {
                              var merchant = merchants.find(function (a) {
                                return a.merchant_id === item.merchant_id;
                              }) || {};
                              return (0, _extends3.default)({}, item, {
                                merchant_email: merchant.merchant_email || null,
                                merchant_phone: merchant.merchant_phone || null,
                                merchant_name: merchant.merchant_name || null,
                                transaction_date: date,
                                interval: 24
                              });
                            });
                            // eslint-disable-next-line no-use-before-define
                            _iteratorNormalCompletion4 = true;
                            _didIteratorError4 = false;
                            _iteratorError4 = undefined;
                            _context10.prev = 13;
                            for (_iterator4 = (0, _getIterator3.default)(transData); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                              trans = _step4.value;
                              sendMerchTransEmail(trans);
                            }_context10.next = 21;
                            break;

                          case 17:
                            _context10.prev = 17;
                            _context10.t0 = _context10['catch'](13);
                            _didIteratorError4 = true;
                            _iteratorError4 = _context10.t0;

                          case 21:
                            _context10.prev = 21;
                            _context10.prev = 22;

                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                              _iterator4.return();
                            }

                          case 24:
                            _context10.prev = 24;

                            if (!_didIteratorError4) {
                              _context10.next = 27;
                              break;
                            }

                            throw _iteratorError4;

                          case 27:
                            return _context10.finish(24);

                          case 28:
                            return _context10.finish(21);

                          case 29:
                            return _context10.abrupt('return', { count: transData.length });

                          case 30:
                          case 'end':
                            return _context10.stop();
                        }
                      }
                    }, _callee9, _this2, [[13, 17, 21, 29], [22,, 24, 28]]);
                  }));

                  return function run() {
                    return _ref10.apply(this, arguments);
                  };
                }();

                page = 0;
                // eslint-disable-next-line no-constant-condition

              case 6:
                if (!true) {
                  _context11.next = 16;
                  break;
                }

                page++;
                _context11.next = 10;
                return run(page);

              case 10:
                runRes = _context11.sent;
                count = runRes.count;

                if (!(count < limit)) {
                  _context11.next = 14;
                  break;
                }

                return _context11.abrupt('break', 16);

              case 14:
                _context11.next = 6;
                break;

              case 16:

                _Logger2.default.log('Ran daily merchant txn summary notification');

              case 17:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee10, this);
      }));

      function merchExpectedSettlementNotify() {
        return _ref9.apply(this, arguments);
      }

      return merchExpectedSettlementNotify;
    }()
  }, {
    key: 'merchSettlementNotify',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
        var _this3 = this;

        var date, limit, run, page, runRes, count;
        return _regenerator2.default.wrap(function _callee12$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (process.env.MERCH_SUMMARY_NOTIFY) {
                  _context13.next = 2;
                  break;
                }

                return _context13.abrupt('return');

              case 2:
                date = (0, _moment2.default)().subtract(1, 'd').toDate();
                limit = 100;

                run = function () {
                  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                    var transData, merchantIDs, merchants, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, trans;

                    return _regenerator2.default.wrap(function _callee11$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            _context12.next = 2;
                            return _SettlementService2.default.merchSummary(date, page, limit);

                          case 2:
                            transData = _context12.sent;
                            merchantIDs = transData.map(function (a) {
                              return a.merchant_id;
                            });
                            _context12.next = 6;
                            return _MerchantService4.default.getMerchantsForIds(merchantIDs);

                          case 6:
                            merchants = _context12.sent;

                            transData = transData.map(function (item) {
                              var merchant = merchants.find(function (a) {
                                return a.merchant_id === item.merchant_id;
                              }) || {};
                              return (0, _extends3.default)({}, item, {
                                merchant_email: merchant.merchant_email || null,
                                merchant_phone: merchant.merchant_phone || null,
                                merchant_name: merchant.merchant_name || null,
                                transaction_date: date,
                                interval: 24
                              });
                            });
                            // eslint-disable-next-line no-use-before-define
                            _iteratorNormalCompletion5 = true;
                            _didIteratorError5 = false;
                            _iteratorError5 = undefined;
                            _context12.prev = 11;
                            for (_iterator5 = (0, _getIterator3.default)(transData); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                              trans = _step5.value;
                              sendMerchTransEmail(trans, false);
                            }_context12.next = 19;
                            break;

                          case 15:
                            _context12.prev = 15;
                            _context12.t0 = _context12['catch'](11);
                            _didIteratorError5 = true;
                            _iteratorError5 = _context12.t0;

                          case 19:
                            _context12.prev = 19;
                            _context12.prev = 20;

                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                              _iterator5.return();
                            }

                          case 22:
                            _context12.prev = 22;

                            if (!_didIteratorError5) {
                              _context12.next = 25;
                              break;
                            }

                            throw _iteratorError5;

                          case 25:
                            return _context12.finish(22);

                          case 26:
                            return _context12.finish(19);

                          case 27:
                            return _context12.abrupt('return', { count: transData.length });

                          case 28:
                          case 'end':
                            return _context12.stop();
                        }
                      }
                    }, _callee11, _this3, [[11, 15, 19, 27], [20,, 22, 26]]);
                  }));

                  return function run() {
                    return _ref12.apply(this, arguments);
                  };
                }();

                page = 0;
                // eslint-disable-next-line no-constant-condition

              case 6:
                if (!true) {
                  _context13.next = 16;
                  break;
                }

                page++;
                _context13.next = 10;
                return run(page);

              case 10:
                runRes = _context13.sent;
                count = runRes.count;

                if (!(count < limit)) {
                  _context13.next = 14;
                  break;
                }

                return _context13.abrupt('break', 16);

              case 14:
                _context13.next = 6;
                break;

              case 16:

                _Logger2.default.log('Ran daily merchant txn summary notification');

              case 17:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee12, this);
      }));

      function merchSettlementNotify() {
        return _ref11.apply(this, arguments);
      }

      return merchSettlementNotify;
    }()
  }, {
    key: 'updateTermStat',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
        var d, $match, $project, termStates, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item, term;

        return _regenerator2.default.wrap(function _callee13$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                d = (0, _moment2.default)().subtract(30, 'minutes').toDate();
                $match = {
                  stateInformation: { $exists: true },
                  updatedAt: { $gte: d }
                };
                $project = {
                  _id: 0, terminal_id: '$_id.terminalId', stateInformation: 1, lastCrAt: 1
                };
                _context14.next = 5;
                return _MwTermState2.default.aggregate([{ $match: $match }, { $group: { _id: { terminalId: '$terminalId' }, stateInformation: { $last: '$stateInformation' }, lastCrAt: { $last: '$createdAt' } } }, { $project: $project }]);

              case 5:
                termStates = _context14.sent;
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context14.prev = 9;
                _iterator6 = (0, _getIterator3.default)(termStates);

              case 11:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context14.next = 21;
                  break;
                }

                item = _step6.value;
                _context14.next = 15;
                return _TermStateService2.default.getTermState(item);

              case 15:
                term = _context14.sent;
                _context14.next = 18;
                return _Terminal2.default.updateOne({ terminal_id: term.terminal_id }, { $set: term });

              case 18:
                _iteratorNormalCompletion6 = true;
                _context14.next = 11;
                break;

              case 21:
                _context14.next = 27;
                break;

              case 23:
                _context14.prev = 23;
                _context14.t0 = _context14['catch'](9);
                _didIteratorError6 = true;
                _iteratorError6 = _context14.t0;

              case 27:
                _context14.prev = 27;
                _context14.prev = 28;

                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }

              case 30:
                _context14.prev = 30;

                if (!_didIteratorError6) {
                  _context14.next = 33;
                  break;
                }

                throw _iteratorError6;

              case 33:
                return _context14.finish(30);

              case 34:
                return _context14.finish(27);

              case 35:

                _Logger2.default.log('Term Stat Update Done!!!', termStates.length);

              case 36:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee13, this, [[9, 23, 27, 35], [28,, 30, 34]]);
      }));

      function updateTermStat() {
        return _ref13.apply(this, arguments);
      }

      return updateTermStat;
    }()

    /**
    * Processes same day settlements for merchants
    */

  }, {
    key: 'settlementSameDay',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
        var _this4 = this;

        var now, hour, endDate, merchantsConfig, settlements, _loop2, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, config;

        return _regenerator2.default.wrap(function _callee14$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                now = new Date();
                hour = now.getHours();
                endDate = new Date(now.setMinutes(0, 0, 0));
                _context16.next = 5;
                return _SettlementSDConfig2.default.find({
                  settlement_hours: hour
                });

              case 5:
                merchantsConfig = _context16.sent;
                settlements = [];
                _loop2 = /*#__PURE__*/_regenerator2.default.mark(function _loop2(config) {
                  var interval, startDate, mDate, _mDate$toISOString$sp, _mDate$toISOString$sp2, merchantId, tranServ, transactions, transactionRef, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, transaction, settlementSD, sDtrans, match, $group, $project, successTrans, _successTrans, _successTrans2, failedTrans, _failedTrans, _failedTrans2, _failedTrans2$;

                  return _regenerator2.default.wrap(function _loop2$(_context15) {
                    while (1) {
                      switch (_context15.prev = _context15.next) {
                        case 0:
                          interval = config.interval * 60 * 60 * 1000;
                          startDate = new Date(endDate.getTime() - interval);
                          mDate = new Date(endDate.getTime() - interval / 2);
                          _mDate$toISOString$sp = mDate.toISOString().split('T');
                          _mDate$toISOString$sp2 = (0, _slicedToArray3.default)(_mDate$toISOString$sp, 1);
                          mDate = _mDate$toISOString$sp2[0];
                          merchantId = config.merchant_id;
                          /** Get merchants transactions between settlement interval */

                          tranServ = new _TransactionService2.default();

                          tranServ.setMerchant(merchantId).setDate(startDate, endDate).setLimit(_maxSafeInteger2.default);
                          // const transactionsData = await TransactionService2.getTransactionHistory(1, null, { merchantId }, startDate, endDate);
                          _context15.next = 11;
                          return tranServ.history();

                        case 11:
                          transactions = _context15.sent;
                          transactionRef = [];
                          _iteratorNormalCompletion8 = true;
                          _didIteratorError8 = false;
                          _iteratorError8 = undefined;
                          _context15.prev = 16;

                          for (_iterator8 = (0, _getIterator3.default)(transactions); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            transaction = _step8.value;

                            transactionRef.push({
                              transaction_id: transaction._id,
                              rrn: transaction.rrn,
                              terminal_id: transaction.terminal_id,
                              amount: transaction.amount,
                              statusMessage: transaction.status,
                              responseCode: transaction.status_code
                            });
                          }

                          _context15.next = 24;
                          break;

                        case 20:
                          _context15.prev = 20;
                          _context15.t0 = _context15['catch'](16);
                          _didIteratorError8 = true;
                          _iteratorError8 = _context15.t0;

                        case 24:
                          _context15.prev = 24;
                          _context15.prev = 25;

                          if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                          }

                        case 27:
                          _context15.prev = 27;

                          if (!_didIteratorError8) {
                            _context15.next = 30;
                            break;
                          }

                          throw _iteratorError8;

                        case 30:
                          return _context15.finish(27);

                        case 31:
                          return _context15.finish(24);

                        case 32:
                          settlementSD = new _SettlementSD2.default({
                            merchant_id: config.merchant_id,
                            merchant_name: config.merchant_name,
                            interval: config.interval,
                            transaction_date: mDate
                          });
                          _context15.next = 35;
                          return settlementSD.save();

                        case 35:
                          settlementSD = _context15.sent;
                          sDtrans = transactionRef.map(function (item) {
                            item.settlement_sd_id = settlementSD._id;
                            return item;
                          });
                          _context15.prev = 37;
                          _context15.next = 40;
                          return _SettlementSDTrans2.default.insertMany(sDtrans, { ordered: false, rawResult: true });

                        case 40:
                          _context15.next = 45;
                          break;

                        case 42:
                          _context15.prev = 42;
                          _context15.t1 = _context15['catch'](37);
                          _Logger2.default.log(_context15.t1.message);

                        case 45:
                          match = { settlement_sd_id: settlementSD._id };
                          $group = {
                            _id: { settlement_sd_id: '$settlement_sd_id' },
                            total_value: { $sum: '$amount' },
                            total_volume: { $sum: 1 }
                          };
                          $project = { _id: 0, total_value: '$total_value', total_volume: '$total_volume' };
                          _context15.next = 50;
                          return _SettlementSDTrans2.default.aggregate([{ $match: (0, _extends3.default)({}, match, { responseCode: '00' }) }, { $group: $group }, { $project: $project }]);

                        case 50:
                          successTrans = _context15.sent;
                          _successTrans = successTrans;
                          _successTrans2 = (0, _slicedToArray3.default)(_successTrans, 1);
                          successTrans = _successTrans2[0];
                          _context15.next = 56;
                          return _SettlementSDTrans2.default.aggregate([{ $match: (0, _extends3.default)({}, match, { responseCode: { $ne: '00' } }) }, { $group: $group }, { $project: $project }]);

                        case 56:
                          failedTrans = _context15.sent;

                          if (!successTrans) {
                            _context15.next = 71;
                            break;
                          }

                          _failedTrans = failedTrans;
                          _failedTrans2 = (0, _slicedToArray3.default)(_failedTrans, 1);
                          _failedTrans2$ = _failedTrans2[0];
                          failedTrans = _failedTrans2$ === undefined ? {} : _failedTrans2$;

                          settlementSD.successful_volume = successTrans.total_volume || 0;
                          settlementSD.successful_value = (successTrans.total_value || 0) / 100;
                          settlementSD.failed_volume = failedTrans.total_volume || 0;
                          settlementSD.failed_value = (failedTrans.total_value || 0) / 100;
                          settlementSD.total_value = settlementSD.successful_value + settlementSD.failed_value;
                          settlementSD.total_volume = settlementSD.successful_volume + settlementSD.failed_volume;
                          _context15.next = 70;
                          return settlementSD.save();

                        case 70:
                          settlementSD = _context15.sent;

                        case 71:
                          settlements.push(settlementSD);

                        case 72:
                        case 'end':
                          return _context15.stop();
                      }
                    }
                  }, _loop2, _this4, [[16, 20, 24, 32], [25,, 27, 31], [37, 42]]);
                });
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context16.prev = 11;
                _iterator7 = (0, _getIterator3.default)(merchantsConfig);

              case 13:
                if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                  _context16.next = 19;
                  break;
                }

                config = _step7.value;
                return _context16.delegateYield(_loop2(config), 't0', 16);

              case 16:
                _iteratorNormalCompletion7 = true;
                _context16.next = 13;
                break;

              case 19:
                _context16.next = 25;
                break;

              case 21:
                _context16.prev = 21;
                _context16.t1 = _context16['catch'](11);
                _didIteratorError7 = true;
                _iteratorError7 = _context16.t1;

              case 25:
                _context16.prev = 25;
                _context16.prev = 26;

                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }

              case 28:
                _context16.prev = 28;

                if (!_didIteratorError7) {
                  _context16.next = 31;
                  break;
                }

                throw _iteratorError7;

              case 31:
                return _context16.finish(28);

              case 32:
                return _context16.finish(25);

              case 33:
                if (!settlements.length) {
                  _context16.next = 36;
                  break;
                }

                _context16.next = 36;
                return sendSDSAdviceEmail(hour, settlements);

              case 36:
                _Logger2.default.log('Ran settlement job for:', hour + ':00 ::: ', settlements.length, 'settlements.');

              case 37:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee14, this, [[11, 21, 25, 33], [26,, 28, 32]]);
      }));

      function settlementSameDay() {
        return _ref14.apply(this, arguments);
      }

      return settlementSameDay;
    }()
  }, {
    key: 'posSupportNotify',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
        var posSupportEmails, checkPrinter, checkConnectDate, connectDays, printerOkMsg, printer_status, last_connect_date, $or, $match, terminals, mids, tids, merchants, data, path;
        return _regenerator2.default.wrap(function _callee15$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return _ConfigService2.default.getKeyValue('pos_support');

              case 2:
                posSupportEmails = _context17.sent;
                _context17.next = 5;
                return _ConfigService2.default.getKeyValue('notify_bad_printer');

              case 5:
                checkPrinter = _context17.sent;
                _context17.next = 8;
                return _ConfigService2.default.getKeyValue('notify_inactive_terminal');

              case 8:
                checkConnectDate = _context17.sent;
                _context17.next = 11;
                return _ConfigService2.default.getKeyValue('notify_inactive_terminal_day');

              case 11:
                _context17.t0 = _context17.sent;

                if (_context17.t0) {
                  _context17.next = 14;
                  break;
                }

                _context17.t0 = 30;

              case 14:
                connectDays = _context17.t0;
                printerOkMsg = ['Printer OK', 'PrinterAvailable', 'PrinterOK'];
                printer_status = {
                  $exists: true,
                  $nin: printerOkMsg
                };
                last_connect_date = {
                  $lte: (0, _moment2.default)().subtract(connectDays, 'd').toDate()
                };
                $or = [];

                if (checkConnectDate) $or.push({ last_connect_date: last_connect_date });
                if (checkPrinter) $or.push({ printer_status: printer_status });

                if (!(!$or.length || !posSupportEmails.length)) {
                  _context17.next = 23;
                  break;
                }

                return _context17.abrupt('return');

              case 23:
                $match = {
                  $and: [{
                    $or: [{ last_notify_date: { $exists: false } }, { last_notify_date: { $lte: (0, _moment2.default)().subtract(connectDays, 'd').toDate() } }]
                  }, { $or: $or }]
                };
                _context17.next = 26;
                return _Terminal2.default.aggregate([{ $match: $match }, { $limit: 500 }]);

              case 26:
                terminals = _context17.sent;
                mids = terminals.map(function (item) {
                  return item.merchant_id;
                });
                tids = terminals.map(function (item) {
                  return item.terminal_id;
                });
                _context17.next = 31;
                return _Merchant2.default.find({ merchant_id: { $in: mids } });

              case 31:
                merchants = _context17.sent;
                data = terminals.map(function (item) {
                  var merchant = merchants.find(function (rec) {
                    return rec.merchant_id === item.merchant_id;
                  }) || {};
                  var condition = '';
                  if ((0, _moment2.default)().diff((0, _moment2.default)(item.last_connect_date), 'd') > connectDays) condition += 'Inactive';
                  if (item.printer_status && !printerOkMsg.includes(item.printer_status)) condition += (condition ? '/' : '') + item.printer_status;
                  return {
                    merchant_name: merchant.merchant_name,
                    merchant_address: merchant.merchant_address,
                    merchant_phone: merchant.merchant_phone,
                    merchant_email: merchant.merchant_email,
                    terminal_id: item.terminal_id,
                    merchant_id: item.merchant_id,
                    serial_no: item.serial_no,
                    location: item.lat ? 'http://maps.google.com/maps?z=8&t=m&q=loc:' + item.lat + '+' + item.lon : '',
                    condition: condition
                  };
                });

                if (data.length) {
                  _context17.next = 35;
                  break;
                }

                return _context17.abrupt('return');

              case 35:
                _context17.next = 37;
                return _XLSXGen2.default.termSupport(data, 'POS-Support' + new Date().getTime() + '.xlsx');

              case 37:
                path = _context17.sent;


                (0, _emailSender2.default)({
                  emailRecipients: posSupportEmails,
                  emailBody: '\n      Hello Support Officer, <br>\n      <p>A list of ' + terminals.length + ' terminals requires support. These are terminals which have either Printer Issues or has not been active for ' + connectDays + ' days.</p><p>You can find this list in the Excel file attached.</p><br>\n      Thanks.<br> <br>\n      \xA9 ' + process.env.APP_NAME + '<br>\n      Powered by ITEX<br>\n      </div>\n      ',
                  emailSubject: 'POS Support - Attention is required for these Terminals',
                  attachments: [{
                    path: path,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  }]
                });

                _context17.next = 41;
                return _Terminal2.default.updateMany({ terminal_id: { $in: tids } }, { $set: { last_notify_date: new Date() } });

              case 41:
                _Logger2.default.log('Sent Auto POS Support Email to ' + posSupportEmails.join(', '));

              case 42:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee15, this);
      }));

      function posSupportNotify() {
        return _ref15.apply(this, arguments);
      }

      return posSupportNotify;
    }()

    /**
    * Pushes realtime data to online users
    */

  }, {
    key: 'realTimeNotification',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
        var socketRoom, tranServ, _transactions, _tranServ, transactionsGraph, _tranServ2, transactionsStats, _tranServ3, onlineTerminals;

        return _regenerator2.default.wrap(function _callee16$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                socketRoom = 'adminSocket';
                /** Check if there is active sockets */

                if ((0, _socket.getActiveSocketsCount)(socketRoom)) {
                  _context18.next = 3;
                  break;
                }

                return _context18.abrupt('return');

              case 3:
                _context18.prev = 3;
                tranServ = new _TransactionService2.default();

                tranServ.setLimit(50);
                // const transactionsHistory = await TransactionService2.getTransactionHistory(1, 30);
                _context18.next = 8;
                return tranServ.history();

              case 8:
                _transactions = _context18.sent;

                (0, _socket.sendNotification)(socketRoom, _socket.events.thNotify, { data: _transactions });
                _context18.next = 15;
                break;

              case 12:
                _context18.prev = 12;
                _context18.t0 = _context18['catch'](3);
                _Logger2.default.log(_context18.t0);

              case 15:
                _context18.prev = 15;
                _tranServ = new _TransactionService2.default();

                _tranServ.setDate((0, _utils.curDate)());
                // const transactionsGraph = await TransactionService2.getTransactionTime(curDate());
                _context18.next = 20;
                return _tranServ.time();

              case 20:
                transactionsGraph = _context18.sent;

                (0, _socket.sendNotification)(socketRoom, _socket.events.tgNotify, transactionsGraph);
                _context18.next = 27;
                break;

              case 24:
                _context18.prev = 24;
                _context18.t1 = _context18['catch'](15);
                _Logger2.default.log(_context18.t1);

              case 27:
                _context18.prev = 27;
                _tranServ2 = new _TransactionService2.default();

                _tranServ2.setDate((0, _utils.curDate)());
                // const transactionsStats = await TransactionService2.getTransactionStat(curDate(), curDate());
                _context18.next = 32;
                return _tranServ2.stat();

              case 32:
                transactionsStats = _context18.sent;

                (0, _socket.sendNotification)(socketRoom, _socket.events.tsNotify, transactionsStats);
                _context18.next = 39;
                break;

              case 36:
                _context18.prev = 36;
                _context18.t2 = _context18['catch'](27);
                _Logger2.default.log(_context18.t2);

              case 39:
                _context18.prev = 39;
                _tranServ3 = new _TransactionService2.default();

                _tranServ3.setDate((0, _utils.curDate)());
                // const onlineTerminals = await TransactionService2.getTransTermStat('online');
                _context18.next = 44;
                return _tranServ3.transTermStat('online');

              case 44:
                onlineTerminals = _context18.sent;

                (0, _socket.sendNotification)(socketRoom, _socket.events.otNotify, onlineTerminals);
                _context18.next = 51;
                break;

              case 48:
                _context18.prev = 48;
                _context18.t3 = _context18['catch'](39);
                _Logger2.default.log(_context18.t3);
              case 51:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee16, this, [[3, 12], [15, 24], [27, 36], [39, 48]]);
      }));

      function realTimeNotification() {
        return _ref16.apply(this, arguments);
      }

      return realTimeNotification;
    }()

    /**
     * download settlement file from ftp server and upload to settlemen table
     */

  }, {
    key: 'UploadSettlementFromFTP',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
        var config, ftp;
        return _regenerator2.default.wrap(function _callee17$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                // config to connect to ftp server
                config = {
                  host: 'speedtest.tele2.net',
                  port: 21,
                  user: 'anonymous',
                  pass: 'anonymous',
                  debug: false
                };
                ftp = _ftpimp2.default.create(config, false);

                ftp.connect(function () {
                  // list all the file 
                  ftp.ls('/', function (err, filelist) {
                    if (filelist) {
                      //get the last file name and date from the config 
                      var lastFileName = _ConfigService2.default.getKeyValue('last_file_name').then(function (data) {
                        return console.log('done');
                      }) || null;
                      var lastFileTime = _ConfigService2.default.getKeyValue('last_file_time').then(function (data) {
                        return console.log('done');
                      }) || null;

                      // console.log('date', filelist[filelist.length - 1].mtime);
                      //save the last time on the db and the file name

                      var fileName = filelist[filelist.length - 2].filename;
                      var fileDate = new Date(filelist[filelist.length - 1].mtime).toISOString().slice(11, -1);

                      if (fileName !== lastFileName && fileDate !== lastFileTime) {
                        _ConfigService2.default.setKeyValue('last_file_name', fileName).then(function (data) {
                          return console.log('done');
                        });
                        _ConfigService2.default.setKeyValue('last_file_time', fileDate).then(function (data) {
                          return console.log('done');
                        });

                        //download the file unto the system and start upload the content to settle model
                        ftp.save(['/' + fileName, 'files/settlements/' + fileName], function (err, filename) {
                          console.log(err, filename);
                          //save upload history if save and no error
                          if (filename) {
                            _XLSXReader2.default.settlement(filename, 'UPSL_UBA', {});
                          }
                          //read back the file and process for download
                        });
                      }

                      //if the last file and the last filenae save is not the save then  save the new one
                      console.log('time : ', new Date(filelist[filelist.length - 1].mtime).toISOString().slice(11, -1));
                      console.log('date : ', new Date(filelist[filelist.length - 1].mtime));
                    }
                    if (err) console.error(err);
                  });
                  console.log('Ftp connected');
                });

              case 3:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee17, this);
      }));

      function UploadSettlementFromFTP() {
        return _ref17.apply(this, arguments);
      }

      return UploadSettlementFromFTP;
    }()
  }, {
    key: 'ReconcileSettlement',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
        var $skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var lastSkip, skip, limit, totalCount;
        return _regenerator2.default.wrap(function _callee18$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.t1 = $skip;

                if (_context20.t1) {
                  _context20.next = 5;
                  break;
                }

                _context20.next = 4;
                return _ConfigService2.default.getKeyValue('mongo_reconcillation_last_skip');

              case 4:
                _context20.t1 = _context20.sent;

              case 5:
                _context20.t0 = _context20.t1;

                if (_context20.t0) {
                  _context20.next = 8;
                  break;
                }

                _context20.t0 = 0;

              case 8:
                lastSkip = _context20.t0;
                skip = lastSkip || 0;
                limit = 500;
                //calculate the limit

                _context20.prev = 11;
                _context20.next = 14;
                return _MwTransaction2.default.countDocuments({ settled: null });

              case 14:
                totalCount = _context20.sent;

                // Logger.log('total Count : ', totalCount)
                // step 2 set retry to 0 then divide the total count of transaction by modulus of limit ( 500 ) 4
                retry = function (_retry) {
                  function retry() {
                    return _retry.apply(this, arguments);
                  }

                  retry.toString = function () {
                    return _retry.toString();
                  };

                  return retry;
                }(function () {
                  var transactions = _MwTransaction2.default.find({ settled: null }).skip(skip).limit(limit).lean().then(function (data) {
                    return data;
                  });
                  skip += transactions.length;
                  _Logger2.default.log('skip : ', skip, 'total : ', totalCount, 'change : ', totalCount - skip);
                  var rrns = transactions.map(function (item) {
                    return item.rrn;
                  }).filter(function (item) {
                    return item;
                  }).map(function (item) {
                    return item.toString();
                  });
                  var terminals = transactions.map(function (item) {
                    return item.terminal_id;
                  });

                  var settlements = _SettlementService2.default.getTIDsRRNsTrans(terminals, rrns).then(function (data) {
                    return data;
                  });

                  var _loop3 = function _loop3(item) {
                    // Logger.log('transacation Details', item.settled);
                    var settled = !!settlements.find(function (rec) {
                      return Number(item.rrn) === Number(rec.rrn) && item.terminal_id === rec.terminal_id;
                    });

                    //update settlement for status of settlement
                    if (settled) {
                      _Transaction2.default.updateOne({ terminal_id: item.terminal_id }, { $set: { settled: 'settled' } }).then(function (data) {
                        return data;
                      });
                    }
                    var change = totalCount - skip;
                    console.lean('change: ', change);
                    if (change >= 0) {
                      _ConfigService2.default.setKeyValue('mongo_reconcillation_last_skip', 0).then(function (data) {
                        return data;
                      });
                      _Logger2.default.log('Skip value reset : ', skip);
                    } else {
                      _ConfigService2.default.setKeyValue('mongo_reconcillation_last_skip', skip).then(function (data) {
                        return data;
                      });
                      _Logger2.default.log('Skip value and continue', skip);
                      // step 3 if step 2 equeal to zero reset the the skip back to zero
                      retry();
                    }
                  };

                  var _iteratorNormalCompletion9 = true;
                  var _didIteratorError9 = false;
                  var _iteratorError9 = undefined;

                  try {
                    for (var _iterator9 = (0, _getIterator3.default)(transactions), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                      var item = _step9.value;

                      _loop3(item);
                    }
                  } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                      }
                    } finally {
                      if (_didIteratorError9) {
                        throw _iteratorError9;
                      }
                    }
                  }
                });
                _context20.next = 20;
                break;

              case 18:
                _context20.prev = 18;
                _context20.t2 = _context20['catch'](11);

              case 20:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee18, this, [[11, 18]]);
      }));

      function ReconcileSettlement() {
        return _ref18.apply(this, arguments);
      }

      return ReconcileSettlement;
    }()
  }, {
    key: 'ReconcileVasSettlement',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
        var limit, _transactions2, rrns, amounts, terminals, pans, filetrTerminals, settlements, records, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, item;

        return _regenerator2.default.wrap(function _callee19$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                limit = 50;
                _context21.prev = 1;
                _context21.next = 4;
                return _VasReport2.default.find({ settled: { $ne: "true" } }).limit(limit).lean();

              case 4:
                _transactions2 = _context21.sent;


                // console.log('Trans Data', JSON.stringify(transactions))
                rrns = _transactions2.map(function (item) {
                  return item.rrn;
                }).filter(function (item) {
                  return item;
                }).map(function (item) {
                  return item.toString();
                });
                amounts = _transactions2.map(function (item) {
                  return item.amount / 100;
                }).filter(function (item) {
                  return item;
                });
                terminals = _transactions2.map(function (item) {
                  return [item.virtualTID, item.terminal];
                });
                pans = _transactions2.map(function (item) {
                  return item.pan;
                }).map(function (pan) {
                  //  console.info('pan length : ',  pan.length)
                  if (pan.length == 19) return pan.replace(/XXXXXXXXX/gi, '*********');
                  if (pan.length == 18) return pan.replace(/XXXXXXXX/gi, '********');
                  if (pan.length == 16) return pan.replace(/XXXXXX/gi, '********');else return pan;
                });
                // console.log('original rrn : ', rrns);

                filetrTerminals = terminals.map(function (item) {
                  var output = void 0;
                  if (item[0] == undefined) {
                    output = item[1];
                  } else {
                    output = item[0];
                  }
                  return output;
                });
                _context21.next = 12;
                return _SettlementService2.default.getTIDsRRNsTrans(filetrTerminals, rrns, amounts, pans);

              case 12:
                settlements = _context21.sent;

                // console.log(`settlements Record`, JSON.stringify(settlements));

                records = _transactions2.map(function (item) {
                  // console.log('trxn : ', parseInt(item.rrn, 10))
                  item.settled = settlements.filter(function (sett) {
                    // console.log('trxn : ', parseInt(sett.rrn, 10))

                    if (item.rrn.toString() === sett.rrn.toString() || parseInt(item.rrn, 10) == parseInt(sett.rrn, 10) && sett.transaction_amount == item.amount / 100) {
                      console.log('rrn : ', parseInt(item.rrn, 10), ' = ', parseInt(sett.rrn, 10));
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

                if (!records.length) {
                  _context21.next = 44;
                  break;
                }

                console.log('Settled Transaction Begin Matched Found: ', records.length);
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context21.prev = 19;
                _iterator10 = (0, _getIterator3.default)(records);

              case 21:
                if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                  _context21.next = 30;
                  break;
                }

                item = _step10.value;

                if (!(item.settled == true)) {
                  _context21.next = 27;
                  break;
                }

                console.log('status : ', item.settled);
                _context21.next = 27;
                return _VasReport2.default.findByIdAndUpdate({ _id: item._id }, {
                  settledTrxAmount: item.settledTrxAmount,
                  SettlementAmount: item.SettlementAmount,
                  settleTerminal: item.settleTerminal,
                  processor: item.processor,
                  charges: item.charges,
                  merchant_id: item.merchant_id,
                  pan_sett: item.pan_sett,
                  settled: item.settled
                });

              case 27:
                _iteratorNormalCompletion10 = true;
                _context21.next = 21;
                break;

              case 30:
                _context21.next = 36;
                break;

              case 32:
                _context21.prev = 32;
                _context21.t0 = _context21['catch'](19);
                _didIteratorError10 = true;
                _iteratorError10 = _context21.t0;

              case 36:
                _context21.prev = 36;
                _context21.prev = 37;

                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }

              case 39:
                _context21.prev = 39;

                if (!_didIteratorError10) {
                  _context21.next = 42;
                  break;
                }

                throw _iteratorError10;

              case 42:
                return _context21.finish(39);

              case 43:
                return _context21.finish(36);

              case 44:
                console.log('Settled Transaction  End Done : ', records.length);

                _context21.next = 50;
                break;

              case 47:
                _context21.prev = 47;
                _context21.t1 = _context21['catch'](1);

                _Logger2.default.log(_context21.t1);

              case 50:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee19, this, [[1, 47], [19, 32, 36, 44], [37,, 39, 43]]);
      }));

      function ReconcileVasSettlement() {
        return _ref19.apply(this, arguments);
      }

      return ReconcileVasSettlement;
    }()
    /**
    * Starts the cron jobs in a worker thread
    */

  }, {
    key: 'startCron',
    value: function startCron() {
      var _this5 = this;

      var worker = new _webworkerThreads.Worker(function () {
        this.onmessage = function (event) {
          this.postMessage(event);
          // eslint-disable-next-line no-undef
          self.close();
        };
      });
      worker.onmessage = function () {
        // Run same day settlement hourly cron
        _nodeCron2.default.schedule('0 * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
          return _regenerator2.default.wrap(function _callee20$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                case 'end':
                  return _context22.stop();
              }
            }
          }, _callee20, _this5);
        }))
        // try { await this.settlementSameDay(); } catch (error) { Logger.log(error.message); }
        );

        // Run auto upload of settlement file  hourly cron
        _nodeCron2.default.schedule('*/45 * * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
          return _regenerator2.default.wrap(function _callee21$(_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                case 'end':
                  return _context23.stop();
              }
            }
          }, _callee21, _this5);
        }))
        // try { await this.UploadSettlementFromFTP(); } catch (error) { Logger.log(error.message); }
        );

        // Run auto settlement for vasReport transaction file  hourly cron
        _nodeCron2.default.schedule('*/60 * * * *  *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
          return _regenerator2.default.wrap(function _callee22$(_context24) {
            while (1) {
              switch (_context24.prev = _context24.next) {
                case 0:
                case 'end':
                  return _context24.stop();
              }
            }
          }, _callee22, _this5);
        }))
        // try { await this.ReconcileVasSettlement(); } catch (error) { Logger.log(error.message); }
        );

        // Run auto settlemeny of transaction file  hourly cron
        _nodeCron2.default.schedule('*/45 * * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
          return _regenerator2.default.wrap(function _callee23$(_context25) {
            while (1) {
              switch (_context25.prev = _context25.next) {
                case 0:
                case 'end':
                  return _context25.stop();
              }
            }
          }, _callee23, _this5);
        }))
        // try { await this.ReconcileSettlement(); } catch (error) { Logger.log(error.message); }
        );

        // Send real-time records every 45 secs
        _nodeCron2.default.schedule('*/45 * * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
          return _regenerator2.default.wrap(function _callee24$(_context26) {
            while (1) {
              switch (_context26.prev = _context26.next) {
                case 0:
                case 'end':
                  return _context26.stop();
              }
            }
          }, _callee24, _this5);
        }))
        // try { await this.realTimeNotification(); } catch (error) { Logger.log(error.message); }
        );

        // Send real-time records of vas transactions at every 1 Minutes
        _nodeCron2.default.schedule('*/30 * * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25() {
          return _regenerator2.default.wrap(function _callee25$(_context27) {
            while (1) {
              switch (_context27.prev = _context27.next) {
                case 0:
                case 'end':
                  return _context27.stop();
              }
            }
          }, _callee25, _this5);
        }))
        // try { await this.vasTrans(); } catch (error) { Logger.log(error.message); }
        );

        // Sync terminals and merchants every 30 minutes
        _nodeCron2.default.schedule('*/30 * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26() {
          return _regenerator2.default.wrap(function _callee26$(_context28) {
            while (1) {
              switch (_context28.prev = _context28.next) {
                case 0:
                case 'end':
                  return _context28.stop();
              }
            }
          }, _callee26, _this5);
        }))
        // try { await this.merchSync(); } catch (error) { Logger.log(error.message); }
        );
        // Update terminal statistics every 30 minutes
        _nodeCron2.default.schedule('*/30 * * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27() {
          return _regenerator2.default.wrap(function _callee27$(_context29) {
            while (1) {
              switch (_context29.prev = _context29.next) {
                case 0:
                case 'end':
                  return _context29.stop();
              }
            }
          }, _callee27, _this5);
        }))
        // try { await this.updateTermStat(); } catch (error) { Logger.log(error.message); }
        );
        // Run auto POS support every day[midnight]
        _nodeCron2.default.schedule('0 0 * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28() {
          return _regenerator2.default.wrap(function _callee28$(_context30) {
            while (1) {
              switch (_context30.prev = _context30.next) {
                case 0:
                case 'end':
                  return _context30.stop();
              }
            }
          }, _callee28, _this5);
        }))
        // try { await this.posSupportNotify(); } catch (error) { Logger.log(error.message); }
        );
        // Send merchants notification of expected settlement every day[midnight]
        _nodeCron2.default.schedule('0 0 * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29() {
          return _regenerator2.default.wrap(function _callee29$(_context31) {
            while (1) {
              switch (_context31.prev = _context31.next) {
                case 0:
                case 'end':
                  return _context31.stop();
              }
            }
          }, _callee29, _this5);
        }))
        // try { await this.merchExpectedSettlementNotify(); } catch (error) { Logger.log(error.message); }
        );
        // Send merchants notification of settlement every day[noon]
        _nodeCron2.default.schedule('0 12 * * *', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30() {
          return _regenerator2.default.wrap(function _callee30$(_context32) {
            while (1) {
              switch (_context32.prev = _context32.next) {
                case 0:
                case 'end':
                  return _context32.stop();
              }
            }
          }, _callee30, _this5);
        }))
        // try { await this.merchSettlementNotify(); } catch (error) { Logger.log(error.message); }
        );
      };
      worker.postMessage({});
    }
  }]);
  return CronService;
}();

/**
* Send Merchants Transactions Summary Email
* @param {Array} settlements - Settlements
*/


var sendMerchTransEmail = function () {
  var _ref31 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31(settlement) {
    var expected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var email, emails, settlementDetails, body;
    return _regenerator2.default.wrap(function _callee31$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            email = settlement.merchant_email;

            if (!(!email || !(0, _utils.validateEmail)(email))) {
              _context33.next = 3;
              break;
            }

            return _context33.abrupt('return');

          case 3:
            emails = [email];
            settlementDetails = '';

            if (settlement.total_value) {
              _context33.next = 7;
              break;
            }

            return _context33.abrupt('return');

          case 7:
            settlementDetails += '<br><strong>Merchant ID:</strong> ' + settlement.merchant_id + '<br><strong>Merchant Name:</strong> ' + settlement.merchant_name + '<br>';
            if (expected) {
              settlementDetails += '<strong>Successful Transaction Amount:</strong> ' + (settlement.successful_value || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' }) + '<br>\n    <strong>Successful Transaction Volume:</strong> ' + (settlement.successful_volume || 0).toLocaleString() + '<br>\n    <strong>Failed Transaction Amount:</strong> ' + (settlement.failed_value || 0).toLocaleString() + '<br>\n    <strong>Failed Transaction Volume:</strong> ' + (settlement.failed_volume || 0).toLocaleString() + '<br><br>';
            }
            settlementDetails += '<strong>Total Transaction Amount:</strong> ' + (settlement.total_value || 0).toLocaleString() + '<br>\n  <strong>Total Transaction Volume:</strong> ' + (settlement.total_volume || 0).toLocaleString() + '<br>\n  <strong>Interval:</strong> ' + settlement.interval + ' hours<br>\n  <strong>Date:</strong> ' + settlement.transaction_date + '<br>\n  <br>';

            if (settlementDetails) {
              _context33.next = 12;
              break;
            }

            return _context33.abrupt('return');

          case 12:
            body = '\n  <div style="font-size: 16px">\n  <strong>Hello ' + settlement.merchant_name + ',</strong><br>\n  <br>\n  Find below the summary of you ' + (expected ? 'transactions' : 'settlements') + ' for ' + settlement.transaction_date + '.<br>\n  <br>\n  <strong>Transaction Details:</strong><br>\n  <br>\n  \n  ' + settlementDetails + '\n  \n  Thanks.<br>\n  \n  <br>\n  \xA9 ' + process.env.APP_NAME + '<br>\n  Powered by ITEX<br>\n  </div>\n  ';


            (0, _emailSender2.default)({ emailRecipients: emails, emailBody: body, emailSubject: (expected ? 'Transactions' : 'Settlements') + ' Summary for the Day: ' + settlement.transaction_date + '.' });

          case 14:
          case 'end':
            return _context33.stop();
        }
      }
    }, _callee31, undefined);
  }));

  return function sendMerchTransEmail(_x11) {
    return _ref31.apply(this, arguments);
  };
}();

/**
* Send Same Day Settlement advice email
* @param {Number} hour - Settlement hour
* @param {Array} settlements - Settlements
*/
var sendSDSAdviceEmail = function () {
  var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32(hour, settlements) {
    var emails, link, settlementDetails, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, settlement, body;

    return _regenerator2.default.wrap(function _callee32$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return _ConfigService2.default.getKeyValue('sd_advice_emails');

          case 2:
            emails = _context34.sent;

            if (!(!emails || !emails.length)) {
              _context34.next = 5;
              break;
            }

            return _context34.abrupt('return');

          case 5:
            link = process.env.UI_URL + '/settlements/same-day';
            settlementDetails = '';
            _iteratorNormalCompletion11 = true;
            _didIteratorError11 = false;
            _iteratorError11 = undefined;
            _context34.prev = 10;
            _iterator11 = (0, _getIterator3.default)(settlements);

          case 12:
            if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
              _context34.next = 20;
              break;
            }

            settlement = _step11.value;

            if (settlement.total_value) {
              _context34.next = 16;
              break;
            }

            return _context34.abrupt('continue', 17);

          case 16:
            settlementDetails += '   <br> \n    <strong>Merchant ID:</strong> ' + settlement.merchant_id + '<br>\n    <strong>Merchant Name:</strong> ' + settlement.merchant_name + '<br>\n    <strong>Successful Transaction Amount:</strong> ' + (settlement.successful_value || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' }) + '\n    <br>\n    <strong>Successful Transaction Volume:</strong> ' + (settlement.successful_volume || 0).toLocaleString() + '<br>\n    <strong>Failed Transaction Amount:</strong> ' + (settlement.failed_value || 0).toLocaleString() + '<br>\n    <strong>Failed Transaction Volume:</strong> ' + (settlement.failed_volume || 0).toLocaleString() + '<br><br>\n    <strong>Total Transaction Amount:</strong> ' + (settlement.total_value || 0).toLocaleString() + '<br>\n    <strong>Total Transaction Volume:</strong> ' + (settlement.total_volume || 0).toLocaleString() + '<br>\n    <strong>Interval:</strong> ' + settlement.interval + ' hours<br>\n    <strong>Date:</strong> ' + settlement.transaction_date + ' hours<br>\n    <br>';

          case 17:
            _iteratorNormalCompletion11 = true;
            _context34.next = 12;
            break;

          case 20:
            _context34.next = 26;
            break;

          case 22:
            _context34.prev = 22;
            _context34.t0 = _context34['catch'](10);
            _didIteratorError11 = true;
            _iteratorError11 = _context34.t0;

          case 26:
            _context34.prev = 26;
            _context34.prev = 27;

            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }

          case 29:
            _context34.prev = 29;

            if (!_didIteratorError11) {
              _context34.next = 32;
              break;
            }

            throw _iteratorError11;

          case 32:
            return _context34.finish(29);

          case 33:
            return _context34.finish(26);

          case 34:
            if (settlementDetails) {
              _context34.next = 36;
              break;
            }

            return _context34.abrupt('return');

          case 36:

            hour = ('' + hour).padStart(2, 0);
            body = '\n  <div style="font-size: 16px">\n  <strong>Good Day,</strong><br>\n  <br>\n  Find below the details of the merchants to be settled.<br>\n  <strong>Hour of the Day: ' + hour + ':00</strong><br>\n  <br>\n  <strong>Settlement Details:</strong><br>\n  <br>\n  \n  ' + settlementDetails + '\n  \n  <br>\n  Kindly confirm on the platform when you settle these merchants.<br>\n  <a href="' + link + '">' + link + '</a><br>\n  Thanks.<br>\n  \n  <br>\n  \xA9 ' + process.env.APP_NAME + '<br>\n  Powered by ITEX<br>\n  </div>\n  ';


            (0, _emailSender2.default)({ emailRecipients: emails, emailBody: body, emailSubject: 'Settlement Advice for the Hour: ' + hour + ':00.' });

          case 39:
          case 'end':
            return _context34.stop();
        }
      }
    }, _callee32, undefined, [[10, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function sendSDSAdviceEmail(_x12, _x13) {
    return _ref32.apply(this, arguments);
  };
}();

exports.default = new CronService();