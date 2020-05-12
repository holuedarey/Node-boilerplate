/**
 * User Socket model
 * Mapping user IDs to socket IDs from the User
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const userSocket = new Schema({
  user_id: String,
  socket_ids: [String],
  socket_id: String,
}, {
  timestamps: true,
});

const UserSocket = mongoose.model('UserSocket', userSocket);

export default UserSocket;
