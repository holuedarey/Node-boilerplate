'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _AuthController = require('../controllers/AuthController');

var _AuthController2 = _interopRequireDefault(_AuthController);

var _trimInputs = require('../middlewares/trimInputs');

var _trimInputs2 = _interopRequireDefault(_trimInputs);

var _validateInputs = require('../middlewares/validateInputs');

var _validateInputs2 = _interopRequireDefault(_validateInputs);

var _validationRules = require('../middlewares/validationRules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Routes of '/auth'
 */
var authRouter = _express2.default.Router();

authRouter.route('/signup').post(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.registerRules), _AuthController2.default.signup);
authRouter.route('/login').post(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.loginRules), _AuthController2.default.login);
authRouter.route('/reset').post(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.resetPasswordRules), _AuthController2.default.requestResetPassword);
authRouter.route('/reset').patch(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.changePasswordRules), _AuthController2.default.resetPassword);

exports.default = authRouter;