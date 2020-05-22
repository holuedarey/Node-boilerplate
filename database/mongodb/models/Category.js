/**
* Terminal Model
* Stores Terminal details
*/
import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  title: String,
  description: String,
}, {
  timestamps: true,
  strict: false,
});

const Category = mongoose.model('Category', schema);

export default Category;
