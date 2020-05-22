/* eslint-disable no-loop-func */
import socketIo from 'socket.io';
import UserSocket from '../database/mongodb/models/UserSocket';
import Logger from '../helpers/Logger';

let io = null;
const adminSocketSever = async (server) => {
  io = socketIo(server);
  io.on('connection', (socket) => {
    Logger.log('Socket connected admin:', socket.id);
    // socket.emit('customer', 'customer new');
  });

  io.on('disconnect', async (socket) => {
    const user = UserSocket.findOne({ socket_ids: socket.id });
    if (!user) return;
    user.socket_ids = user.socket_ids.filter(id => id !== socket.id);
    await user.save();
    Logger.log('Socket disconnected:', socket.id);
  });
};

const sendNotification = async (event, data, retry = 0) => {
  // io.emit('chanel', 'goat')
  io.emit(event, data);
  return;
}

export default adminSocketSever;
export {sendNotification};
