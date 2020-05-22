'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _TokenUtil = require('../helpers/TokenUtil');

var _TokenUtil2 = _interopRequireDefault(_TokenUtil);

var _emailSender = require('../helpers/emailSender');

var _emailSender2 = _interopRequireDefault(_emailSender);

var _User = require('../database/mongodb/models/User');

var _User2 = _interopRequireDefault(_User);

var _authentication = require('../middlewares/authentication');

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Authentication Controller
*/
var AuthController = function () {
  function AuthController() {
    (0, _classCallCheck3.default)(this, AuthController);
  }

  (0, _createClass3.default)(AuthController, [{
    key: 'signup',

    /**
    * This handles user registration.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var _req$body, firstname, lastname, email, pass, role, roles, position, password, user, message;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, email = _req$body.email, pass = _req$body.password, role = _req$body.role;
                roles = ('' + (role || '')).toLowerCase().split(' ') || [];
                position = ('' + (role || '')).toLowerCase().replace(/\s/g, '_');


                if ((0, _keys2.default)((0, _User.getUserPosVal)('all')).includes(role)) {
                  roles = ['admin'];
                  position = role;
                }

                _context.prev = 4;
                password = _bcrypt2.default.hashSync(pass, 10);
                user = new _User2.default({
                  firstname: firstname,
                  lastname: lastname,
                  email: email,
                  password: password,
                  position: position,
                  roles: roles
                });

                user.save();

                message = '\n      <div><img style="height: 35px; display: block; margin: auto" src="' + process.env.UI_URL + '/assets/img/trackmoney.png"/></div>\n      <p>Hello <b>' + user.firstname + ',</b><p>\n      <p style="margin-bottom: 0">Your account on ' + process.env.APP_NAME + ' has been created. You can login using your email and password.</p>\n      <p style="margin-bottom: 0">Email: <code>' + user.email + '</code></p>\n      <p style="margin-top: 0">Password: <code>' + pass + '</code></p>\n      <p><small>You can change your password when you login.</small></p>\n      <a href="' + process.env.UI_URL + '/login">\n      <button style="background-color:green; color:white; padding: 3px 8px; outline:0">Login Here</button></a>\n      <p style="margin-bottom: 0">You can copy and paste to browser if above link is not clickable.</p>\n      <code>' + process.env.UI_URL + '/login</code>\n      <br>\n      <p>' + process.env.APP_NAME + ' &copy; ' + new Date().getFullYear() + '</p>';


                (0, _emailSender2.default)({ emailRecipients: [user.email], emailBody: message, emailSubject: process.env.APP_NAME + ' Account Created.' });

                return _context.abrupt('return', _Response2.default.send(res, _statusCodes2.default.created, {
                  data: { message: 'The user account has been created successfully and user notified.' }
                }));

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](4);
                return _context.abrupt('return', _Response2.default.handleError(res, _context.t0));

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 13]]);
      }));

      function signup(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return signup;
    }()

    /**
    * This handles user login.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'login',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var _req$body2, email, password, user, token;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
                _context2.prev = 1;
                _context2.next = 4;
                return getUser(email);

              case 4:
                user = _context2.sent;
                _context2.t0 = !user;

                if (_context2.t0) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 9;
                return _bcrypt2.default.compareSync(password, user.password || '');

              case 9:
                _context2.t0 = !_context2.sent;

              case 10:
                if (!_context2.t0) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.unAuthorized, {
                  error: 'Invalid Email address or password.'
                }));

              case 12:

                user = user.toObject();
                delete user.password;
                delete user.emailtoken;

                token = _TokenUtil2.default.sign(user);

                res.cookie('authorization', token, { maxAge: 900000, httpOnly: true });
                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: { token: token, user: user }
                }));

              case 20:
                _context2.prev = 20;
                _context2.t1 = _context2['catch'](1);
                return _context2.abrupt('return', _Response2.default.handleError(res, _context2.t1));

              case 23:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 20]]);
      }));

      function login(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return login;
    }()

    /**
    * This handles user request to reset password, and sends password reset email.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'requestResetPassword',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var email, user, userEmail, emailtoken, message;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                email = req.body.email;
                _context3.prev = 1;
                _context3.next = 4;
                return getUser(email);

              case 4:
                user = _context3.sent;

                if (user) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'User does not exist.'
                }));

              case 7:
                userEmail = user.email || user.merchant_email;

                if (userEmail) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'No email associated with this account, contact the admin!'
                }));

              case 10:
                emailtoken = Math.random().toString(15).substring(2);
                message = '<b>Hello ' + user.firstname + '</b><br>\n      <p>You requested to reset your password on ' + process.env.APP_NAME + '.</p>\n      <p>Click on the link below to reset your password</p>\n      <a href="' + process.env.UI_URL + '/auth/verify?email=' + email + '&token=' + emailtoken + '">\n      <button style="background-color:green; color:white; padding: 3px 8px; outline:0">Reset Password</button></a>\n      <p>You can copy and paste to browser.</p>\n      <code>' + process.env.UI_URL + '/auth/verify?email=' + email + '&token=' + emailtoken + '</code>\n      <p>Kindly ignore, if you didn\'t make the request</p><br>\n      <p>' + process.env.APP_NAME + ' &copy; ' + new Date().getFullYear() + '</p>';


                (0, _emailSender2.default)({ emailRecipients: [userEmail], emailBody: message, emailSubject: 'Reset Password Confirmation' });

                user.emailtoken = emailtoken;
                _context3.next = 16;
                return user.save();

              case 16:
                return _context3.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: {
                    message: 'Check your email for password reset link.',
                    email: email
                  }
                }));

              case 19:
                _context3.prev = 19;
                _context3.t0 = _context3['catch'](1);
                return _context3.abrupt('return', _Response2.default.handleError(res, _context3.t0));

              case 22:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 19]]);
      }));

      function requestResetPassword(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return requestResetPassword;
    }()

    /**
    * This handles user changing a users password: with emailtoken or authenticated user token.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'resetPassword',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var _req$body3, token, email, pass, user, loggedIn, uID, password;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _req$body3 = req.body, token = _req$body3.token, email = _req$body3.email, pass = _req$body3.password;
                user = null;
                _context4.prev = 2;

                if (!token) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 6;
                return getUser(email, { emailtoken: token });

              case 6:
                user = _context4.sent;
                _context4.next = 17;
                break;

              case 9:
                // Get the logged in user from authorization in param: req
                loggedIn = (0, _authentication.getUserFromToken)(req);

                if (loggedIn.status) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.unAuthorized, {
                  error: loggedIn.error
                }));

              case 12:
                uID = loggedIn.user.email;

                isMerchant = !(0, _utils.validateEmail)(uID);
                _context4.next = 16;
                return getUser(uID, isMerchant);

              case 16:
                user = _context4.sent;

              case 17:
                if (user) {
                  _context4.next = 19;
                  break;
                }

                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Invalid link, kindly re-request for password reset.'
                }));

              case 19:
                password = _bcrypt2.default.hashSync(pass, 10);

                user.password = password;
                user.emailtoken = '';
                _context4.next = 24;
                return user.save();

              case 24:
                return _context4.abrupt('return', _Response2.default.send(res, _statusCodes2.default.success, {
                  data: {
                    message: 'Password changed successfully.',
                    email: email
                  }
                }));

              case 27:
                _context4.prev = 27;
                _context4.t0 = _context4['catch'](2);
                return _context4.abrupt('return', _Response2.default.handleError(res, _context4.t0));

              case 30:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 27]]);
      }));

      function resetPassword(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return resetPassword;
    }()
  }]);
  return AuthController;
}(); /* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars


var getUser = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(uId, filter) {
    var user;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if ((typeof filter === 'undefined' ? 'undefined' : (0, _typeof3.default)(filter)) !== 'object' || !filter) filter = {};

            user = null;
            _context5.next = 4;
            return _User2.default.findOne((0, _extends3.default)({ email: uId }, filter));

          case 4:
            user = _context5.sent;
            return _context5.abrupt('return', user);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getUser(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.default = new AuthController();