var mongoose, {Schema} = require('mongoose');

var routeModel = mongoose.model('Route', new Schema({
  type: {
    type: String,
    required: true,
    match: [/^Feature$/, 'Incorrect geoJSON type ({VALUE})']
  },
  properties: {
    stroke: {
      type: String,
      required: true,
      match: [/^\#[\d\w]+$/, '{VALUE} is not a valid HTML color']
    },
    'stroke-width': {
      type: Number
    },
    'stroke-opacity': {
      type: Number
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
      match: [/LineString/, '{VALUE} is not a valid geoJSON line']
    },
    coordinates: {
      type: Array,
      required: [
        true, 'GPS coordinates required'
      ],
      validate: {
        validator: (arr) => {
          return (arr.length >= 2 && arr[0].length === 2);
        },
        message: '{VALUE} is not a valid set of GPS coordinates'
      }
    }
  }
}));

module.exports = {
  routeModel
};
