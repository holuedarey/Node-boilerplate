'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arraysNoCaseEqual = exports.countUnique = exports.checkNumber = exports.hasAdminRole = exports.hasRole = exports.arraysEqual = exports.validateFile = exports.validateMongoID = exports.validateEmail = exports.getRegExp = exports.excelDateConverter = exports.validateDate = exports.curDate = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _Response = require('./Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('./statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns current date string
 * @param {String} sep
 */
var curDate = function curDate() {
  var sep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '-';

  var today = new Date();
  return today.getFullYear() + sep + ('' + (today.getMonth() + 1)).padStart(2, 0) + sep + ('' + today.getDate()).padStart(2, 0);
};

/**
 * Validates a date
 * @param {String} date - Date String
 * @param {Object} res - Express Ressponse
 */
var validateDate = function validateDate() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var res = arguments[1];

  var parts = date.split(' ')[0].split('-');
  if (parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) {
    _Response2.default.send(res, _statusCodes2.default.badRequest, {
      error: "Date format must be 'yyyy-mm-dd'."
    });
    return false;
  }
  return true;
};

/**
 * Converts excel date number to date
 * @param {Number} serial
 */
var excelDateConverter = function excelDateConverter(serial) {
  if (typeof serial !== 'number' && !(0, _isNan2.default)(Date.parse(serial))) {
    return new Date(serial);
  }
  if ((0, _isNan2.default)(serial) || serial < 25569) return serial;
  var utcDays = serial - 25569;
  var utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
};

/**
 * Returns number of unique items in a given array data.
 * @param {*} iterable - Array value
 */
var countUnique = function countUnique(iterable) {
  return new _set2.default(iterable).size;
};

/**
 * Excapes regex
 * @param {String} text
 */
var escapeRegExp = function escapeRegExp(text) {
  return ('' + text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Creates regex
 * @param {String} text
 */
var getRegExp = function getRegExp(text) {
  return new RegExp(escapeRegExp(text), 'i');
};

/**
 * Validate an email
 * @param {String} str
 */
var validateEmail = function validateEmail(str) {
  return (/^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/.test(str)
  );
};
var checkNumber = function checkNumber(input) {
  return ('' + input).search(/\D/) < 0;
};

var validateMongoID = function validateMongoID(str) {
  return ('' + str).match(/^[0-9a-fA-F]{24}$/);
};
var validateFile = function validateFile(str) {
  return ('' + str).match(/files\/settlements\/[A-Za-z\-0-9.]*/);
};

var arraysEqual = function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

var arraysNoCaseEqual = function arraysNoCaseEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i in a) {
    var c = typeof a[i] === 'string' ? a[i].toLowerCase() : a[i];
    var d = typeof b[i] === 'string' ? b[i].toLowerCase() : b[i];
    if (c !== d) return false;
  }
  return true;
};

var hasRole = function hasRole() {
  var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var role = arguments[1];

  if (!Array.isArray(user.roles) || !user.roles.includes(role)) {
    return false;
  }
  return true;
};

var hasAdminRole = function hasAdminRole(user) {
  return hasRole(user, 'admin') || hasRole(user, 'super');
};

exports.curDate = curDate;
exports.validateDate = validateDate;
exports.excelDateConverter = excelDateConverter;
exports.getRegExp = getRegExp;
exports.validateEmail = validateEmail;
exports.validateMongoID = validateMongoID;
exports.validateFile = validateFile;
exports.arraysEqual = arraysEqual;
exports.hasRole = hasRole;
exports.hasAdminRole = hasAdminRole;
exports.checkNumber = checkNumber;
exports.countUnique = countUnique;
exports.arraysNoCaseEqual = arraysNoCaseEqual;