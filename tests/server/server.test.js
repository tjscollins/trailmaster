/*global describe it beforeEach*/
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isHTML = require('is-html');

const {app} = require('../../server.js');

const PoiModel = require('./../../server/db/models/poi');
const RouteModel = require('./../../server/db/models/route');
const TrailModel = require('./../../server/db/models/trail');
const UserModel = require('./../../server/db/models/user');
const {
  pois,
  routes,
  trails,
  populateServer,
  users,
  populateUsers
} = require('./seed/seed');

before((done) => {
  /**
   * Give the server enough time to webpack the server
   * rendering code before starting to run tests.
   */
  setTimeout(() => done(), 5000);
});
beforeEach(populateUsers);
beforeEach(populateServer);

describe('/', () => {
  describe('GET', () => {
    it('should respond with some rendered html', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(typeof res.text).toBe('string');
          expect(res.text.length > 0).toBe(true);
          expect(isHTML(res.text)).toBe(true);
        })
        .end(done);
    });
  });

  describe('/pois', () => {
    describe('GET', () => {
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

      it('should only return POIs within DIST of LNG and LAT', (done) => {
        request(app)
          .get('/pois?lng=110&lat=45&dist=50')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body.pois.length).toBe(0);
          })
          .end(done);
      });
    });
    describe('POST', () => {
      it('should create a new POI', (done) => {
        let poi = {
          type: 'Feature',
          properties: {
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
            PoiModel
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
        let poi = {
          type: 'Something wrong',
          properties: {
            'marker-color': '#7e7e7e',
            'marker-size': 'medium',
            'marker-symbol': '',
            'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
            'condition': 'Rope in good condition',
            'last': 'June 2014',
            'displayed': false,
            'id': '5'
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
            PoiModel
              .find()
              .then((poiList) => {
                expect(poiList.length).toBe(pois.length);
                done();
              })
              .catch((e) => done(e));
          });
      });
    });

    describe('/pois:id', () => {
      describe('PATCH', () => {
        it('should update the poi with valid data', (done) => {
          let hexId = pois[0]
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

        it('should not update the poi with invalid data', (done) => {
          let hexId = pois[0]
            ._id
            .toHexString();
          const newGeometry = Object.assign({}, pois[0].geometry, {coordinates: [100]});
          const newPOI = Object.assign({}, pois[0], {geometry: newGeometry});

          request(app)
            .patch(`/pois/${hexId}`)
            .send(newPOI)
            .expect(400)
            .end(done);
        });
      });
      describe('DELETE', () => {
        it('should remove a poi and return 200', (done) => {
          let hexId = pois[1]
            ._id
            .toHexString();

          request(app)
            .delete(`/pois/${hexId}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.nModified).toBe(1);
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              PoiModel
                .findById(hexId)
                .then((poi) => {
                  expect(poi.delete).toBe(true);
                  done();
                })
                .catch((e) => done(e));
            });
        });

        it('should return 404 if poi not found', (done) => {
          let hexId = new ObjectID().toHexString();

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
    });
  });

  describe('/routes', () => {
    describe('GET', () => {
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

      it('should only return ROUTES within DIST of LNG and LAT', (done) => {
        request(app)
          .get('/routes?lng=110&lat=45&dist=50')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body.routes.length).toBe(0);
          })
          .end(done);
      });
    });
    describe('POST', () => {
      it('should create a new ROUTE', (done) => {
        let route = {
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
            'displayed': false
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
            RouteModel
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
        let route = {
          type: 'Something\'s wrong',
          properties: {
            'stroke': '#555555',
            'stroke-width': 2,
            'stroke-opacity': 1,
            'name': 'Chalan Kiya to Kannat Tabla Connector',
            'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the' +
                ' Chalan Kiya ravine',
            'condition': 'Uncut, overgrown',
            'last': 'Dec 2015',
            'displayed': false
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
            RouteModel
              .find()
              .then((routeList) => {
                expect(routeList.length).toBe(routes.length);
                done();
              })
              .catch((e) => done(e));
          });
      });
    });

    describe('/routes:id', () => {
      describe('PATCH', () => {
        it('should update the route', (done) => {
          let hexId = routes[0]
            ._id
            .toHexString();
          const newGeometry = Object.assign({}, routes[0].geometry, {
            coordinates: [
              [
                100, -25
              ],
              [
                100, -26
              ],
              [
                99, -26
              ],
              [99, -27]
            ]
          });
          const newRoute = Object.assign({}, routes[0], {geometry: newGeometry});

          request(app)
            .patch(`/routes/${hexId}`)
            .send(newRoute)
            .expect(200)
            .expect((res) => {
              expect(res.body.geometry.coordinates).toEqual([
                [
                  100, -25
                ],
                [
                  100, -26
                ],
                [
                  99, -26
                ],
                [99, -27]
              ]);
            })
            .end(done);
        });

        it('should not update the route with invalid data', (done) => {
          let hexId = routes[0]
            ._id
            .toHexString();
          const newGeometry = Object.assign({}, routes[0].geometry, {
            coordinates: [
              [100],
              [
                100, -26
              ],
              [
                99, -26
              ],
              [99, -27]
            ]
          });
          const newRoute = Object.assign({}, routes[0], {geometry: newGeometry});

          request(app)
            .patch(`/routes/${hexId}`)
            .send(newRoute)
            .expect(400)
            .end(done);
        });
      });
      describe('DELETE', () => {
        it('should remove a route', (done) => {
          let hexId = routes[0]
            ._id
            .toHexString();

          request(app)
            .delete(`/routes/${hexId}`)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              RouteModel
                .findById(hexId)
                .then((route) => {
                  expect(route.delete).toBe(true);
                  done();
                })
                .catch((e) => done(e));
            });
        });

        it('should return 404 if route not found', (done) => {
          let hexId = new ObjectID().toHexString();

          request(app)
            .delete(`/routes/${hexId}`)
            .expect(404)
            .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
          request(app)
            .delete('/routes/123abc')
            .expect(404)
            .end(done);
        });
      });
    });
  });

  describe('/trails', () => {
    describe('GET', () => {
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
    describe('POST', () => {
      it('should create a new Trail', (done) => {
        let trail = {
          '_creator': new ObjectID(),
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
            TrailModel
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
        let trail = {};

        request(app)
          .post('/trails')
          .set('x-auth', users[0].tokens[0].token)
          .send(trail)
          .expect(400)
          .end((err, res) => {
            if (err)
              return done(err);
            TrailModel
              .find()
              .then((trailList) => {
                expect(trailList.length).toBe(trails.length);
                done();
              })
              .catch((e) => done(e));
          });
      });
    });

    describe('/trails:id', () => {
      describe('DELETE', () => {
        it('should remove a trail', (done) => {
          let hexId = trails[0]
            ._id
            .toHexString();

          request(app)
            .delete(`/trails/${hexId}`)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              TrailModel
                .findById(hexId)
                .then((trail) => {
                  expect(trail).toNotExist();
                  done();
                })
                .catch((e) => done(e));
            });
        });

        it('should return 404 if trail not found', (done) => {
          let hexId = new ObjectID().toHexString();

          request(app)
            .delete(`/trails/${hexId}`)
            .expect(404)
            .end(done);
        });

        it('should return 404 if trail id is invalid', (done) => {
          request(app)
            .delete('/trails/123abc')
            .expect(404)
            .end(done);
        });
      });
    });
  });

  describe('/users', () => {
    describe('POST', () => {
      it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123mnb!';

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

            UserModel
              .findOne({email})
              .then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
              });
          });
      });

      it('should trim and toLowerCase all submitted email addresses', (done) => {
        let email = 'EXample@example.com  ';
        let password = '123mnb!';

        request(app)
          .post('/users')
          .send({email, password})
          .expect(200)
          .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe('example@example.com');
          })
          .end((err) => {
            if (err) {
              return done(err);
            }

            UserModel
              .findOne({email: 'example@example.com'})
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

    describe('/users/login', () => {
      describe('GET', () => {
        it('should return user if authenticated', (done) => {
          request(app)
            .get('/users/login')
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
            .get('/users/login')
            .expect(401)
            .expect((res) => {
              expect(res.body).toEqual({});
            })
            .end(done);
        });
      });
      describe('POST', () => {
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

              UserModel
                .findById(users[1]._id)
                .then((user) => {
                  expect(user.tokens[0]).toInclude({access: 'auth', token: res.headers['x-auth']});
                  done();
                })
                .catch((e) => done(e));
            });
        });

        it('should trim and toLowerCase email address before checking login', (done) => {
          request(app)
            .post('/users/login')
            .send({
              email: users[1]
                .email
                .toUpperCase() + '  ',
              password: users[1].password
            })
            .expect(200)
            .expect((res) => {
              expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              UserModel
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

              UserModel
                .findById(users[1]._id)
                .then((user) => {
                  expect(user.tokens.length).toBe(0);
                  done();
                })
                .catch((e) => done(e));
            });
        });

        it('should clear login tokens older than 24 hours', (done) => {
          UserModel
            .findById(users[0]._id)
            .then((user) => {
              expect(user.tokens.length).toBe(3);
            });
          request(app)
            .post('/users/login')
            .send({email: users[0].email, password: users[0].password})
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              UserModel
                .findById(users[0]._id)
                .then((user) => {
                  expect(user.tokens.length).toBe(1);
                  done();
                })
                .catch((e) => done(e));
            });
        });
      });
    });

    describe('/users/logout', () => {
      describe('GET', () => {
        it('should remove auth token on logout', (done) => {
          request(app)
            .get('/users/logout')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              UserModel
                .findById(users[0]._id)
                .then((user) => {
                  expect(user.tokens.length).toBe(0);
                  done();
                })
                .catch((e) => done(e));
            });
        });

        it('should return 401 for nonexistent tokens', (done) => {
          request(app)
            .get('/users/logout')
            .set('x-auth', users[0].tokens[0].token + '123')
            .expect(401)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              done();
            });
        });
      });
    });

    describe('/users/password', () => {
      describe('PATCH', () => {
        it('should update the hash of a user\'s password to match a new password', (done) => {
          let email = 'tjscollins@gmail.com';
          let newPass = 'hamsterdance2';
          request(app)
            .patch('/users/password')
            .send({email, password: newPass})
            .expect(303)
            .end((err) => {
              if (err) {
                return done(err);
              }
              UserModel
                .find({email})
                .then((user) => {
                  if (!user) {
                    return Promise.reject();
                  }
                  bcrypt
                    .compare(newPass, user[0].password)
                    .then((ans) => {
                      // console.log(ans);
                      expect(ans).toEqual(true);
                      done();
                    }, (err) => done(err));
                });
            });
        });
      });
    });

    describe('/users/reset', () => {
      describe('POST', () => {
        it('should generate a resetRequest and send an email with a password RESET link if t' +
            'here is a valid user email',
        (done) => {
          let email = 'tjscollins@gmail.com';
          request(app)
            .post('/users/reset')
            .send({email})
            .expect(200)
            .end((err) => {
              if (err) {
                return done(err);
              }
              UserModel
                .find({email})
                .then((user) => {
                  if (!user) {
                    return Promise.reject();
                  }
                  expect(user[0].resetRequests).toExist();
                  expect(user[0].resetRequests.length).toBe(1);
                  done();
                }, (err) => done(err));
            });
        });

        it('should trim and toLowerCase user email address before checking if valid', (done) => {
          let email = 'TJscollins@gmail.com  ';
          request(app)
            .post('/users/reset')
            .send({email})
            .expect(200)
            .end((err) => {
              if (err) {
                return done(err);
              }
              UserModel
                .find({email: 'tjscollins@gmail.com'})
                .then((user) => {
                  if (!user) {
                    return Promise.reject();
                  }
                  expect(user[0].resetRequests).toExist();
                  expect(user[0].resetRequests.length).toBe(1);
                  done();
                }, (err) => done(err));
            });
        });

        it('should NOT generate a resetRequest and send an email with a password RESET link ' +
            'if there is an invalid user email',
        (done) => {
          let email = 'tjmail.com';
          request(app)
            .post('/users/reset')
            .send({email})
            .expect(400)
            .end((err) => {
              done();
            });
        });
      });

      describe('/users/reset/:reqID-:email', () => {
        describe('GET ', () => {
          it('should send the reset page if there is a valid reset request for that user', (done) => {
            let route = '/users/reset/585b6cd587dd7e1b8323d8d7-test@test.test';
            request(app)
              .get(route)
              .expect(200)
              .expect((res) => {
                expect(res.headers['cache-control']).toEqual('no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-che' +
                    'ck=0');
                expect(res.headers['content-type']).toEqual('text/html; charset=UTF-8');
                expect(res.body).toExist();
              })
              .end((err, res) => {
                err
                  ? done(err)
                  : done();
              });
          });

          it('should NOT send the reset page if there is NOT a valid reset request for that user',
          (done) => {
            let route = '/users/reset/585b6cd587dd7e1b8323d8d7-ria@example.com';
            request(app)
              .get(route)
              .expect(403)
              .end((err, res) => {
                err
                  ? done(err)
                  : done();
              });
          });

          it('should NOT send the reset page if that user does NOT exist', () => {
            let route = '/users/reset/585b6cd587dd7e1b8323d8d7-joe.dirt@example.com';
            request(app)
              .get(route)
              .expect(403)
              .end((err, res) => {
                err
                  ? done(err)
                  : done();
              });
          });
        });
      });
    });
  });
});
