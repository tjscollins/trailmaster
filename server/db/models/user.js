var mongoose, {Schema} = require('mongoose');

var userModel = mongoose.model('User', new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: [
      3, '{VALUE} is not a valid email address'
    ],
    match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, '{VALUE} is not a valid email address']
  }
}));

module.exports = {
  userModel
};
