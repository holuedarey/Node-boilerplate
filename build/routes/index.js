'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _authentication = require('../middlewares/authentication');

var _FileController = require('../controllers/FileController');

var _FileController2 = _interopRequireDefault(_FileController);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _booking = require('./booking');

var _booking2 = _interopRequireDefault(_booking);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Router
 */
var route = function route(app) {
  app.use('/api/v1/booking', _authentication.authenticated, _booking2.default);
  app.use('/api/v1/categories', _category2.default);
  app.use('/api/v1/users', _authentication.authenticated, _users2.default);
  app.use('/api/v1/auth', _auth2.default);

  //endpoint to get data from vas transaction

  app.get('/api/v1/files/*', _FileController2.default.download);
  app.get('/', function (req, res) {
    return _Response2.default.send(res, _statusCodes2.default.success, {
      message: 'This app is running!!!'
    });
  });
  app.get('/api', function (req, res) {
    return _Response2.default.send(res, _statusCodes2.default.success, {
      message: 'This app is running!!!'
    });
  });
  app.get('/api/v1', function (req, res) {
    return _Response2.default.send(res, _statusCodes2.default.success, {
      message: 'This is version 1.0.1!'
    });
  });

  app.get('*', function (req, res) {
    return _Response2.default.send(res, _statusCodes2.default.notFound, {
      error: 'Endpoint not found.'
    });
  });
};

exports.default = route;