const {ObjectID} = require('mongodb');
const {poiModel} = require('./../../db/models/poi');
const {routeModel} = require('./../../db/models/route');
const {trailModel} = require('./../../db/models/trail');
const {userModel} = require('./../../db/models/user');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: 'tjscollins@gmail.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({
          _id: userOneID,
          access: 'auth'
        }, 'abc123').toString()
      }
    ]
  }, {
    _id: userTwoID,
    email: 'ria@example.com',
    password: 'userTwoPass'
  }
];

const pois = [
  {
    '_creator': userOneID,
    '_id': new ObjectID('584dfbbfd96e98209375e82b'),
    'type': 'Feature',
    '__v': 0,
    'geometry': {
      'type': 'Point',
      'coordinates': [-214.2152855, 15.167236099999998]
    },
    'properties': {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      'name': 'Kagman High',
      'desc': 'test',
      'condition': 'test',
      'last': 'Dec 2016',
      'displayed': false
    }
  }, {
    '_creator': userTwoID,
    _id: new ObjectID('585df765d96e98209375e82a'),
    type: 'Feature',
    properties: {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      name: 'Rabbit Hole',
      desc: 'Hole descends from top of cliff to bottom, forming climbable cave',
      condition: 'Rope in good condition',
      last: 'June 2014',
      displayed: false,
      id: '5'
    },
    geometry: {
      type: 'Point',
      coordinates: [-214.25509314401245, 15.10071455043649]
    }
  }, {
    '_creator': userOneID,
    _id: new ObjectID('586df765d96e98209375e82a'),
    type: 'Feature',
    properties: {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      name: 'Concrete Jesus',
      desc: 'Concrete statue of Jesus at the peak of Mt. Tapotchau',
      condition: 'Rough dirt road, easy access on foot',
      last: 'June 2016',
      displayed: false,
      id: '2'
    },
    geometry: {
      type: 'Point',
      coordinates: [-214.2563098669052, 15.18629359866948]
    }
  }
];

const routes = [
  {
    _creator: userTwoID,
    _id: new ObjectID('587df765d96e98209375e82a'),
    type: 'Feature',
    properties: {
      stroke: '#555555',
      'stroke-width': 2,
      'stroke-opacity': 1,
      name: 'Chalan Kiya to Kannat Tabla Connector',
      desc: 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
      condition: 'Uncut, overgrown',
      last: 'Dec 2015',
      displayed: false,
      id: '1'
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [
          -214.27445769309995, 15.167432624111209
        ],
        [
          -214.27433967590332, 15.167339428181535
        ],
        [
          -214.27423238754272, 15.16729800775516
        ],
        [-214.27410364151, 15.167266942430045]
      ]
    }
  }
];

const trails = [
  {
    _creator: userOneID,
    '_id': new ObjectID(),
    'name': 'Kagman High to Rabbit Trail',
    'desc': 'Test',
    'date': 'Dec 2016',
    '__v': 0,
    'list': [
      {
        '_id': new ObjectID('585df765d96e98209375e82a'),
        'type': 'Feature',
        '__v': 0,
        'geometry': {
          'type': 'Point',
          'coordinates': [-214.25509214401245, 15.10071455043649]
        },
        'properties': {
          'marker-color': '#7e7e7e',
          'marker-size': 'medium',
          'marker-symbol': '',
          'name': 'Rabbit Hole',
          'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
          'condition': 'Rope in good condition',
          'last': 'June 2014',
          'displayed': true
        }
      }, {
        '_id': new ObjectID('584dfbbfd96e98209375e82b'),
        'type': 'Feature',
        '__v': 0,
        'geometry': {
          'type': 'Point',
          'coordinates': [-214.2152855, 15.167236099999998]
        },
        'properties': {
          'marker-color': '#7e7e7e',
          'marker-size': 'medium',
          'marker-symbol': '',
          'name': 'Kagman High',
          'desc': 'test',
          'condition': 'test',
          'last': 'Dec 2016',
          'displayed': true
        }
      }
    ]
  }
];

const populateServer = (done) => {
  poiModel
    .remove({})
    .then(() => {
      return poiModel.insertMany(pois);
    });
  routeModel
    .remove({})
    .then(() => {
      return routeModel.insertMany(routes);
    });
  trailModel
    .remove({})
    .then(() => {
      return trailModel.insertMany(trails);
    })
    .then(() => done());
};

const populateUsers = (done) => {
  userModel
    .remove({})
    .then(() => {
      var userOne = new userModel(users[0]).save();
      var userTwo = new userModel(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  pois,
  routes,
  trails,
  populateServer,
  users,
  populateUsers
};
