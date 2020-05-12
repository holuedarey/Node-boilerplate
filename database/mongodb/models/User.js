/**
 * User model - To store user data
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  email: { type: String, trim: true },
  password: String,
  emailtoken: String,
  merchant_id: String,
  merchant_email: String,
  roles: [String],
  position: String,
  registered_by: Schema.ObjectId,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

const userRoles = {
  customer: 'customer',
  admin: 'Admin',
  super_admin: 'Super Admin',
  freelancer: 'freelancer',
  
};

const getUserPosVal = (pos) => {
  const positions = {
    customer: 1,
    freelancer: 2,
    admin: 50,
    super_admin: 100,
  };
  return pos === 'all' ? positions : positions[pos] || 0;
};

export default User;
export { getUserPosVal, userRoles };
