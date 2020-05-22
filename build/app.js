'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

require('dotenv/config');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _admin = require('./socket/admin');

var _admin2 = _interopRequireDefault(_admin);

var _Logger = require('./helpers/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.NODE_ENV === 'test' ? 3011 : process.env.PORT || 5000;

process.env.TZ = 'Africa/Lagos';
_morgan2.default.token('date', function () {
  return new Date().toLocaleString();
});

var app = (0, _express2.default)();
var httpServer = _http2.default.createServer(app);
// const httpsServer = https.createServer(app);

app.use((0, _cors2.default)());
app.use((0, _cookieParser2.default)());
app.use((0, _morgan2.default)(':date *** :method :: :url ** :response-time'));
app.use(_bodyParser2.default.json({ limit: '50mb' }));
app.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true }));

app.use(_express2.default.static('public'));
app.use(_express2.default.static('files'));
(0, _routes2.default)(app);

(0, _socket2.default)(httpServer);
(0, _admin2.default)(httpServer);

httpServer.listen(PORT, function () {
  _Logger2.default.log('app running on http://localhost:' + PORT);
});

exports.default = app;