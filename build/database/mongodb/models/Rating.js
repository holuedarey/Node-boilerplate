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
  _service_id: Schema.ObjectId,
  _user_id: Schema.ObjectId,
  rating: Number,
  comments: String
}, {
  timestamps: true,
  strict: false
});

var Rating = _mongoose2.default.model('Rating', schema);

exports.default = Rating;