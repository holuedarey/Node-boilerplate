'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/no-cycle
var TransactionService = function () {
  function TransactionService() {
    (0, _classCallCheck3.default)(this, TransactionService);

    this.Transaction = process.env.IS_MIDDLEWARE ? MwTransaction : Transaction;

    this.$match = {};
    if (process.env.IS_MIDDLEWARE) this.$match[transMod.getField('mti')] = '0200';
    if (process.env.BANK_TERM_PREFIXES) {
      var terms = process.env.BANK_TERM_PREFIXES.split(',').map(function (item) {
        return (0, _utils.getRegExp)(item.trim());
      });
      this.$match[transMod.getField('terminal_id')] = { $in: terms };
    }
    if (process.env.ITEX_USAGE) this.$match[transMod.getField('terminal_id')] = { $in: ITEX_TERMINALS };

    this.$limit = 50;
    this.$skip = 0;
  }

  (0, _createClass3.default)(TransactionService, [{
    key: 'setIDs',
    value: function setIDs(ids) {
      if (ids) {
        if (!Array.isArray(ids)) ids = [ids];
        ids = ids.map(function (id) {
          return _mongoose2.default.Types.ObjectId(id);
        });
        console.log('ids :', ids);

        this.$match._id = { $in: ids };
      }
      return this;
    }
  }, {
    key: 'setID',
    value: function setID(id) {
      if (id) {
        id = _mongoose2.default.Types.ObjectId(id);
        this.$match._id = id;
      }
      return this;
    }
  }, {
    key: 'setDate',
    value: function setDate(start, end) {
      var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'd';

      if (start) {
        this.$match[transMod.getField('transaction_date')] = {
          $gte: (0, _moment2.default)(start, 'YYYY-MM-DD').tz(process.env.TZ).startOf(range).toDate(),
          $lte: (0, _moment2.default)(end || start, 'YYYY-MM-DD').tz(process.env.TZ).endOf(range).toDate()
        };
      }
      return this;
    }
  }, {
    key: 'setLimit',
    value: function setLimit(limit) {
      if ((0, _utils.checkNumber)(limit)) this.$limit = parseInt(limit, 10);
      return this;
    }
  }, {
    key: 'setPage',
    value: function setPage(page) {
      if (page) {
        var pageNo = (0, _utils.checkNumber)(page) ? parseInt(page, 10) : 1;
        this.$skip = (pageNo - 1) * this.$limit;
      }
      return this;
    }
  }, {
    key: 'setMerchant',
    value: function setMerchant(mid) {
      if (mid) {
        if (!Array.isArray(mid)) mid = [mid];
        this.$match[transMod.getField('merchant_id')] = { $in: mid };
      }
      return this;
    }
  }, {
    key: 'setTerminal',
    value: function setTerminal(tid) {
      if (tid) {
        if (!Array.isArray(tid)) tid = [tid];
        this.$match[transMod.getField('terminal_id')] = { $in: tid };
      }
      return this;
    }
  }, {
    key: 'setRRNs',
    value: function setRRNs(rrns) {
      if (rrns) {
        if (!Array.isArray(rrns)) rrns = [rrns];
        this.$match[transMod.getField('rrn')] = { $in: rrns };
      }
      return this;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(status) {
      if (status) {
        var responseCode = {};
        var opr = status === 'failed' ? '$ne' : '$eq';
        responseCode[opr] = '00';
        this.$match[transMod.getField('response_code')] = responseCode;
      }
      return this;
    }
  }, {
    key: 'setSearch',
    value: function setSearch(search) {
      var getSObj = function getSObj(key) {
        var obj = {};
        if ((0, _utils.checkNumber)(search)) obj[key] = { $eq: parseInt(search, 10) };else obj[key] = { $regex: (0, _utils.getRegExp)(search) };
        return obj;
      };

      if (search) {
        var $or = [];
        $or.push(getSObj(transMod.getField('terminal_id')));
        $or.push(getSObj(transMod.getField('merchant_id')));
        $or.push(getSObj(transMod.getField('merchant_name')));
        $or.push(getSObj(transMod.getField('stan')));
        $or.push(getSObj(transMod.getField('pan')));
        $or.push(getSObj(transMod.getField('rrn')));
        if ((0, _utils.checkNumber)(search)) $or.push(getSObj(transMod.getField('amount')));

        this.$match.$or = $or;
      }
      return this;
    }
  }, {
    key: 'setSource',
    value: function setSource(source) {
      if (source) this.$match[transMod.getField('handler_used')] = (0, _utils.getRegExp)(source);
      return this;
    }
  }, {
    key: 'setSort',
    value: function setSort(field) {
      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'desc';

      if (field) {
        var sort = {};
        sort[field] = dir === 'asc' ? 1 : -1;
        this.$sort = sort;
      }
      return this;
    }
  }, {
    key: 'setCountry',
    value: function setCountry(a2code) {
      if (a2code) this.$match.country_a2code = (0, _utils.getRegExp)(a2code);
      return this;
    }
  }, {
    key: 'setSettled',
    value: function setSettled(status) {
      if (status) this.$match.settled = null || 'unsettled';
      return this;
    }
  }, {
    key: 'history',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var $project, $sort, transactions;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                $project = {
                  terminal_id: '$' + transMod.getField('terminal_id'),
                  amount: '$' + transMod.getField('amount'),
                  transaction_date: '$' + transMod.getField('transaction_date'),
                  merchant_id: '$' + transMod.getField('merchant_id'),
                  merchant_name: '$' + transMod.getField('merchant_name'),
                  rrn: '$' + transMod.getField('rrn'),
                  pan: '$' + transMod.getField('pan'),
                  authcode: '$' + transMod.getField('authcode'),
                  stan: '$' + transMod.getField('stan'),
                  response_msg: '$' + transMod.getField('response_msg'),
                  response_code: '$' + transMod.getField('response_code'),
                  country_code: '$' + transMod.getField('country_code'),
                  country_a2code: '$' + transMod.getField('country_a2code'),
                  currency_code: '$' + transMod.getField('currency_code'),
                  currency_symbol: '$' + transMod.getField('currency_symbol'),
                  bin: '$' + transMod.getField('bin'),
                  settled: '$settled',
                  panNo: { $substr: ['$' + transMod.getField('pan'), 0, 6] }
                };
                $sort = {};

                $sort[transMod.getField('transaction_date')] = -1;
                _context.next = 5;
                return this.Transaction.aggregate([{ $match: this.$match }, { $sort: $sort }, { $skip: this.$skip }, { $limit: this.$limit }, { $project: $project }]);

              case 5:
                transactions = _context.sent;

                transactions.map(function (item) {
                  item.brand = (0, _utils.binConverter)(item.panNo) !== undefined ? (0, _utils.binConverter)(item.panNo).brand : 'NIL', item.bank = (0, _utils.binConverter)(item.panNo) !== undefined ? (0, _utils.binConverter)(item.panNo).bank : 'NIL';
                });
                return _context.abrupt('return', transactions);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function history() {
        return _ref.apply(this, arguments);
      }

      return history;
    }()
  }, {
    key: 'time',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var group, rows, data, isToday, hour, _loop, i;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                group = {
                  _id: {
                    $hour: {
                      date: '$' + transMod.getField('transaction_date'),
                      timezone: process.env.TZ
                    }
                  },
                  total: { $sum: '$' + transMod.getField('amount') }
                };
                _context2.next = 3;
                return this.Transaction.aggregate([{ $match: this.$match }, { $group: group }]);

              case 3:
                rows = _context2.sent;
                data = [];
                isToday = (0, _moment2.default)().diff((this.$match[transMod.getField('transaction_date')] || {}).$gte || (0, _utils.curDate)(), 'd') === 0;
                hour = (0, _moment2.default)().hour();

                _loop = function _loop(i) {
                  var nullValue = isToday && i <= hour ? 0 : null;
                  var allTransaction = rows.find(function (elem) {
                    return elem._id === i;
                  });
                  var allValue = allTransaction ? parseInt(allTransaction.total, 10) : nullValue;
                  data[i] = allValue;
                };

                for (i = 0; i < 24; i++) {
                  _loop(i);
                }

                return _context2.abrupt('return', data);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function time() {
        return _ref2.apply(this, arguments);
      }

      return time;
    }()

    /**
    * Gets summary of transactions per type for given date
    * @param {Date} date
    */

  }, {
    key: 'summary',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var short = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var startDate, group, project, $match, rows, failedTransactions;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                startDate = (this.$match[transMod.getField('transaction_date')] || {}).$gte || (0, _utils.curDate)();
                group = {
                  _id: {
                    $dayOfMonth: {
                      date: '$' + transMod.getField('transaction_date'),
                      timezone: process.env.TZ
                    }
                  },
                  total: { $sum: { $toDouble: '$' + transMod.getField('amount') } },
                  volume: { $sum: 1 }
                };
                project = {
                  _id: 0,
                  year: {
                    $year: {
                      date: new Date(startDate),
                      timezone: process.env.TZ
                    }
                  },
                  month: {
                    $month: {
                      date: new Date(startDate),
                      timezone: process.env.TZ
                    }
                  },
                  day: '$_id',
                  total: 1,
                  volume: 1
                };
                $match = this.$match;

                $match[transMod.getField('response_code')] = '00';

                _context3.next = 7;
                return this.Transaction.aggregate([{ $match: $match }, { $group: group }, { $project: project }]);

              case 7:
                rows = _context3.sent;

                rows = rows.map(function (item) {
                  if (item.year && item.month && item.day) {
                    item.date = (0, _moment2.default)(item.year + '-' + item.month + '-' + item.day, 'YYYY-MM-DD').format('DD-MMM-YYYY');
                  }
                  return item;
                });
                rows.sort(function (a, b) {
                  return a.day > b.day ? 1 : -1;
                });

                if (!short) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt('return', rows);

              case 12:

                $match[transMod.getField('response_code')] = { $ne: '00' };
                _context3.next = 15;
                return this.Transaction.aggregate([{ $match: $match }, { $group: group }, { $project: project }]).allowDiskUse(true);

              case 15:
                failedTransactions = _context3.sent;


                rows = rows.map(function (item) {
                  var rec = { date: (0, _moment2.default)(item.date, 'DD-MMM-YYYY').format('YYYY-MM-DD') };
                  var failedTrans = failedTransactions.find(function (a) {
                    return a.day === item.day;
                  }) || {};
                  rec.successful_volume = item.volume || 0;
                  rec.successful_value = (item.total || 0) / 100;
                  rec.failed_volume = failedTrans.volume || 0;
                  rec.failed_value = (failedTrans.total || 0) / 100;
                  rec.total_value = rec.successful_value + rec.failed_value;
                  rec.total_volume = rec.successful_volume + rec.failed_volume;
                  return rec;
                });

                return _context3.abrupt('return', rows);

              case 18:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function summary() {
        return _ref3.apply(this, arguments);
      }

      return summary;
    }()

    /**
    * Gets transaction statistics for given start and end dates
    * @param {Date} startDate
    * @param {Date} endDate
    */

  }, {
    key: 'stat',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var merchant_id, statData, $match, successCounter, data, _data$total_value, total_value, _data$total_volume, total_volume, _data$terminals, terminals, success_count, success_value, failed_value, success_percent, failed_count, failed_percent, terminal_count, utilized_terminals, utilized_terminals_percent, non_utilized_terminals, non_utilized_terminals_percent;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                merchant_id = this.$match[transMod.getField('merchant_id')] || null;
                _context4.next = 3;
                return this.Transaction.aggregate([{ $match: this.$match }, {
                  $group: {
                    _id: null,
                    total_value: { $sum: '$' + transMod.getField('amount') },
                    total_volume: { $sum: 1 },
                    terminals: { $addToSet: '$' + transMod.getField('terminal_id') }
                  }
                }]);

              case 3:
                statData = _context4.sent;
                $match = this.$match;

                $match[transMod.getField('response_code')] = '00';

                _context4.next = 8;
                return this.Transaction.aggregate([{ $match: $match }, {
                  $group: {
                    _id: null,
                    totalAmount: { $sum: '$' + transMod.getField('amount') },
                    count: { $sum: 1 }
                  }
                }]);

              case 8:
                successCounter = _context4.sent;
                data = (statData || [])[0] || {};
                _data$total_value = data.total_value, total_value = _data$total_value === undefined ? 0 : _data$total_value, _data$total_volume = data.total_volume, total_volume = _data$total_volume === undefined ? 0 : _data$total_volume, _data$terminals = data.terminals, terminals = _data$terminals === undefined ? [] : _data$terminals;
                success_count = ((successCounter || [])[0] || {}).count || 0;
                success_value = ((successCounter || [])[0] || {}).totalAmount || 0;
                failed_value = total_value - success_value;
                success_percent = parseFloat((success_count * 100 / (total_volume || 1)).toFixed(2));
                failed_count = total_volume - success_count;
                failed_percent = parseFloat((100 - success_percent).toFixed(2));
                _context4.next = 19;
                return TerminalService.getAllCount(merchant_id);

              case 19:
                terminal_count = _context4.sent;
                utilized_terminals = terminals.length;
                utilized_terminals_percent = parseFloat((utilized_terminals * 100 / (terminal_count || 1)).toFixed(2));
                non_utilized_terminals = terminal_count - utilized_terminals;

                non_utilized_terminals = non_utilized_terminals < 0 ? 0 : non_utilized_terminals;
                non_utilized_terminals_percent = parseFloat((100 - utilized_terminals_percent).toFixed(2));

                non_utilized_terminals_percent = non_utilized_terminals_percent < 0 ? 0 : non_utilized_terminals_percent;

                return _context4.abrupt('return', {
                  total_value: total_value,
                  total_volume: total_volume,
                  success_count: success_count,
                  success_value: success_value,
                  success_percent: success_percent,
                  failed_count: failed_count,
                  failed_value: failed_value,
                  failed_percent: failed_percent,
                  utilized_terminals: utilized_terminals,
                  utilized_terminals_percent: utilized_terminals_percent,
                  non_utilized_terminals: non_utilized_terminals,
                  non_utilized_terminals_percent: non_utilized_terminals_percent
                });

              case 27:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function stat() {
        return _ref4.apply(this, arguments);
      }

      return stat;
    }()

    /**
    * Gets transaction statistics for given start and end dates
    * @param {Date} startDate
    * @param {Date} endDate
    */

  }, {
    key: 'statSummary',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var merchant_id, statData, $match, successCounter, data, _data$total_value2, total_value, success_value, failed_value;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                merchant_id = this.$match[transMod.getField('merchant_id')] || null;
                _context5.next = 3;
                return this.Transaction.aggregate([{ $match: this.$match }, {
                  $group: {
                    _id: null,
                    total_value: { $sum: '$' + transMod.getField('amount') }
                  }
                }]);

              case 3:
                statData = _context5.sent;
                $match = this.$match;

                $match[transMod.getField('response_code')] = '00';

                _context5.next = 8;
                return this.Transaction.aggregate([{ $match: $match }, {
                  $group: {
                    _id: null,
                    totalAmount: { $sum: '$' + transMod.getField('amount') }
                  }
                }]);

              case 8:
                successCounter = _context5.sent;
                data = (statData || [])[0] || {};
                _data$total_value2 = data.total_value, total_value = _data$total_value2 === undefined ? 0 : _data$total_value2;
                success_value = ((successCounter || [])[0] || {}).totalAmount || 0;
                failed_value = total_value - success_value;
                return _context5.abrupt('return', {
                  total_value: total_value,
                  success_value: success_value,
                  failed_value: failed_value
                });

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function statSummary() {
        return _ref5.apply(this, arguments);
      }

      return statSummary;
    }()
  }, {
    key: 'failureReason',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var $group, $project, reasons;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                $group = {
                  _id: { message: '$' + transMod.getField('response_msg') },
                  responses: { $sum: 1 }
                };
                $project = {
                  _id: 0,
                  message: '$_id.message',
                  count: '$responses'
                };
                _context6.next = 4;
                return this.Transaction.aggregate([{ $match: this.$match }, { $group: $group }, { $project: $project }, { $sort: { count: -1 } }]);

              case 4:
                reasons = _context6.sent;
                return _context6.abrupt('return', reasons);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function failureReason() {
        return _ref6.apply(this, arguments);
      }

      return failureReason;
    }()

    /**
    * This returns the aggregate transactions for every merchants for given filter in $match
    */

  }, {
    key: 'merchSummary',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var group, $project, $match, rows, merchantIds, failedTransactions;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                group = {
                  _id: { merchant_id: '$' + transMod.getField('merchant_id') },
                  trans_value: { $sum: '$' + transMod.getField('amount') },
                  trans_volume: { $sum: 1 },
                  active_terminals: { $addToSet: '$' + transMod.getField('terminal_id') }
                };
                $project = {
                  _id: 0,
                  merchant_id: '$_id.merchant_id',
                  trans_value: '$trans_value',
                  trans_volume: '$trans_volume',
                  active_terminals: { $size: '$active_terminals' }
                };
                $match = this.$match;

                $match[transMod.getField('response_code')] = '00';

                _context7.next = 6;
                return this.Transaction.aggregate([{ $match: $match }, { $group: group }, { $sort: { trans_value: -1 } }, { $skip: this.$skip }, { $limit: this.$limit }, { $project: $project }]).allowDiskUse(true);

              case 6:
                rows = _context7.sent;
                merchantIds = rows.map(function (a) {
                  return a.merchant_id;
                });

                $match[transMod.getField('response_code')] = { $ne: '00' };
                $match[transMod.getField('merchant_id')] = { $in: merchantIds };

                _context7.next = 12;
                return this.Transaction.aggregate([{ $match: $match }, { $group: group }, { $project: $project }]).allowDiskUse(true);

              case 12:
                failedTransactions = _context7.sent;


                rows = rows.map(function (item) {
                  var rec = { merchant_id: item.merchant_id, merchant_name: item.merchant_name };
                  var failedTrans = failedTransactions.find(function (a) {
                    return a.merchant_id === item.merchant_id;
                  }) || {};
                  rec.successful_volume = item.trans_volume || 0;
                  rec.successful_value = (item.trans_value || 0) / 100;
                  rec.failed_volume = failedTrans.trans_volume || 0;
                  rec.failed_value = (failedTrans.trans_value || 0) / 100;
                  rec.total_value = rec.successful_value + rec.failed_value;
                  rec.total_volume = rec.successful_volume + rec.failed_volume;
                  return rec;
                });

                return _context7.abrupt('return', rows);

              case 15:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function merchSummary() {
        return _ref7.apply(this, arguments);
      }

      return merchSummary;
    }()

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

  }, {
    key: 'performance',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'merchant';

        var $group, $project, totalGroup, $facet, pipelines, transData, _transData, _transData2, _transData2$, transactions, summary;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                $group = {
                  trans_value: { $sum: '$' + transMod.getField('amount') },
                  trans_volume: { $sum: 1 }
                };
                $project = {
                  _id: 0,
                  merchant_name: 1,
                  trans_value: '$trans_value',
                  trans_volume: '$trans_volume'
                };


                if (type === 'merchant') {
                  $group._id = { merchant_id: '$' + transMod.getField('merchant_id') };
                  $group.active_terminals = { $addToSet: '$' + transMod.getField('terminal_id') };
                  $group.merchant_name = { $first: '$' + transMod.getField('merchant_name') };

                  $project.merchant_id = '$_id.merchant_id';
                  $project.active_terminals = { $size: '$active_terminals' };
                } else {
                  $group._id = { terminal_id: '$' + transMod.getField('terminal_id') };

                  $project.terminal_id = '$_id.terminal_id';
                }

                totalGroup = {
                  _id: null,
                  total_volume: { $sum: '$trans_volume' },
                  total_value: { $sum: '$trans_value' }
                };
                $facet = {
                  rows: [{ $skip: this.$skip }, { $limit: this.$limit }],
                  total: [{ $group: totalGroup }]
                };
                pipelines = [{ $match: this.$match }, { $group: $group }, { $project: $project }];


                if (this.$sort) {
                  pipelines.push({ $sort: this.$sort });
                }
                pipelines.push({ $facet: $facet });

                _context8.next = 10;
                return this.Transaction.aggregate(pipelines).allowDiskUse(true);

              case 10:
                transData = _context8.sent;
                _transData = transData;
                _transData2 = (0, _slicedToArray3.default)(_transData, 1);
                _transData2$ = _transData2[0];
                transData = _transData2$ === undefined ? {} : _transData2$;
                transactions = transData.rows || [];
                summary = (0, _extends3.default)({}, (transData.total || [])[0]);

                delete summary._id;

                return _context8.abrupt('return', { transactions: transactions, summary: summary });

              case 19:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function performance() {
        return _ref8.apply(this, arguments);
      }

      return performance;
    }()

    /**
     * Get Terminals statistics from transactions, online or active terminal count
     * @param {String} type - can be 'online' or 'active'
     */

  }, {
    key: 'transTermStat',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(type) {
        var merchant_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var secs, last, $match, stat;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                secs = 0;

                if (!(type === 'active')) {
                  _context9.next = 10;
                  break;
                }

                _context9.next = 4;
                return ConfigService.getKeyValue('active_terminal_seconds');

              case 4:
                _context9.t0 = _context9.sent;

                if (_context9.t0) {
                  _context9.next = 7;
                  break;
                }

                _context9.t0 = 7 * 24 * 60 * 60;

              case 7:
                secs = _context9.t0;
                _context9.next = 16;
                break;

              case 10:
                _context9.next = 12;
                return ConfigService.getKeyValue('online_terminal_seconds');

              case 12:
                _context9.t1 = _context9.sent;

                if (_context9.t1) {
                  _context9.next = 15;
                  break;
                }

                _context9.t1 = 30;

              case 15:
                secs = _context9.t1;

              case 16:
                last = new Date(new Date().getTime() - secs * 1000);
                $match = this.$match;

                $match[transMod.getField('transaction_date')] = { $gt: last };
                if (merchant_id) $match[transMod.getField('merchant_id')] = merchant_id;

                _context9.next = 22;
                return this.Transaction.aggregate([{ $match: $match }, { $group: { _id: { terminal: '$' + transMod.getField('terminal_id') } } }, { $count: 'count' }]);

              case 22:
                stat = _context9.sent;
                return _context9.abrupt('return', ((stat || [])[0] || {}).count || 0);

              case 24:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function transTermStat(_x6) {
        return _ref9.apply(this, arguments);
      }

      return transTermStat;
    }()
  }, {
    key: 'terminalIDs',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        var $match, trans;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                $match = this.$match;
                _context10.next = 3;
                return this.Transaction.aggregate([{ $match: $match }, { $group: { _id: '$' + transMod.getField('terminal_id') } }]);

              case 3:
                trans = _context10.sent;
                return _context10.abrupt('return', trans.map(function (item) {
                  return item._id;
                }));

              case 5:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function terminalIDs() {
        return _ref10.apply(this, arguments);
      }

      return terminalIDs;
    }()

    /**
     * Gets summary of transactions per type for given date
     * @param {Date} date
     */

  }, {
    key: 'bankSummary',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'month';

        var endDate, startDate, group, project, group2, rows, startDay, endDay, _loop2, i;

        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                endDate = this.$match[transMod.getField('transaction_date')].$lte;
                startDate = this.$match[transMod.getField('transaction_date')].$gte;
                group = {
                  _id: {
                    day: {
                      $dayOfMonth: {
                        date: '$' + transMod.getField('transaction_date'),
                        timezone: process.env.TZ
                      }
                    },
                    terminal: '$' + transMod.getField('terminal_id')
                  },
                  total: { $sum: { $toDouble: '$' + transMod.getField('amount') } },
                  volume: { $sum: 1 },
                  bank: { $addToSet: { $substr: ['$' + transMod.getField('terminal_id'), 0, 4] } }
                };
                project = {
                  _id: 0,
                  year: {
                    $year: {
                      date: new Date(startDate),
                      timezone: process.env.TZ
                    }
                  },
                  month: {
                    $month: {
                      date: new Date(startDate),
                      timezone: process.env.TZ
                    }
                  },
                  day: '$_id.day',
                  total: 1,
                  total_settlement: 1,
                  volume: 1,
                  charge: 1,
                  terminal: '$_id.terminal',
                  bank: '$_id.bank'
                };
                group2 = {
                  _id: {
                    bank: '$bank',
                    day: '$_id.day'
                  },
                  total: { $sum: { $toDouble: '$total' } },
                  volume: { $sum: '$volume' }
                };
                _context11.next = 7;
                return this.Transaction.aggregate([{ $match: this.$match }, { $group: group }, { $unwind: '$bank' }, { $group: group2 }, { $project: project }]).allowDiskUse(true);

              case 7:
                rows = _context11.sent;

                rows.sort(function (a, b) {
                  return a.day > b.day ? 1 : -1;
                });

                if (type === 'd' && !rows.length) {
                  rows.push({
                    year: (0, _moment2.default)(startDate).year(),
                    month: (0, _moment2.default)(startDate).month() + 1,
                    day: (0, _moment2.default)(startDate).date(),
                    total: 0,
                    total_settlement: 0,
                    volume: 0,
                    charge: 0
                  });
                } else if (type !== 'd') {
                  startDay = (0, _moment2.default)(startDate).date();
                  endDay = (0, _moment2.default)(endDate).date();

                  _loop2 = function _loop2(i) {
                    if (!rows.find(function (item) {
                      return item.day === i;
                    })) {
                      rows.push({
                        year: (0, _moment2.default)(endDate).date(i).year(),
                        month: (0, _moment2.default)(endDate).date(i).month() + 1,
                        day: i,
                        total: 0,
                        total_settlement: 0,
                        volume: 0,
                        charge: 0
                      });
                    }
                  };

                  for (i = startDay; i <= endDay; i++) {
                    _loop2(i);
                  }
                }

                rows = rows.map(function (item) {
                  if (item.year && item.month && item.day) {
                    item.date = (0, _moment2.default)(item.year + '-' + item.month + '-' + item.day, 'YYYY-MM-DD').format('DD-MMM-YYYY');
                  }
                  return item;
                });

                return _context11.abrupt('return', rows);

              case 12:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function bankSummary() {
        return _ref11.apply(this, arguments);
      }

      return bankSummary;
    }()
  }]);
  return TransactionService;
}();

exports.default = TransactionService;