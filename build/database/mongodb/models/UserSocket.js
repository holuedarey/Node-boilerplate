'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('../mongoose');

var Schema = _mongoose.mongoose.Schema; /**
                                         * User Socket model
                                         * Mapping user IDs to socket IDs from the User
                                         */

var userSocket = new Schema({
  user_id: String,
  socket_ids: [String],
  socket_id: String
}, {
  timestamps: true
});

var UserSocket = _mongoose.mongoose.model('UserSocket', userSocket);

exports.default = UserSocket;