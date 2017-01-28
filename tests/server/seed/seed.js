const {ObjectID} = require('mongodb');
const {poiModel} = require('./../../../server/db/models/poi');
const {routeModel} = require('./../../../server/db/models/route');
const {trailModel} = require('./../../../server/db/models/trail');
const {userModel} = require('./../../../server/db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();
const hashID = bcrypt.hashSync('585b6cd587dd7e1b8323d8d7', bcrypt.genSaltSync(10));
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
  }, {
    _id: userThreeID,
    email: 'test@test.test',
    password: 'testingtest',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({
          _id: userThreeID,
          access: 'auth'
        }, 'abc123').toString()
      }
    ],
    resetRequests: [
      {
        _id: userThreeID,
        time: new Date().getTime(),
        reqID: hashID
      }
    ]
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
    '_id': new ObjectID('585df765d96e98209375e82a'),
    'type': 'Feature',
    'properties': {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      'name': 'Rabbit Hole',
      'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
      'condition': 'Rope in good condition',
      'last': 'June 2014',
      'displayed': false,
      'id': '5'
    },
    'geometry': {
      'type': 'Point',
      'coordinates': [-214.25509314401245, 15.10071455043649]
    }
  }, {
    '_creator': userOneID,
    '_id': new ObjectID('586df765d96e98209375e82a'),
    'type': 'Feature',
    'properties': {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      'name': 'Concrete Jesus',
      'desc': 'Concrete statue of Jesus at the peak of Mt. Tapotchau',
      'condition': 'Rough dirt road, easy access on foot',
      'last': 'June 2016',
      'displayed': false,
      'id': '2'
    },
    'geometry': {
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
      'stroke': '#555555',
      'stroke-width': 2,
      'stroke-opacity': 1,
      'name': 'Chalan Kiya to Kannat Tabla Connector',
      'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
      'condition': 'Uncut, overgrown',
      'last': 'Dec 2015',
      'displayed': false,
      'id': '1'
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
        [
          -214.27410364151, 15.167266942430045
        ],
        [
          -214.27393198013303, 15.167173746427308
        ],
        [
          -214.27384614944458, 15.16707019526498
        ],
        [
          -214.27374958992004, 15.1669459338032
        ],
        [
          -214.2737603187561, 15.166790606873256
        ],
        [
          -214.27362084388733, 15.166666345247119
        ],
        [
          -214.27348136901855, 15.166593859264797
        ],
        [
          -214.27334189414978, 15.166583504122432
        ],
        [
          -214.2730736732483, 15.1665627938362
        ],
        [
          -214.27295565605164, 15.166511018111713
        ],
        [
          -214.27278399467468, 15.166500662965289
        ],
        [
          -214.27260160446164, 15.16647995267094
        ],
        [
          -214.2724084854126, 15.166438532076121
        ],
        [
          -214.27226901054382, 15.16641782177568
        ],
        [
          -214.27207589149472, 15.1663764011687
        ],
        [
          -214.27189350128174, 15.166283204773304
        ],
        [
          -214.2716896533966, 15.166148587685205
        ],
        [
          -214.27155017852783, 15.166127877356354
        ],
        [
          -214.27136778831482, 15.166179653174693
        ],
        [
          -214.2711532115936, 15.166210718659611
        ],
        [
          -214.27094936370847, 15.166231428980334
        ],
        [
          -214.27080988883972, 15.166190008336828
        ],
        [
          -214.27067041397092, 15.16606574635761
        ],
        [
          -214.2705202102661, 15.16600361534061
        ],
        [-214.27037000656128, 15.165972549825248]
      ]
    }
  },
  // {
  //   _creator: userOneID,
  //   _id: new ObjectID('587df765d96e98209375e82a'),
  //   type: 'Feature',
  //   properties: {
  //     stroke: '#555555',
  //     'stroke-width': 2,
  //     'stroke-opacity': 1,
  //     name: 'Damaged Data',
  //     desc: 'garbage',
  //     condition: 'needs to be ignored by map',
  //     last: 'Dec 2015',
  //     displayed: false,
  //     id: '1'
  //   },
  //   geometry: {
  //     type: 'LineString',
  //     coordinates: []
  //   }
  // }
];

const trails = [
  {
    '_creator': userOneID,
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
      let userOne = new userModel(users[0]).save();
      let userTwo = new userModel(users[1]).save();
      let userThree = new userModel(users[2]).save();

      return Promise.all([userOne, userTwo, userThree]);
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
