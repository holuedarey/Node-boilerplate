'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _utils = require('../helpers/utils');

var _Logger = require('../helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
var TransactionController = function TransactionController() {
  (0, _classCallCheck3.default)(this, TransactionController);
};

exports.default = new TransactionController();