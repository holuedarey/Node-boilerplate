/* eslint-disable func-names */
/* eslint-disable no-throw-literal */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import Response from '../helpers/Response';
import { mongoose } from '../database/mongodb/mongoose';

/**
 * Validates Request with given rules
 * @param {Array} ruleItems
 */
const validateInputs = ruleItems => async (req, res, next) => {
  const { body } = req;
  const errors = {};
  let conflict = false;

  for (const item of ruleItems) {
    const rules = (item.rules || '').split('|');

    for (const rule of rules) {
      if (errors[item.field]) continue;
      let isValid = true;
      let bodyParam = body[item.field] ? body[item.field] : '';
      if (typeof bodyParam === 'string') bodyParam = bodyParam.trim();
      if (rule === 'required') {
        isValid = !!bodyParam;
      } else if (rule === 'unique' && bodyParam) {
        if (!item.unique) throw `${item.field} rules must include 'unique' fields specifying the unique model.`;
        const check = {}; check[item.field] = bodyParam;
        isValid = !(await mongoose.model(item.unique).findOne(check));
      } else if (rule === 'email' && bodyParam) {
        isValid = /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/.test(bodyParam);
      } else if (rule === 'number' && bodyParam) {
        isValid = `${bodyParam}`.search(/\D/) < 0;
      } else if (rule === 'image' && bodyParam) {
        isValid = !!bodyParam && bodyParam !== 'invalid';
      } else if (rule === 'minlen' && bodyParam) {
        if (!Number.isInteger(item.minlen)) throw `${item.field} rules must include 'minlen' fields with integer value.`;
        isValid = bodyParam.length >= item.minlen;
      } else if (rule === 'maxlen' && bodyParam) {
        if (!Number.isInteger(item.maxlen)) throw `${item.field} rules must include 'maxlen' fields with integer value.`;
        isValid = bodyParam.length <= item.maxlen;
      } else if (rule === 'belongsto' && bodyParam) {
        if (!Array.isArray(item.belongsto)) throw `${item.field} rules must include 'belongsto' fields with array of items.`;
        const values = item.belongsto.map(rec => (typeof rec === 'string' ? rec.toLowerCase() : rec));
        isValid = values.includes(typeof bodyParam === 'string' ? bodyParam.toLowerCase() : bodyParam);
      } else if (rule === 'array' && bodyParam) {
        isValid = Array.isArray(bodyParam);
      } else if (rule === 'eachbelongsto' && bodyParam) {
        if (!Array.isArray(item.eachbelongsto)) throw `${item.field} rules must include 'eachbelongsto' fields with array of items.`;
        if (!Array.isArray(bodyParam)) bodyParam = `${bodyParam || ''}`.split(',').map(a => a.trim());
        const values = item.eachbelongsto.map(rec => (typeof rec === 'string' ? rec.toLowerCase() : rec));
        for (const eItem of bodyParam) {
          isValid = values.includes(typeof eItem === 'string' ? eItem.toLowerCase() : eItem);
          if (!isValid) break;
        }
      }

      if (!isValid) {
        if (rule === 'unique') conflict = true;
        // eslint-disable-next-line no-use-before-define
        errors[item.field] = getErrorMessage(rule, item);
      }
    }
  }

  if (Object.keys(errors).length) return Response.validationError(res, errors, conflict);

  return next();
};

/**
 * Generates error message
 * @param {String} rule
 * @param {String} item
 */
const getErrorMessage = (rule, item) => {
  if (item.messages && item.messages[rule]) return item.messages[rule];
  let message = '';
  const field = item.field.capitalize().replace(/_/g, ' ');
  if (rule === 'required') {
    message = `${field} is required.`;
  } else if (rule === 'unique') {
    message = `${field} already exists.`;
  } else if (rule === 'email') {
    message = `${field} must be a valid email address.`;
  } else if (rule === 'number') {
    message = `${field} must be a number.`;
  } else if (rule === 'image') {
    message = `${field} must be an image.`;
  } else if (rule === 'minlen') {
    message = `${field} must have minimum length of ${item.minlen}.`;
  } else if (rule === 'maxlen') {
    message = `${field} must have maximum length of ${item.maxlen}.`;
  } else if (rule === 'belongsto') {
    message = `${field} must be one of '${item.belongsto.join(', ')}'.`;
  } else if (rule === 'array') {
    message = `${field} must be an array.`;
  } else if (rule === 'eachbelongsto') {
    message = `each of ${field} must be one of '${item.eachbelongsto.join(', ')}'.`;
  }
  return message;
};

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default validateInputs;
