const {ObjectID} = require('mongodb');
const PoiModel = require('./../../../server/db/models/poi');
const RouteModel = require('./../../../server/db/models/route');
const TrailModel = require('./../../../server/db/models/trail');
const UserModel = require('./../../../server/db/models/user');
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
        }, 'abc123').toString(),
        date: Date.parse('Dec 15, 2000')
      }, {
        access: 'auth',
        token: jwt.sign({
          _id: userOneID,
          access: 'auth'
        }, 'abc123').toString(),
        date: Date.parse('Dec 15, 1999')
      }, {
        access: 'auth',
        token: jwt.sign({
          _id: userOneID,
          access: 'auth'
        }, 'abc123').toString(),
        date: Date.parse('Dec 15, 1999')
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
      'coordinates': [
        -214.2152855 + 360,
        15.167236099999998
      ]
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
      'coordinates': [
        -214.25509314401245 + 360,
        15.10071455043649
      ]
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
      coordinates: [
        -214.2563098669052 + 360,
        15.18629359866948
      ]
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
      'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the' +
          ' Chalan Kiya ravine',
      'condition': 'Uncut, overgrown',
      'last': 'Dec 2015',
      'displayed': false,
      'id': '1'
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [
          145.7255423069, 15.1674326241112
        ],
        [
          145.725660324097, 15.1673394281815
        ],
        [
          145.725767612457, 15.1672980077552
        ],
        [
          145.72589635849, 15.16726694243
        ],
        [
          145.726068019867, 15.1671737464273
        ],
        [
          145.726153850555, 15.167070195265
        ],
        [
          145.72625041008, 15.1669459338032
        ],
        [
          145.726239681244, 15.1667906068733
        ],
        [
          145.726379156113, 15.1666663452471
        ],
        [
          145.726518630981, 15.1665938592648
        ],
        [
          145.72665810585, 15.1665835041224
        ],
        [
          145.726926326752, 15.1665627938362
        ],
        [
          145.727044343948, 15.1665110181117
        ],
        [
          145.727216005325, 15.1665006629653
        ],
        [
          145.727398395538, 15.1664799526709
        ],
        [
          145.727591514587, 15.1664385320761
        ],
        [
          145.727730989456, 15.1664178217757
        ],
        [
          145.727924108505, 15.1663764011687
        ],
        [
          145.728106498718, 15.1662832047733
        ],
        [
          145.728310346603, 15.1661485876852
        ],
        [
          145.728449821472, 15.1661278773564
        ],
        [
          145.728632211685, 15.1661796531747
        ],
        [
          145.728846788406, 15.1662107186596
        ],
        [
          145.729050636292, 15.1662314289803
        ],
        [
          145.72919011116, 15.1661900083368
        ],
        [
          145.729329586029, 15.1660657463576
        ],
        [
          145.729479789734, 15.1660036153406
        ],
        [145.729629993439, 15.1659725498252]
      ]
    }
  },
{
  _creator: userOneID,
  _id: new ObjectID('587df765d96e98209375e82a'),
  type: 'Feature',
  properties: {
    'stroke': '#555555',
    'stroke-width': 2,
    'stroke-opacity': 1,
    'name': 'Damaged Data',
    'desc': 'garbage',
    'condition': 'needs to be ignored by map',
    'last': 'Dec 2015',
    'displayed': false,
    'id': '1'
  },
  geometry: {
    type: 'LineString',
    coordinates: []
  }
}
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
  }, {
    '_id': ObjectID('58917fcdeed04b1d8cafdcb5'),
    'name': 'New Trail',
    'desc': 'Test',
    'date': 'Feb 2017',
    '_creator': userOneID,
    'list': [
      {
        'properties': {
          'displayed': false,
          'last': 'Dec 2015',
          'condition': 'Uncut, overgrown',
          'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the' +
              ' Chalan Kiya ravine',
          'name': 'Chalan Kiya to Kannat Tabla Connector',
          'stroke-opacity': 1,
          'stroke-width': 2,
          'stroke': '#555555'
        },
        'geometry': {
          'coordinates': [
            [
              -214.2744576931, 15.1674326241112
            ],
            [
              -214.274339675903, 15.1673394281815
            ],
            [
              -214.274232387543, 15.1672980077552
            ],
            [
              -214.27410364151, 15.16726694243
            ],
            [
              -214.273931980133, 15.1671737464273
            ],
            [
              -214.273846149445, 15.167070195265
            ],
            [
              -214.27374958992, 15.1669459338032
            ],
            [
              -214.273760318756, 15.1667906068733
            ],
            [
              -214.273620843887, 15.1666663452471
            ],
            [
              -214.273481369019, 15.1665938592648
            ],
            [
              -214.27334189415, 15.1665835041224
            ],
            [
              -214.273073673248, 15.1665627938362
            ],
            [
              -214.272955656052, 15.1665110181117
            ],
            [
              -214.272783994675, 15.1665006629653
            ],
            [
              -214.272601604462, 15.1664799526709
            ],
            [
              -214.272408485413, 15.1664385320761
            ],
            [
              -214.272269010544, 15.1664178217757
            ],
            [
              -214.272075891495, 15.1663764011687
            ],
            [
              -214.271893501282, 15.1662832047733
            ],
            [
              -214.271689653397, 15.1661485876852
            ],
            [
              -214.271550178528, 15.1661278773564
            ],
            [
              -214.271367788315, 15.1661796531747
            ],
            [
              -214.271153211594, 15.1662107186596
            ],
            [
              -214.270949363708, 15.1662314289803
            ],
            [
              -214.27080988884, 15.1661900083368
            ],
            [
              -214.270670413971, 15.1660657463576
            ],
            [
              -214.270520210266, 15.1660036153406
            ],
            [-214.270370006561, 15.1659725498252]
          ],
          'type': 'LineString'
        },
        'type': 'Feature',
        '__v': 0,
        '_id': '587df765d96e98209375e82a'
      }, {
        'properties': {
          'displayed': false,
          'last': 'Dec 2016',
          'condition': 'test',
          'desc': 'test',
          'name': 'Kagman High',
          'marker-symbol': '',
          'marker-size': 'medium',
          'marker-color': '#7e7e7e'
        },
        'geometry': {
          'coordinates': [
            -214.2152855, 15.1672361
          ],
          'type': 'Point'
        },
        '__v': 0,
        'type': 'Feature',
        '_id': '584dfbbfd96e98209375e82b'
      }, {
        'properties': {
          'displayed': false,
          'last': 'June 2014',
          'condition': 'Rope in good condition',
          'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
          'name': 'Rabbit Hole',
          'marker-symbol': '',
          'marker-size': 'medium',
          'marker-color': '#7e7e7e'
        },
        'geometry': {
          'coordinates': [
            -214.255093144012, 15.1007145504365
          ],
          'type': 'Point'
        },
        'type': 'Feature',
        '__v': 0,
        '_id': '585df765d96e98209375e82a'
      }
    ],
    '__v': 0
  }
];

const populateServer = (done) => {
  PoiModel
    .remove({})
    .then(() => {
      return PoiModel.insertMany(pois);
    });
  RouteModel
    .remove({})
    .then(() => {
      return RouteModel.insertMany(routes);
    });
  TrailModel
    .remove({})
    .then(() => {
      return TrailModel.insertMany(trails);
    })
    .then(() => done());
};

const populateUsers = (done) => {
  UserModel
    .remove({})
    .then(() => {
      let userOne = new UserModel(users[0]).save();
      let userTwo = new UserModel(users[1]).save();
      let userThree = new UserModel(users[2]).save();

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
