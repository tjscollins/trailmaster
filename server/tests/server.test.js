/*global describe it beforeEach done*/
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {poiModel} = require('./../db/models/poi');
const {routeModel} = require('./../db/models/route');
const {trailModel} = require('./../db/models/trail');
const {userModel} = require('./../db/models/user');
const {
  pois,
  routes,
  trails,
  populateServer,
  users,
  populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateServer);

describe('POST /pois', () => {
  it('should create a new POI', (done) => {
    var poi = {
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
        coordinates: [-214.25509214401245, 15.10071455043649]
      }
    };

    request(app)
      .post('/pois')
      .set('x-auth', users[0].tokens[0].token)
      .send(poi)
      .expect(200)
      .expect((res) => {
        expect(res.body.type).toEqual(poi.type);
        expect(res.body.geometry).toEqual(poi.geometry);
      })
      .end((err, res) => {
        if (err)
          return done(err);
        poiModel
          .find({
          geometry: {
            type: 'Point',
            coordinates: [-214.25509214401245, 15.10071455043649]
          }
        })
          .then((poisList) => {
            expect(poisList.length).toBe(1);
            expect(poisList[0].type === 'Feature');
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should not create a new POI with invalid data', (done) => {
    var poi = {
      type: 'Something wrong',
      properties: {
        'marker-color': '#7e7e7e',
        'marker-size': 'medium',
        'marker-symbol': '',
        desc: 'Hole descends from top of cliff to bottom, forming climbable cave',
        condition: 'Rope in good condition',
        last: 'June 2014',
        displayed: false,
        id: '5'
      },
      geometry: {
        type: 'Point'
      }
    };

    request(app)
      .post('/pois')
      .set('x-auth', users[0].tokens[0].token)
      .send(poi)
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);
        poiModel
          .find()
          .then((poiList) => {
            expect(poiList.length).toBe(pois.length);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /pois', () => {
  it('should get all POIs', (done) => {
    request(app)
      .get('/pois')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.pois.length).toBe(pois.length);
      })
      .end(done);
  });
});

describe('DELETE /pois/:id', () => {
  it('should remove a poi', (done) => {
    var hexId = pois[1]
      ._id
      .toHexString();

    request(app)
      .delete(`/pois/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        poiModel
          .findById(hexId)
          .then((poi) => {
            expect(poi).toNotExist();
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should return 404 if poi not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/pois/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/pois/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /pois/:id', () => {
  it('should update the poi', (done) => {
    var hexId = pois[0]
      ._id
      .toHexString();
    const newGeometry = Object.assign({}, pois[0].geometry, {
      coordinates: [100, -25]
    });
    const newPOI = Object.assign({}, pois[0], {geometry: newGeometry});

    request(app)
      .patch(`/pois/${hexId}`)
      .send(newPOI)
      .expect(200)
      .expect((res) => {
        expect(res.body.geometry.coordinates).toEqual([100, -25]);
      })
      .end(done);
  });
});

describe('POST /routes', () => {
  it('should create a new ROUTE', (done) => {
    var route = {
      type: 'Feature',
      properties: {
        stroke: '#555555',
        'stroke-width': 2,
        'stroke-opacity': 1,
        name: 'Chalan Kiya to Kannat Tabla Connector',
        desc: 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
        condition: 'Uncut, overgrown',
        last: 'Dec 2015',
        displayed: false
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
    };

    request(app)
      .post('/routes')
      .set('x-auth', users[0].tokens[0].token)
      .send(route)
      .expect(200)
      .expect((res) => {
        expect(res.body.type).toEqual(route.type);
        expect(res.body.geometry).toEqual(route.geometry);
        expect(res.body.properties).toEqual(route.properties);
      })
      .end((err, res) => {
        if (err)
          return done(err);
        routeModel
          .find()
          .then((routeList) => {
            expect(routeList.length).toBe(2);
            expect(routeList[0].type === 'Feature');
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should not create a new ROUTE with invalid data', (done) => {
    var route = {
      type: 'Something\'s wrong',
      properties: {
        stroke: '#555555',
        'stroke-width': 2,
        'stroke-opacity': 1,
        name: 'Chalan Kiya to Kannat Tabla Connector',
        desc: 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
        condition: 'Uncut, overgrown',
        last: 'Dec 2015',
        displayed: false
      },
      geometry: {
        type: 'Point',
        coordinates: [
          [-214.27445769309995, 15.167432624111209]
        ]
      }
    };

    request(app)
      .post('/routes')
      .set('x-auth', users[0].tokens[0].token)
      .send(route)
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);
        routeModel
          .find()
          .then((routeList) => {
            expect(routeList.length).toBe(routes.length);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /routes', () => {
  it('should get all ROUTES', (done) => {
    request(app)
      .get('/routes')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.routes.length).toBe(routes.length);
      })
      .end(done);
  });
});

describe('POST /trails', () => {
  it('should create a new Trail', (done) => {
    var trail = {
      _creator: new ObjectID(),
      'name': 'Kagman High to Rabbit Trail',
      'desc': 'Test',
      'date': 'Dec 2016',
      '__v': 0,
      'list': [
        {
          '_id': '584df765d96e98209375e82a',
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
          '_id': '584dfbbfd96e98209375e82b',
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
    };

    request(app)
      .post('/trails')
      .send(trail)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual(trail.name);
        expect(res.body.desc).toEqual(trail.desc);
        expect(res.body.list).toEqual(trail.list);
      })
      .end((err, res) => {
        if (err)
          return done(err);
        trailModel
          .find()
          .then((trailList) => {
            expect(trailList.length).toBe(trails.length + 1);
            expect(trailList.filter((item) => {
              return item.list.length > 0;
            }).length).toBe(trails.length + 1);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should not create a new Trail with invalid data', (done) => {
    var trail = {};

    request(app)
      .post('/trails')
      .set('x-auth', users[0].tokens[0].token)
      .send(trail)
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);
        trailModel
          .find()
          .then((trailList) => {
            expect(trailList.length).toBe(trails.length);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /trails', () => {

  it('should GET all Trails', (done) => {
    request(app)
      .get('/trails')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.trails.length).toBe(trails.length);
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        userModel
          .findOne({email})
          .then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'and', password: '123'})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: 'Password123!'})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        userModel
          .findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[0]).toInclude({access: 'auth', token: res.headers['x-auth']});
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        userModel
          .findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        userModel
          .findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      });
  });
});
