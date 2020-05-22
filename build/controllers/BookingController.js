'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _utils = require('../helpers/utils');

var _Logger = require('../helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _BookingServices = require('../database/services/BookingServices');

var _BookingServices2 = _interopRequireDefault(_BookingServices);

var _admin = require('../socket/admin');

var _Service = require('../database/mongodb/models/Service');

var _Service2 = _interopRequireDefault(_Service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
var BookingController = function () {
  function BookingController() {
    (0, _classCallCheck3.default)(this, BookingController);
  }

  (0, _createClass3.default)(BookingController, [{
    key: 'viewOne',


    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var id, booking;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = req.params.id;

                if ((0, _utils.validateMongoID)(id)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Record not found.'
                }));

              case 3:
                _context.prev = 3;
                _context.next = 6;
                return _Service2.default.findById({ _id: id });

              case 6:
                booking = _context.sent;

                if (booking) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', _Response2.default.send(res, _statusCodes2.default.notFound, {
                  error: 'Booking not found.'
                }));

              case 9:
                return _context.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: booking
                }));

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](3);
                return _context.abrupt('return', _Response2.default.handleError(res, _context.t0));

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 12]]);
      }));

      function viewOne(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return viewOne;
    }()

    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'getAll',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var _req$query, page, limit, booking, result;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _req$query = req.query, page = _req$query.page, limit = _req$query.limit;


                limit = (0, _isNan2.default)(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
                page = (0, _isNan2.default)(parseInt(page, 10)) ? 1 : parseInt(page, 10);

                _context2.prev = 3;
                booking = new _BookingServices2.default();
                _context2.next = 7;
                return booking.getAll(page, limit);

              case 7:
                result = _context2.sent;

                _Response2.default.send(res, _statusCodes2.default.success, {
                  data: result
                });
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](3);
                _Response2.default.handleError(res, _context2.t0);
              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 11]]);
      }));

      function getAll(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getAll;
    }()

    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'bookAservice',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var _req$body, service_date, service_time, title, description, service, category, user, data, newServices, _bookServices;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _req$body = req.body, service_date = _req$body.service_date, service_time = _req$body.service_time, title = _req$body.title, description = _req$body.description, service = _req$body.service, category = _req$body.category;
                user = req.user;
                data = {
                  service_date: service_date,
                  service_time: service_time,
                  title: title,
                  description: description,
                  service: service,
                  category: category,
                  user_id: user._id,
                  firstname: user.firstname,
                  lastname: user.lastname
                };
                newServices = new _BookingServices2.default();
                _context3.prev = 4;
                _context3.next = 7;
                return newServices.bookAservices(data);

              case 7:
                _bookServices = _context3.sent;

                //start socket to send notification
                // setTimeout(() => {
                (0, _admin.sendNotification)('customer', _bookServices._id);
                // }, 1000)

                _Response2.default.send(res, _statusCodes2.default.success, {
                  data: _bookServices
                });
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3['catch'](4);
                _Response2.default.handleError(res, _context3.t0);
              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 12]]);
      }));

      function bookAservice(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return bookAservice;
    }()

    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'updateBooking',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var _req$body2, service_date, service_time, title, description, service, category, _id, user, data, _service, updateBookServices;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _req$body2 = req.body, service_date = _req$body2.service_date, service_time = _req$body2.service_time, title = _req$body2.title, description = _req$body2.description, service = _req$body2.service, category = _req$body2.category, _id = _req$body2.id;

                if ((0, _utils.validateMongoID)(_id)) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Record not found.'
                }));

              case 3:
                user = req.user;

                console.log(user);
                data = {
                  service_date: service_date,
                  service_time: service_time,
                  title: title,
                  description: description,
                  service: service,
                  category: category,
                  user_id: user._id,
                  firstname: user.firstname,
                  lastname: user.lastname
                };
                _context4.prev = 6;
                _context4.next = 9;
                return _Service2.default.findOne({ _id: _id });

              case 9:
                _service = _context4.sent;

                if (_service) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Record not found.'
                }));

              case 12:
                updateBookServices = _service(data);

                updateBookServices.save();

                //start socket to send notification
                // setTimeout(() => {
                (0, _admin.sendNotification)('customer_update', bookServices._id);
                // }, 1000)

                _Response2.default.send(res, _statusCodes2.default.success, {
                  data: updateBookServices
                });
                _context4.next = 21;
                break;

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4['catch'](6);
                _Response2.default.handleError(res, _context4.t0);
              case 21:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[6, 18]]);
      }));

      function updateBooking(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return updateBooking;
    }()

    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'deleteBooking',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if ((0, _utils.validateMongoID)(req.params.id)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Record not found.'
                }));

              case 2:
                _context5.prev = 2;
                _context5.next = 5;
                return _Service2.default.deleteOne({ _id: req.params.id });

              case 5:
                return _context5.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: {
                    message: 'Record deleted successfully.'
                  }
                }));

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5['catch'](2);
                return _context5.abrupt('return', _Response2.default.handleError(res, _context5.t0));

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 8]]);
      }));

      function deleteBooking(_x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return deleteBooking;
    }()
  }]);
  return BookingController;
}();

exports.default = new BookingController();