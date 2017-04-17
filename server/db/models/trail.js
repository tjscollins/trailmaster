const mongoose = require('mongoose');

const TrailModel = mongoose.model('Trail', new mongoose.Schema({
  bounds: {
    latitude: {
      type: Number,
      validate: {
        validator: (lat) => {
          return lat < 90 && lat > -90;
        },
        message: '{VALUE} is not a valid latitude',
      }
    },
    longitude: {
      type: Number,
      validate: {
        validator: (lng) => {
          return lng < 180 && lng > -180;
        },
        message: '{VALUE} is not a valid longitude',
      }
    },
    latitudeDelta: {
      type: Number,
    },
    longitudeDelta: {
      type: Number,
    },
  },
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
    trim: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
}));

module.exports = TrailModel;
