'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logger = function () {
  function Logger() {
    (0, _classCallCheck3.default)(this, Logger);
  }

  (0, _createClass3.default)(Logger, [{
    key: 'log',
    value: function log() {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // eslint-disable-next-line no-console
      (_console = console).log.apply(_console, [(0, _moment2.default)().toString(), '***'].concat(args));
    }
  }]);
  return Logger;
}(); /**
      * @class Logger
      * Handles Logging
      */


exports.default = new Logger();