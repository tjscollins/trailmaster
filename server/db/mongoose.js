var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TrailMaster');
mongoose.connect('mongodb://heroku_g6w3h74t:vmbrf4mj23ocpikbgun6id2j3k@ds127998.mlab.com:27998/heroku_g6w3h74t');

module.exports = {
  mongoose
};
