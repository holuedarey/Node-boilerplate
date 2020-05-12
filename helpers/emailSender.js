import request from 'request';
import Logger from './Logger';

/**
 * Sends email and SMS using Jamila's API
 * @param {Object} payload
 */
const sendEmailSms = (payload) => {
  const data = {};
  if (payload.smsRecipients) {
    data.sms = [{
      recipients: payload.smsRecipients,
      body: payload.smsBody,
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
        body: '',
      },
      attachments: payload.attachments || [],
    }];
  }
  if (!data.sms && !data.email) {
    // eslint-disable-next-line no-throw-literal
    throw { message: 'Data must contain emailRecipients or smsRecipients' };
  }

  request.post('http://basehuge.itexapp.com:3000/api/v1/notification', {
    json: data,
  }, (error, res) => {
    if (error) {
      Logger.log(error);
      return;
    }
    Logger.log(`Merchant: ${payload.smsRecipients}, ${payload.emailRecipients}, has been notified. -*- ${res.statusCode}`);
  });
};

export default sendEmailSms;
