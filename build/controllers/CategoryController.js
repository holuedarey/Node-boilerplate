'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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

var _CategoryServices = require('../database/services/CategoryServices');

var _CategoryServices2 = _interopRequireDefault(_CategoryServices);

var _Category = require('../database/mongodb/models/Category');

var _Category2 = _interopRequireDefault(_Category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
var CategoryController = function () {
  function CategoryController() {
    (0, _classCallCheck3.default)(this, CategoryController);
  }

  (0, _createClass3.default)(CategoryController, [{
    key: 'createCategory',


    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var _req$body, title, description, data, category, _createCategory;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _req$body = req.body, title = _req$body.title, description = _req$body.description;
                data = {
                  title: title,
                  description: description

                };
                category = new _CategoryServices2.default();
                _context.prev = 3;
                _context.next = 6;
                return category.createCategory(data);

              case 6:
                _createCategory = _context.sent;


                _Response2.default.send(res, _statusCodes2.default.success, {
                  data: _createCategory
                });
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](3);
                _Response2.default.handleError(res, _context.t0);
              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 10]]);
      }));

      function createCategory(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return createCategory;
    }()

    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'updateCategory',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var _req$body2, title, description, _id, data, category, _updateCategory;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, _id = _req$body2.id;
                data = {
                  title: title,
                  description: description

                };

                if ((0, _utils.validateMongoID)(_id)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Record not found.'
                }));

              case 4:
                _context2.prev = 4;
                _context2.next = 7;
                return _Category2.default.findOne({ _id: _id });

              case 7:
                category = _context2.sent;

                if (category) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt('return', _Response2.default.send(res, _statusCodes2.default.badRequest, {
                  error: 'Record not found.'
                }));

              case 10:
                _updateCategory = category(data);

                _updateCategory.save();
                _Response2.default.send(res, _statusCodes2.default.success, {
                  data: _updateCategory
                });
                _context2.next = 18;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](4);
                _Response2.default.handleError(res, _context2.t0);
              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 15]]);
      }));

      function updateCategory(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return updateCategory;
    }()

    /**
    * This handles getting transaction history.
    * @param {express.Request} req Express request param
    * @param {express.Response} res Express response param
    */

  }, {
    key: 'allCategory',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var _req$query, page, limit, categories, result;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _req$query = req.query, page = _req$query.page, limit = _req$query.limit;


                limit = (0, _isNan2.default)(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
                page = (0, _isNan2.default)(parseInt(page, 10)) ? 1 : parseInt(page, 10);

                _context3.prev = 3;
                categories = new _CategoryServices2.default();
                _context3.next = 7;
                return categories.allCategory(page, limit);

              case 7:
                result = _context3.sent;


                _Response2.default.send(res, _statusCodes2.default.success, {
                  data: result
                });
                _context3.next = 14;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3['catch'](3);
                _Response2.default.handleError(res, _context3.t0);
              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 11]]);
      }));

      function allCategory(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return allCategory;
    }()
  }]);
  return CategoryController;
}();

exports.default = new CategoryController();