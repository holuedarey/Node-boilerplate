'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoles = exports.getUserPosVal = undefined;

var _mongoose = require('../mongoose');

var Schema = _mongoose.mongoose.Schema; /**
                                         * User model - To store user data
                                         */

var userSchema = new Schema({
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  email: { type: String, trim: true },
  password: String,
  emailtoken: String,
  merchant_id: String,
  merchant_email: String,
  roles: [String],
  position: String,
  registered_by: Schema.ObjectId
}, {
  timestamps: true
});

var User = _mongoose.mongoose.model('User', userSchema);

var userRoles = {
  customer: 'customer',
  admin: 'Admin',
  super_admin: 'Super Admin',
  freelancer: 'freelancer'

};

var getUserPosVal = function getUserPosVal(pos) {
  var positions = {
    customer: 1,
    freelancer: 2,
    admin: 50,
    super_admin: 100
  };
  return pos === 'all' ? positions : positions[pos] || 0;
};

exports.default = User;
exports.getUserPosVal = getUserPosVal;
exports.userRoles = userRoles;