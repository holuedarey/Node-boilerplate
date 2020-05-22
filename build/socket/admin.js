'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotification = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _UserSocket = require('../database/mongodb/models/UserSocket');

var _UserSocket2 = _interopRequireDefault(_UserSocket);

var _Logger = require('../helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = null; /* eslint-disable no-loop-func */

var adminSocketSever = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(server) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            io = (0, _socket2.default)(server);
            io.on('connection', function (socket) {
              _Logger2.default.log('Socket connected admin:', socket.id);
              // socket.emit('customer', 'customer new');
            });

            io.on('disconnect', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
                var user;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        user = _UserSocket2.default.findOne({ socket_ids: socket.id });

                        if (user) {
                          _context.next = 3;
                          break;
                        }

                        return _context.abrupt('return');

                      case 3:
                        user.socket_ids = user.socket_ids.filter(function (id) {
                          return id !== socket.id;
                        });
                        _context.next = 6;
                        return user.save();

                      case 6:
                        _Logger2.default.log('Socket disconnected:', socket.id);

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function adminSocketSever(_x) {
    return _ref.apply(this, arguments);
  };
}();

var sendNotification = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(event, data) {
    var retry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // io.emit('chanel', 'goat')
            io.emit(event, data);
            return _context3.abrupt('return');

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function sendNotification(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.default = adminSocketSever;
exports.sendNotification = sendNotification;