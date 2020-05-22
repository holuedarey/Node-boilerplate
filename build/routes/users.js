'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonRequestValidator = require('json-request-validator');

var _jsonRequestValidator2 = _interopRequireDefault(_jsonRequestValidator);

var _UserController = require('../controllers/UserController');

var _UserController2 = _interopRequireDefault(_UserController);

var _authentication = require('../middlewares/authentication');

var _validateInputs = require('../middlewares/validateInputs');

var _validateInputs2 = _interopRequireDefault(_validateInputs);

var _validationRules = require('../middlewares/validationRules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Routes of '/users'
 */
var usersRouter = _express2.default.Router();

usersRouter.get('/', (0, _authentication.isAdmin)('super'), _UserController2.default.getUsers);
usersRouter.patch('/', (0, _authentication.isAdmin)('super'), (0, _jsonRequestValidator2.default)(_validationRules.setRoleRules), _UserController2.default.setUserRole);
usersRouter.delete('/:id', (0, _authentication.isAdmin)('super'), _UserController2.default.deleteUser);
usersRouter.post('/merchant', (0, _authentication.isAdmin)('super'), (0, _validateInputs2.default)(_validationRules.merchantEmailRules), _UserController2.default.setMerchantEmail);

exports.default = usersRouter;