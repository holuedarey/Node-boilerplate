import codes from './statusCodes';
import Logger from './Logger';

/**
 * @class Response
 * Handle sending HTTP Responses
 */
class Response {
  /**
   * Sends HTTP response
   * @param {Object} res - Express Response
   * @param {Number} status - HTTP Status code
   * @param {Object} data
   */
  send(res, status, data) {
    const { token } = res;
    res.status(status).send({
      status,
      ...data,
      token,
    });
  }

  /**
   * Sends HTTP response for internal errors
   * @param {Object} res - Express Response
   * @param {*} error
   */
  handleError(res, error = {}) {
    Logger.log(error);
    return this.send(res, codes.serverError, {
      error: 'Internal server error',
    });
  }

  validationError(res, fields = {}, isConflict = false) {
    return this.send(res, isConflict ? codes.conflict : codes.badRequest, {
      error: 'Validation errors.',
      fields,
    });
  }

  abort(res, error = 'Resource not found.', code = codes.notFound) {
    return this.send(res, code, { error });
  }
}

export default new Response();
