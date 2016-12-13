var mongoose = require('mongoose');

var trailModel = mongoose.model('Trail', new mongoose.Schema({
  list: {
    type: Array,
    required: [
      true, 'geoJSON elements required to form Trail'
    ],
    validate: {
      validator: (arr) => {
        return (arr.length >= 1 && typeof arr[0] === 'object');
      },
      message: '{VALUE} is not a valid set of geoJSON features'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}));

module.exports = {
  trailModel
};
