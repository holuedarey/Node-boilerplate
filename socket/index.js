/* eslint-disable no-loop-func */
import socketIo from 'socket.io';
import { getUserFromToken } from '../middlewares/authentication';
import UserSocket from '../database/mongodb/models/UserSocket';
import Logger from '../helpers/Logger';
import { hasAdminRole, validateMongoID } from '../helpers/utils';

const events = {
  sUpload: 'settlement-upload-message',
  sUploadErr: 'settlement-upload-error-message',
  sUploadPro: 'settlement-upload-progress-message',
  sDload: 'settlement-dload-message',
  dNotify: 'dispute-notify-message',
  dUpload: 'dispute-upload-message',
  thNotify: 'trans-history-message',
  tsNotify: 'trans-stat-message',
  tgNotify: 'trans-graph-message',
  otNotify: 'online-terminals-message',
};

let io = null;
const socketSever = async (server) => {
  io = socketIo(server);

  io.use(async (socket, next) => {
    const token = socket.handshake.query.authorization;
    const data = getUserFromToken(token, false);
    if (!data.status) return io.to(socket.id).emit('message', data.error);

    const { user } = data;
    if (hasAdminRole(user, 'admin')) socket.join('adminSocket');

    await UserSocket.updateOne({ user_id: user._id }, {
      $set: { user_id: user._id },
      $addToSet: { socket_ids: socket.id },
    }, { upsert: true });
    return next();
  });

  io.on('connection', (socket) => {
    io.emit('message', 'Connected');
    Logger.log('Socket connected:', socket.id);
  });

  io.on('disconnect', async (socket) => {
    const user = UserSocket.findOne({ socket_ids: socket.id });
    if (!user) return;
    user.socket_ids = user.socket_ids.filter(id => id !== socket.id);
    await user.save();
    Logger.log('Socket disconnected:', socket.id);
  });
};

// eslint-disable-next-line consistent-return
const sendNotification = async (userId, event, data, retry = 0) => {
  if (retry === 4) return;

  const room = validateMongoID(userId) ? null : userId;

  if (room) {
    io.sockets.in(room).emit(event, data);
    return;
  }

  const filter = { user_id: userId };
  const user = await UserSocket.findOne(filter);

  // eslint-disable-next-line consistent-return
  if (!io || !user) return setTimeout(() => sendNotification(userId, event, data), 1000);

  let sIds = user.socket_ids.map(id => (io.sockets.sockets[id] ? id : null)).filter(item => item);
  sIds = [...new Set(sIds)];
  await UserSocket.updateOne({ user_id: user.user_id }, { $set: { socket_ids: sIds } });

  // eslint-disable-next-line consistent-return
  if (!sIds.length) return setTimeout(() => sendNotification(user.user_id, event, data, ++retry), 1000);

  sIds.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });

  if (sIds.length) Logger.log(event, sIds);
};

const getActiveSocketsCount = (room) => {
  if (!io) return 0;

  const clientsCount = (io.sockets.adapter.rooms[room] || {}).length || 0;
  return clientsCount;
};



export default socketSever;
export { sendNotification, events, getActiveSocketsCount };
