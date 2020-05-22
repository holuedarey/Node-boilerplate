'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _User = require('../database/mongodb/models/User');

var _User2 = _interopRequireDefault(_User);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserController = function () {
  function UserController() {
    (0, _classCallCheck3.default)(this, UserController);
  }

  (0, _createClass3.default)(UserController, [{
    key: 'getUsers',

    /**
    * This handles viewing all users.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var _req$query, page, limit, offset, users, data;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _req$query = req.query, page = _req$query.page, limit = _req$query.limit;


                limit = (0, _isNan2.default)(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
                page = (0, _isNan2.default)(parseInt(page, 10)) ? 1 : parseInt(page, 10);

                offset = (page - 1) * limit;
                _context.prev = 4;
                _context.next = 7;
                return _User2.default.find({}).select('-password -emailtoken').skip(offset).limit(limit).lean();

              case 7:
                users = _context.sent;
                data = users.map(function (item) {
                  var role = item.position || (item.roles.includes('super') ? 'super_admin' : '') || (item.roles.includes('admin') ? 'admin' : 'staff');
                  item.role = _User.userRoles[role] || 'Staff';
                  delete item.roles;
                  delete item.position;
                  return item;
                });
                return _context.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: data
                }));

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](4);
                return _context.abrupt('return', _Response2.default.handleError(res, _context.t0));

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 12]]);
      }));

      function getUsers(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getUsers;
    }()

    /**
    * This handles viewing a given user.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'getUser',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var user;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if ((0, _utils.validateMongoID)(req.params.id)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'User not found.'
                }));

              case 2:
                _context2.prev = 2;
                _context2.next = 5;
                return _User2.default.findById(req.params.id).lean();

              case 5:
                user = _context2.sent;

                if (user) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.notFound, {
                  error: 'User not found.'
                }));

              case 8:
                delete user.password;
                delete user.emailtoken;
                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: user
                }));

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2['catch'](2);
                return _context2.abrupt('return', _Response2.default.handleError(res, _context2.t0));

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 13]]);
      }));

      function getUser(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getUser;
    }()

    /**
    * This handles setting merchants email.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'setMerchantEmail',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var _req$body, merchant_id, email, user;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _req$body = req.body, merchant_id = _req$body.merchant_id, email = _req$body.email;
                _context3.prev = 1;
                _context3.next = 4;
                return Merchant.findOne({ merchant_id: merchant_id });

              case 4:
                user = _context3.sent;

                if (user) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt('return', _Response2.default.send(res, _statusCodes2.default.notFound, {
                  error: 'User not found.'
                }));

              case 7:
                user.merchant_email = email;
                _context3.next = 10;
                return user.save();

              case 10:
                return _context3.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: { message: 'Email successfully set.' }
                }));

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](1);
                return _context3.abrupt('return', _Response2.default.handleError(res, _context3.t0));

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 13]]);
      }));

      function setMerchantEmail(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return setMerchantEmail;
    }()

    /**
    * This handles deleting a user.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'deleteUser',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if ((0, _utils.validateMongoID)(req.params.id)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'User not found.'
                }));

              case 2:
                _context4.prev = 2;
                _context4.next = 5;
                return _User2.default.deleteOne({ _id: req.params.id });

              case 5:
                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: {
                    message: 'User deleted successfully.'
                  }
                }));

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4['catch'](2);
                return _context4.abrupt('return', _Response2.default.handleError(res, _context4.t0));

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 8]]);
      }));

      function deleteUser(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return deleteUser;
    }()
  }, {
    key: 'setUserRole',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var _req$body2, role, _id, roles, position, user;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _req$body2 = req.body, role = _req$body2.role, _id = _req$body2.id;

                if ((0, _utils.validateMongoID)(_id)) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'User not found.'
                }));

              case 3:
                roles = ('' + (role || '')).toLowerCase().split(' ') || [];
                position = null;


                if ((0, _keys2.default)((0, _User.getUserPosVal)('all')).includes(role)) {
                  roles = ['admin'];
                  position = role;
                }

                _context5.prev = 6;
                _context5.next = 9;
                return _User2.default.findOne({ _id: _id });

              case 9:
                user = _context5.sent;

                if (user) {
                  _context5.next = 12;
                  break;
                }

                return _context5.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'User not found.'
                }));

              case 12:
                user.position = position;
                user.roles = roles;
                _context5.next = 16;
                return user.save();

              case 16:
                return _context5.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: {
                    message: 'User role updated successfully.'
                  }
                }));

              case 19:
                _context5.prev = 19;
                _context5.t0 = _context5['catch'](6);
                return _context5.abrupt('return', _Response2.default.handleError(res, _context5.t0));

              case 22:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[6, 19]]);
      }));

      function setUserRole(_x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return setUserRole;
    }()
  }]);
  return UserController;
}(); // eslint-disable-next-line no-unused-vars


exports.default = new UserController();