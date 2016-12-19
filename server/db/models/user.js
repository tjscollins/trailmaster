const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {ObjectID} = require('mongodb');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ],
  resetRequests: {
    type: Array,
    required: false
  }
});

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user
      ._id
      .toHexString(),
    access
  }, 'abc123');
  user
    .tokens
    .push({access, token});
  return user
    .save()
    .then(() => {
      return token;
    });
};

userSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

userSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({'_id': decoded._id, 'tokens.token': token, 'tokens.access': 'auth'});
};

userSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User
    .findOne({email})
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

userSchema.statics.resetPassword = function(email) {
  var User = this;
  return User
    .findOne({email})
    .then((user) => {
      // console.log('Tried to find', user);
      if (!user) {
        return Promise.reject();
      }
      var time = new Date().getTime();
      var reqID = new ObjectID();
      var _id = user._id;

      // console.log('Running hash algo');
      return new Promise((resolve, reject) => {
        bcrypt.hash(reqID.toHexString(), 10).then((hash) => {
          console.log('Hashed reqID', hash);
          User.update({
            email
          }, {
            $push: {
              resetRequests: {
                reqID: hash,
                time,
                _id
              }
            }
          }).then((res) => {
            console.log('Success', res);
          }, (er) => {
            console.log('Fail', er);
          });
          resolve(reqID);
        }, (err) => {
          console.log('Error hashing reqId', err);
        });
      });
    });
};

userSchema.statics.findAndResetPW = function(reqID) {
  // bcrypt.compare(reqID,)
};

userSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var userModel = mongoose.model('User', userSchema);

module.exports = {
  userModel
};
