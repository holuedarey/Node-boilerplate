'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _CrudService = require('../database/services/CrudService');

var _CrudService2 = _interopRequireDefault(_CrudService);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
var CrudController = function () {
  function CrudController() {
    (0, _classCallCheck3.default)(this, CrudController);
  }

  (0, _createClass3.default)(CrudController, [{
    key: 'ExternalBooks',


    /**
    * This handles query the Ice And Fire API to get External Books.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */
    value: function ExternalBooks(req, res) {
      var name = req.query.name;

      var CrudModel = new _CrudService2.default();

      try {
        // const data =  request.get(`${process.env.API_URL}/books/${name ? name : ''}`, (error, response, body) => {
        //   // console.log('file : ',)
        //   return body;
        // });
        return res.json(new _promise2.default(function (resolve, reject) {

          _request2.default.get(process.env.API_URL + '/books/' + (name ? name : ''), function (err, response, body) {

            if (err) reject(err);

            var loginResponse = body;
            console.log("---Token---", loginResponse);
            resolve(loginResponse);
          });
        }));

        // console.log('data : ', data)
        _Response2.default.send(res, _statusCodes2.default.success, {
          data: data
        });
      } catch (error) {
        _Response2.default.handleError(res, error);
      }
    }
  }]);
  return CrudController;
}();

exports.default = new CrudController();