'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class TokenUtil
 * Handle JWT Token Management
 */
var TokenUtil = function () {
  function TokenUtil() {
    (0, _classCallCheck3.default)(this, TokenUtil);
  }

  (0, _createClass3.default)(TokenUtil, null, [{
    key: 'sign',

    /**
     * Sign payload and returns JWT
     * @param {Object} payload
     * @param {String} time - Expiry time
     */
    value: function sign(payload) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '10d';

      return _jsonwebtoken2.default.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
    }

    /**
     * Verifies JWT and returns Payload
     * @param {String} token - JWT
     */

  }, {
    key: 'verify',
    value: function verify(token) {
      try {
        return _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return null;
      }
    }
  }, {
    key: 'AESEncrypt',
    value: function AESEncrypt(str) {
      var byteArray = '';
      try {
        byteArray = _cryptoJs2.default.AES.encrypt(str || '', process.env.PTSP_API_SECRET_KEY);
      } catch (error) {
        _Logger2.default.log(error);
      }
      return byteArray.toString();
    }
  }, {
    key: 'AESDecrypt',
    value: function AESDecrypt(str) {
      var byteArray = '';
      try {
        byteArray = _cryptoJs2.default.AES.decrypt(str || '', process.env.PTSP_API_SECRET_KEY);
        byteArray = byteArray.toString(_cryptoJs2.default.enc.Utf8);
      } catch (error) {
        _Logger2.default.log(error);
      }
      return byteArray;
    }
  }]);
  return TokenUtil;
}();

exports.default = TokenUtil;