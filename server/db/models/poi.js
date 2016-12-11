var mongoose = require('mongoose');

var poiModel = mongoose.model('POI', new mongoose.Schema({
  type: {
    type: String,
    required: true,
    match: [/^Feature$/, 'Incorrect geoJSON type ({VALUE})']
  },
  properties: {
    'marker-color': {
      type: String
    },
    'marker-size': {
      type: String
    },
    'marker-symbol': {
      type: String
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
    condition: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      required: true
    },
    displayed: {
      type: Boolean,
      default: false
    }
  },
  geometry: {
    type: {
      type: String,
      required: true,
      match: [/^Point$/, 'Incorrect geoJSON geometry type ({VALUE})']
    },
    coordinates: {
      type: Array,
      required: [
        true, 'GPS coordinates required'
      ],
      validate: {
        validator: (arr) => {
          return (arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number');
        },
        message: '{VALUE} is not a valid GPS coordinate'
      }
    }
  }
}));

module.exports = {
  poiModel
}
