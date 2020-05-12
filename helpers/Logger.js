/**
 * @class Logger
 * Handles Logging
 */
import moment from 'moment'
class Logger {
  log(...args) {
    // eslint-disable-next-line no-console
    console.log(moment().toString(), '***', ...args);
  }
}

export default new Logger();
