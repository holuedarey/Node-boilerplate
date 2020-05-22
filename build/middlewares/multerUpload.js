'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = function multerUpload(field) {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request, response, next) {
      var basePath, storage, fileFilter, upload;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              basePath = 'files/category';
              storage = _multer2.default.diskStorage({
                destination: function destination(req, file, cb) {
                  cb(null, basePath);
                },
                filename: function filename(req, file, cb) {
                  cb(null, new Date().getTime().file.originalname);
                }
              });

              fileFilter = function fileFilter(req, file, cb) {
                var filetypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
                var mimetype = filetypes.includes(file.mimetype);
                if (mimetype) return cb(null, true);
                req.body[file.fieldname] = 'invalid';
                return cb(null, false);
              };

              upload = (0, _multer2.default)({ storage: storage }).single(field);

              upload(request, response, function (err) {
                if (err) {
                  request.body[field] = 'invalid';
                } else {
                  var filePath = request.file && request.file.filename ? basePath + '/' + request.file.filename : 'invalid';
                  request.body[field] = filePath;
                }
                return next();
              });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = multerUpload;