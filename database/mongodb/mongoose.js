/**
 * Creates connection with the local mongodb
 * on "monitor" database
 */
import mongoose from 'mongoose';

const mongoConnectionUrl = `mongodb://${process.env.MDB_HOST}:${process.env.MDB_PORT}/${process.env.MDB_DB}`;

mongoose.set('useCreateIndex', true);
mongoose.connect(mongoConnectionUrl, {
  user: process.env.MDB_USER,
  pass: process.env.MDB_PASS,
  keepAlive: 1,
  connectTimeoutMS: 300000,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
});

const db = mongoose.connection;
mongoose.set('debug', true);
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));

// eslint-disable-next-line import/prefer-default-export
export { mongoose };
