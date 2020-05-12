import Response from './Response';
import codes from './statusCodes';



/**
 * Returns current date string
 * @param {String} sep
 */
const curDate = (sep = '-') => {
  const today = new Date();
  return today.getFullYear()
        + sep + `${(today.getMonth() + 1)}`.padStart(2, 0)
        + sep + `${today.getDate()}`.padStart(2, 0);
};

/**
 * Validates a date
 * @param {String} date - Date String
 * @param {Object} res - Express Ressponse
 */
const validateDate = (date = '', res) => {
  const parts = date.split(' ')[0].split('-');
  if (parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) {
    Response.send(res, codes.badRequest, {
      error: "Date format must be 'yyyy-mm-dd'.",
    });
    return false;
  }
  return true;
};

/**
 * Converts excel date number to date
 * @param {Number} serial
 */
const excelDateConverter = (serial) => {
  if (typeof serial !== 'number' && !Number.isNaN(Date.parse(serial))) {
    return new Date(serial);
  }
  if (Number.isNaN(serial) || serial < 25569) return serial;
  const utcDays = serial - 25569;
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
};

/**
 * Returns number of unique items in a given array data.
 * @param {*} iterable - Array value
 */
const countUnique = iterable => new Set(iterable).size;

/**
 * Excapes regex
 * @param {String} text
 */
const escapeRegExp = text => `${text}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

/**
 * Creates regex
 * @param {String} text
 */
const getRegExp = text => new RegExp(escapeRegExp(text), 'i');

/**
 * Validate an email
 * @param {String} str
 */
const validateEmail = str => /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/.test(str);
const checkNumber = input => `${input}`.search(/\D/) < 0;

const validateMongoID = str => `${str}`.match(/^[0-9a-fA-F]{24}$/);
const validateFile = str => `${str}`.match(/files\/settlements\/[A-Za-z\-0-9.]*/);

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (const i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const arraysNoCaseEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (const i in a) {
    const c = typeof a[i] === 'string' ? a[i].toLowerCase() : a[i];
    const d = typeof b[i] === 'string' ? b[i].toLowerCase() : b[i];
    if (c !== d) return false;
  }
  return true;
};

const hasRole = (user = {}, role) => {
  if (!Array.isArray(user.roles) || !user.roles.includes(role)) {
    return false;
  }
  return true;
};

const hasAdminRole = user => hasRole(user, 'admin') || hasRole(user, 'super');

export {
  curDate, validateDate, excelDateConverter, getRegExp, validateEmail,
  validateMongoID,validateFile, arraysEqual, hasRole, hasAdminRole, checkNumber,
  countUnique, arraysNoCaseEqual,
};
