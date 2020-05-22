'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mwFields = {
  merchant_name: 'merchantName',
  merchant_address: 'merchantAddress',
  merchant_id: 'merchantId',
  terminal_id: 'terminalId',
  stan: 'STAN',
  transaction_date: 'transactionTime',
  mcc: 'merchantCategoryCode',
  pan: 'maskedPan',
  rrn: 'rrn',
  processing_code: 'processingCode',
  amount: 'amount',
  currency_code: 'currencyCode',
  response_msg: 'messageReason',
  authcode: 'authCode',
  response_code: 'responseCode',
  handler_used: 'handlerUsed',
  mti: 'MTI'
};

var locFields = {
  merchant_name: 'merchant_name',
  merchant_address: 'merchant_address',
  merchant_id: 'merchant_id',
  terminal_id: 'terminal_id',
  stan: 'stan',
  transaction_date: 'transaction_date',
  mcc: 'mcc',
  pan: 'pan',
  rrn: 'rrn',
  processing_code: 'processing_code',
  amount: 'amount',
  currency_code: 'currency_code',
  response_msg: 'response_msg',
  authcode: 'authcode',
  response_code: 'response_code',
  handler_used: 'handler_used',
  mti: 'mti'
};

var transMod = {
  fields: process.env.IS_MIDDLEWARE ? mwFields : locFields,

  getField: function getField(key) {
    return transMod.fields[key];
  }
};

// eslint-disable-next-line import/prefer-default-export
exports.transMod = transMod;