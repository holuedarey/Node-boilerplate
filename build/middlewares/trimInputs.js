'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Trims input in req.body
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
var trimInputs = function trimInputs(req, res, next) {
  for (var index in req.body) {
    req.body[index] = typeof req.body[index] === 'string' ? req.body[index].trim() : req.body[index];
  }
  next();
};

exports.default = trimInputs;