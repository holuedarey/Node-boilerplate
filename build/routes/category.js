'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _trimInputs = require('../middlewares/trimInputs');

var _trimInputs2 = _interopRequireDefault(_trimInputs);

var _validateInputs = require('../middlewares/validateInputs');

var _validateInputs2 = _interopRequireDefault(_validateInputs);

var _validationRules = require('../middlewares/validationRules');

var _CategoryController = require('../controllers/CategoryController');

var _CategoryController2 = _interopRequireDefault(_CategoryController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Routes of '/auth'
 */
var categoryRouter = _express2.default.Router();

categoryRouter.route('/').get(_CategoryController2.default.allCategory);
categoryRouter.route('/create').post(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.categoryRules), _CategoryController2.default.createCategory);
categoryRouter.route('/update').patch(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.categoryRules), _CategoryController2.default.updateCategory);

exports.default = categoryRouter;