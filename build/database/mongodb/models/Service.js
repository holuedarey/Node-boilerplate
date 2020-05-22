'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema; /**
                                        * Terminal Model
                                        * Stores Terminal details
                                        */

var schema = new Schema({
  address: String,
  service_date: Date,
  service_time: String,
  title: String,
  description: String,
  services: String,
  category: String,
  user_id: String,
  firstname: String,
  lastname: String

}, {
  timestamps: true,
  strict: false
});

var Booking = _mongoose2.default.model('Booking', schema);

exports.default = Booking;