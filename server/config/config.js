var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  process.env.PORT = 3000;
  process.env.SSL_PORT = 3030;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TrailMaster';
} else {
  process.env.SSL_PORT = process.env.PORT;
}
