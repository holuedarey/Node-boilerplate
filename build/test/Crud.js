'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _User = require('../database/mongodb/models/User');

var _User2 = _interopRequireDefault(_User);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
_chai2.default.use(_chaiHttp2.default);

var aUser = {
  firstname: 'Ken',
  lastname: 'Kenn',
  email: 'kenneth.onah@iisysgroup.com',
  password: 'itexitex',
  roles: ['super']
};

var token = '';

describe('Login a user: POST /auth/login', function () {
  before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var password;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            password = _bcrypt2.default.hashSync(aUser.password, 10);
            _context.next = 3;
            return _User2.default.create((0, _extends3.default)({}, aUser, { password: password }));

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  after((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _User2.default.deleteMany({ email: aUser.email });

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('should successfully login a user', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
              email: aUser.email,
              password: aUser.password
            });

          case 2:
            response = _context3.sent;


            // eslint-disable-next-line prefer-destructuring
            token = response.body.data.token;

            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body.data.token).to.be.a('string');
            (0, _chai.expect)(response.body.data.user).to.be.an('object');
            (0, _chai.expect)(response.body.data.user.firstname).to.eqls(aUser.firstname);
            (0, _chai.expect)(response.body.data.user.lastname).to.eqls(aUser.lastname);
            (0, _chai.expect)(response.body.data.user._id).to.be.a('string');

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('should fail to login a user with incorrect details', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var response;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
              email: 'random@email.com',
              password: 'Userpassword'
            });

          case 2:
            response = _context4.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.unAuthorized);
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.unAuthorized);
            (0, _chai.expect)(response.body.error).eqls('Invalid email address or password.');

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe('Sign up a user: POST /auth/signup', function () {
  after((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _User2.default.deleteOne({ email: aUser.email });

          case 2:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('should successfully signup a new user', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var response;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _chai2.default.request(_app2.default).post('/api/v1/auth/signup').send(aUser).set('authorization', token);

          case 2:
            response = _context6.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.created);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.created);
            (0, _chai.expect)(response.body.data.message).to.eqls('The user account has been created successfully and user notified.');

          case 7:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }))).timeout(5000);

  it('should fail to create a user without a name', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var aUser2, response;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            aUser2 = (0, _extends3.default)({}, aUser, { email: 'ken@ken.com' });

            delete aUser2.firstname;
            _context7.next = 4;
            return _chai2.default.request(_app2.default).post('/api/v1/auth/signup').send(aUser2).set('authorization', token);

          case 4:
            response = _context7.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.badRequest);
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.badRequest);
            (0, _chai.expect)(response.body.error).eqls('Validation errors.');
            (0, _chai.expect)(response.body.fields.firstname).eqls('Firstname is required.');

          case 9:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));
});

describe('Request to reset password: POST /auth/reset', function () {
  before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var password;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            password = _bcrypt2.default.hashSync(aUser.password, 10);
            _context8.next = 3;
            return _User2.default.create((0, _extends3.default)({}, aUser, { password: password }));

          case 3:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  after((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _User2.default.deleteOne({ email: aUser.email });

          case 2:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('should successfully request reset password email', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var response;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _chai2.default.request(_app2.default).post('/api/v1/auth/reset').send({ email: aUser.email });

          case 2:
            response = _context10.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body.data.message).to.eqls('Check your email for password reset link.');
            (0, _chai.expect)(response.body.data.email).to.eqls(aUser.email);

          case 8:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }))).timeout(5000);

  it('should fail to request reset password email for non-existent user', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var response;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _chai2.default.request(_app2.default).post('/api/v1/auth/reset').send({ email: 'random@email.com' });

          case 2:
            response = _context11.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.badRequest);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.badRequest);
            (0, _chai.expect)(response.body.error).to.eqls('User does not exist.');

          case 7:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  }))).timeout(5000);
});

describe('Change user password: PATCH /auth/reset', function () {
  var emailtoken = '09ihh9u92ufh888ue8u8dhh';
  before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var password;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            password = _bcrypt2.default.hashSync(aUser.password, 10);
            _context12.next = 3;
            return _User2.default.create((0, _extends3.default)({}, aUser, { password: password, emailtoken: emailtoken }));

          case 3:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  after((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _User2.default.deleteOne({ email: aUser.email });

          case 2:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('should successfully change user password by email token', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    var response;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _chai2.default.request(_app2.default).patch('/api/v1/auth/reset').send({
              email: aUser.email,
              token: emailtoken,
              password: 'newPassw'
            });

          case 2:
            response = _context14.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body.data.message).to.eqls('Password changed successfully.');
            (0, _chai.expect)(response.body.data.email).to.eqls(aUser.email);

          case 8:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  }))).timeout(5000);

  it('should successfully change user password by loggedin user', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var response;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return _chai2.default.request(_app2.default).patch('/api/v1/auth/reset').send({
              email: aUser.email,
              password: 'newPassw'
            }).set('authorization', token);

          case 2:
            response = _context15.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.success);
            (0, _chai.expect)(response.body.data.message).to.eqls('Password changed successfully.');
            (0, _chai.expect)(response.body.data.email).to.eqls(aUser.email);

          case 8:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  }))).timeout(5000);

  it('should fail to change password for invalid token', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var response;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _chai2.default.request(_app2.default).patch('/api/v1/auth/reset').send({
              email: 'random@email.com',
              token: 'iuhjndijiofiuud',
              password: 'newPassd'
            });

          case 2:
            response = _context16.sent;


            (0, _chai.expect)(response.status).to.eqls(_statusCodes2.default.badRequest);
            (0, _chai.expect)(response.body).to.be.an('object');
            (0, _chai.expect)(response.body.status).to.eqls(_statusCodes2.default.badRequest);
            (0, _chai.expect)(response.body.error).to.eqls('Invalid link, kindly re-request for password reset.');

          case 7:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  }))).timeout(5000);
});