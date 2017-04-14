const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TrailMaster', options);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
  mongoose
};
