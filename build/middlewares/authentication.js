'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthPTSP = exports.getUserFromToken = exports.isAdmin = exports.authenticated = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _Response = require('../helpers/Response');

var _Response2 = _interopRequireDefault(_Response);

var _statusCodes = require('../helpers/statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

var _TokenUtil = require('../helpers/TokenUtil');

var _TokenUtil2 = _interopRequireDefault(_TokenUtil);

var _Logger = require('../helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Decodes token to user
 * @param {Request | String} req
 * @param {Boolean} isReq
 */
var getUserFromToken = function getUserFromToken(req) {
  var isReq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var token = isReq ? req.headers.authorization || req.cookies.authorization : req;
  token = ('' + (token || '')).split(' ')[1] || token;

  if (!token) {
    return {
      status: false,
      error: 'Authorization is required.'
    };
  }

  var user = _TokenUtil2.default.verify(token);
  if (!user) {
    return {
      status: false,
      error: 'Provided authorization is invalid or has expired.',
      token: token
    };
  }

  return { status: true, user: user };
};

/**
 * This validates users who access specified URLs using accessTokens
 * @param {*} token - Access token
 * @param {*} url - URL accessed
 */
var validateKeyAccess = function validateKeyAccess(token, url) {
  var accessTokens = ['j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d'];

  var accessUrls = ['/merchants/view/', '/merchants/view'];

  var accessUrlsRegex = [/\/merchants\/view\/[\w-]+/, /\/terminals\/setstate[/]?/, /\/terminals\/count[/]?/, /\/terminals[/]?$/, /\/terminals[/]?[?[*]+]?/, /\/merchants[/]?$/, /\/merchants[/]?[?[*]+]?/];

  var checkUrlRegex = function checkUrlRegex(uri) {
    var isValid = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(accessUrlsRegex), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var regex = _step.value;

        isValid = regex.test(uri);
        if (isValid) break;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return isValid;
  };

  var uri = url.split('v1')[1];
  var isValidToken = accessTokens.includes(token);
  var inUrl = accessUrls.includes(uri) || checkUrlRegex(uri);

  return isValidToken && inUrl;
};

/**
 * Checks if user is authenticated
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
var authenticated = function authenticated(req, res, next) {
  try {
    var theUser = getUserFromToken(req);

    if (theUser.token && validateKeyAccess(theUser.token, req.baseUrl + req.url)) {
      _Logger2.default.log('API-KEY Access by:', theUser.token);
      return next();
    }

    if (!theUser.status) {
      return _Response2.default.send(res, _statusCodes2.default.unAuthorized, {
        error: theUser.error
      });
    }

    var user = theUser.user;

    var tokenExpiresAt = user.exp;
    delete user.iat;
    delete user.exp;

    var tokenExpiresIn = tokenExpiresAt * 1000 - new Date().getTime();
    if (tokenExpiresIn < 20 * 60 * 1000) {
      var token = _TokenUtil2.default.sign(user);
      res.token = token;
    }

    req.user = user;
    return next();
  } catch (error) {
    return _Response2.default.handleError(res, error);
  }
};

/**
 * Check is user is admin
 * @param {String} role - 'role' String OR 'position' Number
 * @param {Number} gte - if 'position', true fot 'Greater Equals', false for 'Less Equals'
 */
var isAdmin = function isAdmin() {
  var role = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'admin';
  var gte = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return function (req, res, next) {
    var _req$user = req.user,
        user = _req$user === undefined ? {} : _req$user;

    var userIsAdmin = true;
    if ((0, _utils.checkNumber)(role)) {
      var position = role;
      role = 'admin';
      var userPosition = user.position || 0;
      userIsAdmin = gte ? userPosition >= position : userPosition <= position;
    }

    var isSuper = (0, _utils.hasRole)(user, 'super');
    userIsAdmin = isSuper || (0, _utils.hasRole)(req.user, role) && userIsAdmin;

    if (!userIsAdmin) {
      return _Response2.default.send(res, _statusCodes2.default.forbidden, {
        error: 'You are not permitted to access this content.'
      });
    }
    return next();
  };
};

/**
 * Checks if user is authenticated
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
var isAuthPTSP = function isAuthPTSP(req, res, next) {
  var token = req.headers.authorization || req.cookies.authorization;
  token = ('' + (token || '')).split(' ')[1] || token;

  if (!token) return _Response2.default.abort(res, 'Authorization token is required.', _statusCodes2.default.unAuthorized);

  var ptsps = ['ITEX Integrated Services', 'UPSL', 'Interswitch', 'Citiserve', 'E-Top', 'Xpress Payment', 'Global Accelerex'];
  var ptsp = _TokenUtil2.default.AESDecrypt(token);
  if (!ptsps.includes(ptsp)) return _Response2.default.abort(res, 'You are not permitted to access this.', _statusCodes2.default.forbidden);

  req.ptsp = ptsp;
  return next();
};

exports.authenticated = authenticated;
exports.isAdmin = isAdmin;
exports.getUserFromToken = getUserFromToken;
exports.isAuthPTSP = isAuthPTSP;