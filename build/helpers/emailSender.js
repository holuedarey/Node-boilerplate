'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sends email and SMS using Jamila's API
 * @param {Object} payload
 */
var sendEmailSms = function sendEmailSms(payload) {
  var data = {};
  if (payload.smsRecipients) {
    data.sms = [{
      recipients: payload.smsRecipients,
      body: payload.smsBody
    }];
  }
  if (payload.emailRecipients) {
    data.email = [{
      sender: '',
      recipients: payload.emailRecipients,
      cc: [],
      bcc: [],
      body: payload.emailBody,
      html: payload.emailBody,
      subject: payload.emailSubject,
      details: {
        recipientsName: '',
        body: ''
      },
      attachments: payload.attachments || []
    }];
  }
  if (!data.sms && !data.email) {
    // eslint-disable-next-line no-throw-literal
    throw { message: 'Data must contain emailRecipients or smsRecipients' };
  }

  _request2.default.post('http://basehuge.itexapp.com:3000/api/v1/notification', {
    json: data
  }, function (error, res) {
    if (error) {
      _Logger2.default.log(error);
      return;
    }
    _Logger2.default.log('Merchant: ' + payload.smsRecipients + ', ' + payload.emailRecipients + ', has been notified. -*- ' + res.statusCode);
  });
};

exports.default = sendEmailSms;