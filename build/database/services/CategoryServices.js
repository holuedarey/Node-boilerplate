"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _Category = require("../mongodb/models/Category");

var _Category2 = _interopRequireDefault(_Category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CategoryService = function () {
  function CategoryService() {
    (0, _classCallCheck3.default)(this, CategoryService);

    this.$match = {};
    this.$limit = 50;
    this.$skip = 0;
  }

  (0, _createClass3.default)(CategoryService, [{
    key: "createCategory",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
        var cat;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                cat = new _Category2.default(data);
                _context.next = 3;
                return cat.save();

              case 3:
                return _context.abrupt("return", cat);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createCategory(_x) {
        return _ref.apply(this, arguments);
      }

      return createCategory;
    }()

    /**
     * This gets all terminals for given filter
     * @param {Number} page
     * @param {Number} limit
     * @param {String} search
     * @returns {Array} terminals
     */

  }, {
    key: "allCategory",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
        var offset, filter, categories;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                offset = (page - 1) * limit;
                filter = (0, _extends3.default)({}, this.match);
                _context2.next = 4;
                return _Category2.default.aggregate([{ $match: filter }, { $skip: offset }, { $limit: limit }]);

              case 4:
                categories = _context2.sent;
                return _context2.abrupt("return", categories);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function allCategory() {
        return _ref2.apply(this, arguments);
      }

      return allCategory;
    }()
  }]);
  return CategoryService;
}();

exports.default = CategoryService;