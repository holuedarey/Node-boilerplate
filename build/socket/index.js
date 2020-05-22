'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveSocketsCount = exports.events = exports.sendNotification = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _authentication = require('../middlewares/authentication');

var _UserSocket = require('../database/mongodb/models/UserSocket');

var _UserSocket2 = _interopRequireDefault(_UserSocket);

var _Logger = require('../helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = {
  sUpload: 'settlement-upload-message',
  sUploadErr: 'settlement-upload-error-message',
  sUploadPro: 'settlement-upload-progress-message',
  sDload: 'settlement-dload-message',
  dNotify: 'dispute-notify-message',
  dUpload: 'dispute-upload-message',
  thNotify: 'trans-history-message',
  tsNotify: 'trans-stat-message',
  tgNotify: 'trans-graph-message',
  otNotify: 'online-terminals-message'
}; /* eslint-disable no-loop-func */


var io = null;
var socketSever = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(server) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            io = (0, _socket2.default)(server);

            io.use(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket, next) {
                var token, data, user;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        token = socket.handshake.query.authorization;
                        data = (0, _authentication.getUserFromToken)(token, false);

                        if (data.status) {
                          _context.next = 4;
                          break;
                        }

                        return _context.abrupt('return', io.to(socket.id).emit('message', data.error));

                      case 4:
                        user = data.user;

                        if ((0, _utils.hasAdminRole)(user, 'admin')) socket.join('adminSocket');

                        _context.next = 8;
                        return _UserSocket2.default.updateOne({ user_id: user._id }, {
                          $set: { user_id: user._id },
                          $addToSet: { socket_ids: socket.id }
                        }, { upsert: true });

                      case 8:
                        return _context.abrupt('return', next());

                      case 9:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }());

            io.on('connection', function (socket) {
              io.emit('message', 'Connected');
              _Logger2.default.log('Socket connected:', socket.id);
            });

            io.on('disconnect', function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(socket) {
                var user;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        user = _UserSocket2.default.findOne({ socket_ids: socket.id });

                        if (user) {
                          _context2.next = 3;
                          break;
                        }

                        return _context2.abrupt('return');

                      case 3:
                        user.socket_ids = user.socket_ids.filter(function (id) {
                          return id !== socket.id;
                        });
                        _context2.next = 6;
                        return user.save();

                      case 6:
                        _Logger2.default.log('Socket disconnected:', socket.id);

                      case 7:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function socketSever(_x) {
    return _ref.apply(this, arguments);
  };
}();

// eslint-disable-next-line consistent-return
var sendNotification = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(userId, event, data) {
    var retry = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var room, filter, user, sIds;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(retry === 4)) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt('return');

          case 2:
            room = (0, _utils.validateMongoID)(userId) ? null : userId;

            if (!room) {
              _context4.next = 6;
              break;
            }

            io.sockets.in(room).emit(event, data);
            return _context4.abrupt('return');

          case 6:
            filter = { user_id: userId };
            _context4.next = 9;
            return _UserSocket2.default.findOne(filter);

          case 9:
            user = _context4.sent;

            if (!(!io || !user)) {
              _context4.next = 12;
              break;
            }

            return _context4.abrupt('return', setTimeout(function () {
              return sendNotification(userId, event, data);
            }, 1000));

          case 12:
            sIds = user.socket_ids.map(function (id) {
              return io.sockets.sockets[id] ? id : null;
            }).filter(function (item) {
              return item;
            });

            sIds = [].concat((0, _toConsumableArray3.default)(new _set2.default(sIds)));
            _context4.next = 16;
            return _UserSocket2.default.updateOne({ user_id: user.user_id }, { $set: { socket_ids: sIds } });

          case 16:
            if (sIds.length) {
              _context4.next = 18;
              break;
            }

            return _context4.abrupt('return', setTimeout(function () {
              return sendNotification(user.user_id, event, data, ++retry);
            }, 1000));

          case 18:

            sIds.forEach(function (socketId) {
              io.to(socketId).emit(event, data);
            });

            if (sIds.length) _Logger2.default.log(event, sIds);

          case 20:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function sendNotification(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getActiveSocketsCount = function getActiveSocketsCount(room) {
  if (!io) return 0;

  var clientsCount = (io.sockets.adapter.rooms[room] || {}).length || 0;
  return clientsCount;
};

exports.default = socketSever;
exports.sendNotification = sendNotification;
exports.events = events;
exports.getActiveSocketsCount = getActiveSocketsCount;