/**
* Terminal Model
* Stores Terminal details
*/
import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  _service_id: Schema.ObjectId,
  _user_id: Schema.ObjectId,
  rating:Number,
  comments: String,
}, {
  timestamps: true,
  strict: false,
});

const Rating = mongoose.model('Rating', schema);

export default Rating;
