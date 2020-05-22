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

var _BookingController = require('../controllers/BookingController');

var _BookingController2 = _interopRequireDefault(_BookingController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Routes of '/auth'
 */
var bookingRouter = _express2.default.Router();

bookingRouter.route('/').get(_BookingController2.default.getAll);
bookingRouter.route('/view/:id').get(_BookingController2.default.viewOne);
bookingRouter.route('/create').post(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.bookingRules), _BookingController2.default.bookAservice);
bookingRouter.route('/update').patch(_trimInputs2.default, (0, _validateInputs2.default)(_validationRules.bookingRules), _BookingController2.default.updateBooking);
bookingRouter.route('/delete/:id').delete(_BookingController2.default.updateBooking);

exports.default = bookingRouter;