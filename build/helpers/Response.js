'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _statusCodes = require('./statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Response
 * Handle sending HTTP Responses
 */
var Response = function () {
  function Response() {
    (0, _classCallCheck3.default)(this, Response);
  }

  (0, _createClass3.default)(Response, [{
    key: 'send',

    /**
     * Sends HTTP response
     * @param {Object} res - Express Response
     * @param {Number} status - HTTP Status code
     * @param {Object} data
     */
    value: function send(res, status, data) {
      var token = res.token;

      res.status(status).send((0, _extends3.default)({
        status: status
      }, data, {
        token: token
      }));
    }

    /**
     * Sends HTTP response for internal errors
     * @param {Object} res - Express Response
     * @param {*} error
     */

  }, {
    key: 'handleError',
    value: function handleError(res) {
      var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _Logger2.default.log(error);
      return this.send(res, _statusCodes2.default.serverError, {
        error: 'Internal server error'
      });
    }
  }, {
    key: 'validationError',
    value: function validationError(res) {
      var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var isConflict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      return this.send(res, isConflict ? _statusCodes2.default.conflict : _statusCodes2.default.badRequest, {
        error: 'Validation errors.',
        fields: fields
      });
    }
  }, {
    key: 'abort',
    value: function abort(res) {
      var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Resource not found.';
      var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _statusCodes2.default.notFound;

      return this.send(res, code, { error: error });
    }
  }]);
  return Response;
}();

exports.default = new Response();