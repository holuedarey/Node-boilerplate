/**
* Terminal Model
* Stores Terminal details
*/
import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  id: String,
  merchant_name: String,
  merchant_address: String,
  merchant_id: String,
  terminal_id: String,
  stan: String,
  transaction_date: Date,
  mcc: Number,
  pan: String,
  rrn: String,
  processing_code: String,
  amount: Number,
  currency_code: String,
  response_msg: String,
  authcode: String,
  response_code: String,
  handler_used: String,
  bin: Number,
  bank: Number,
  country_code: String,
  country_a2code: String,
  currency_symbol: String,
  mti: { type: String, default: '0200', index: true },
}, {
  timestamps: true,
  strict: false,
});

const CrudModel = mongoose.model('CrudModel', schema);

export default CrudModel;
