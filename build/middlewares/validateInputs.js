'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _mongoose = require('../database/mongodb/mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validates Request with given rules
 * @param {Array} ruleItems
 */
/* eslint-disable func-names */
/* eslint-disable no-throw-literal */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

var validateInputs = function validateInputs(ruleItems) {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
      var body, errors, conflict, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, rules, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, rule, isValid, bodyParam, check, values, _values, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, eItem;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              body = req.body;
              errors = {};
              conflict = false;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 6;
              _iterator = (0, _getIterator3.default)(ruleItems);

            case 8:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 125;
                break;
              }

              item = _step.value;
              rules = (item.rules || '').split('|');
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 14;
              _iterator2 = (0, _getIterator3.default)(rules);

            case 16:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 108;
                break;
              }

              rule = _step2.value;

              if (!errors[item.field]) {
                _context.next = 20;
                break;
              }

              return _context.abrupt('continue', 105);

            case 20:
              isValid = true;
              bodyParam = body[item.field] ? body[item.field] : '';

              if (typeof bodyParam === 'string') bodyParam = bodyParam.trim();

              if (!(rule === 'required')) {
                _context.next = 27;
                break;
              }

              isValid = !!bodyParam;
              _context.next = 104;
              break;

            case 27:
              if (!(rule === 'unique' && bodyParam)) {
                _context.next = 37;
                break;
              }

              if (item.unique) {
                _context.next = 30;
                break;
              }

              throw item.field + ' rules must include \'unique\' fields specifying the unique model.';

            case 30:
              check = {};
              check[item.field] = bodyParam;
              _context.next = 34;
              return _mongoose.mongoose.model(item.unique).findOne(check);

            case 34:
              isValid = !_context.sent;
              _context.next = 104;
              break;

            case 37:
              if (!(rule === 'email' && bodyParam)) {
                _context.next = 41;
                break;
              }

              isValid = /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/.test(bodyParam);
              _context.next = 104;
              break;

            case 41:
              if (!(rule === 'number' && bodyParam)) {
                _context.next = 45;
                break;
              }

              isValid = ('' + bodyParam).search(/\D/) < 0;
              _context.next = 104;
              break;

            case 45:
              if (!(rule === 'image' && bodyParam)) {
                _context.next = 49;
                break;
              }

              isValid = !!bodyParam && bodyParam !== 'invalid';
              _context.next = 104;
              break;

            case 49:
              if (!(rule === 'minlen' && bodyParam)) {
                _context.next = 55;
                break;
              }

              if ((0, _isInteger2.default)(item.minlen)) {
                _context.next = 52;
                break;
              }

              throw item.field + ' rules must include \'minlen\' fields with integer value.';

            case 52:
              isValid = bodyParam.length >= item.minlen;
              _context.next = 104;
              break;

            case 55:
              if (!(rule === 'maxlen' && bodyParam)) {
                _context.next = 61;
                break;
              }

              if ((0, _isInteger2.default)(item.maxlen)) {
                _context.next = 58;
                break;
              }

              throw item.field + ' rules must include \'maxlen\' fields with integer value.';

            case 58:
              isValid = bodyParam.length <= item.maxlen;
              _context.next = 104;
              break;

            case 61:
              if (!(rule === 'belongsto' && bodyParam)) {
                _context.next = 68;
                break;
              }

              if (Array.isArray(item.belongsto)) {
                _context.next = 64;
                break;
              }

              throw item.field + ' rules must include \'belongsto\' fields with array of items.';

            case 64:
              values = item.belongsto.map(function (rec) {
                return typeof rec === 'string' ? rec.toLowerCase() : rec;
              });

              isValid = values.includes(typeof bodyParam === 'string' ? bodyParam.toLowerCase() : bodyParam);
              _context.next = 104;
              break;

            case 68:
              if (!(rule === 'array' && bodyParam)) {
                _context.next = 72;
                break;
              }

              isValid = Array.isArray(bodyParam);
              _context.next = 104;
              break;

            case 72:
              if (!(rule === 'eachbelongsto' && bodyParam)) {
                _context.next = 104;
                break;
              }

              if (Array.isArray(item.eachbelongsto)) {
                _context.next = 75;
                break;
              }

              throw item.field + ' rules must include \'eachbelongsto\' fields with array of items.';

            case 75:
              if (!Array.isArray(bodyParam)) bodyParam = ('' + (bodyParam || '')).split(',').map(function (a) {
                return a.trim();
              });
              _values = item.eachbelongsto.map(function (rec) {
                return typeof rec === 'string' ? rec.toLowerCase() : rec;
              });
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context.prev = 80;
              _iterator3 = (0, _getIterator3.default)(bodyParam);

            case 82:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context.next = 90;
                break;
              }

              eItem = _step3.value;

              isValid = _values.includes(typeof eItem === 'string' ? eItem.toLowerCase() : eItem);

              if (isValid) {
                _context.next = 87;
                break;
              }

              return _context.abrupt('break', 90);

            case 87:
              _iteratorNormalCompletion3 = true;
              _context.next = 82;
              break;

            case 90:
              _context.next = 96;
              break;

            case 92:
              _context.prev = 92;
              _context.t0 = _context['catch'](80);
              _didIteratorError3 = true;
              _iteratorError3 = _context.t0;

            case 96:
              _context.prev = 96;
              _context.prev = 97;

              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }

            case 99:
              _context.prev = 99;

              if (!_didIteratorError3) {
                _context.next = 102;
                break;
              }

              throw _iteratorError3;

            case 102:
              return _context.finish(99);

            case 103:
              return _context.finish(96);

            case 104:

              if (!isValid) {
                if (rule === 'unique') conflict = true;
                // eslint-disable-next-line no-use-before-define
                errors[item.field] = getErrorMessage(rule, item);
              }

            case 105:
              _iteratorNormalCompletion2 = true;
              _context.next = 16;
              break;

            case 108:
              _context.next = 114;
              break;

            case 110:
              _context.prev = 110;
              _context.t1 = _context['catch'](14);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t1;

            case 114:
              _context.prev = 114;
              _context.prev = 115;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 117:
              _context.prev = 117;

              if (!_didIteratorError2) {
                _context.next = 120;
                break;
              }

              throw _iteratorError2;

            case 120:
              return _context.finish(117);

            case 121:
              return _context.finish(114);

            case 122:
              _iteratorNormalCompletion = true;
              _context.next = 8;
              break;

            case 125:
              _context.next = 131;
              break;

            case 127:
              _context.prev = 127;
              _context.t2 = _context['catch'](6);
              _didIteratorError = true;
              _iteratorError = _context.t2;

            case 131:
              _context.prev = 131;
              _context.prev = 132;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 134:
              _context.prev = 134;

              if (!_didIteratorError) {
                _context.next = 137;
                break;
              }

              throw _iteratorError;

            case 137:
              return _context.finish(134);

            case 138:
              return _context.finish(131);

            case 139:
              if (!(0, _keys2.default)(errors).length) {
                _context.next = 141;
                break;
              }

              return _context.abrupt('return', _Response2.default.validationError(res, errors, conflict));

            case 141:
              return _context.abrupt('return', next());

            case 142:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[6, 127, 131, 139], [14, 110, 114, 122], [80, 92, 96, 104], [97,, 99, 103], [115,, 117, 121], [132,, 134, 138]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

/**
 * Generates error message
 * @param {String} rule
 * @param {String} item
 */
var getErrorMessage = function getErrorMessage(rule, item) {
  if (item.messages && item.messages[rule]) return item.messages[rule];
  var message = '';
  var field = item.field.capitalize().replace(/_/g, ' ');
  if (rule === 'required') {
    message = field + ' is required.';
  } else if (rule === 'unique') {
    message = field + ' already exists.';
  } else if (rule === 'email') {
    message = field + ' must be a valid email address.';
  } else if (rule === 'number') {
    message = field + ' must be a number.';
  } else if (rule === 'image') {
    message = field + ' must be an image.';
  } else if (rule === 'minlen') {
    message = field + ' must have minimum length of ' + item.minlen + '.';
  } else if (rule === 'maxlen') {
    message = field + ' must have maximum length of ' + item.maxlen + '.';
  } else if (rule === 'belongsto') {
    message = field + ' must be one of \'' + item.belongsto.join(', ') + '\'.';
  } else if (rule === 'array') {
    message = field + ' must be an array.';
  } else if (rule === 'eachbelongsto') {
    message = 'each of ' + field + ' must be one of \'' + item.eachbelongsto.join(', ') + '\'.';
  }
  return message;
};

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

exports.default = validateInputs;