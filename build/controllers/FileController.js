'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* File Controller
*/
var FileController = function () {
  function FileController() {
    (0, _classCallCheck3.default)(this, FileController);
  }

  (0, _createClass3.default)(FileController, [{
    key: 'download',

    /**
    * This handles returning uploaded files.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */
    value: function download(req, res) {
      var filePath = 'files' + req.path.split('/files')[1];

      if (_fs2.default.existsSync(filePath)) return res.sendFile(_path2.default.resolve(filePath));

      return _Response2.default.send(res, _statusCodes2.default.notFound, {
        error: 'File not found'
      });
    }
  }]);
  return FileController;
}(); // eslint-disable-next-line no-unused-vars


exports.default = new FileController();