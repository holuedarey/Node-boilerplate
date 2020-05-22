'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mongoose = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoConnectionUrl = 'mongodb://' + process.env.MDB_HOST + ':' + process.env.MDB_PORT + '/' + process.env.MDB_DB; /**
                                                                                                                       * Creates connection with the local mongodb
                                                                                                                       * on "monitor" database
                                                                                                                       */


_mongoose2.default.set('useCreateIndex', true);
_mongoose2.default.connect(mongoConnectionUrl, {
  user: process.env.MDB_USER,
  pass: process.env.MDB_PASS,
  keepAlive: 1,
  connectTimeoutMS: 300000,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
});

var db = _mongoose2.default.connection;
_mongoose2.default.set('debug', true);
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));

// eslint-disable-next-line import/prefer-default-export
exports.mongoose = _mongoose2.default;