/*global describe it beforeEach*/
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {poiModel} = require('./../db/models/poi');
const {routeModel} = require('./../db/models/route');

const pois = [
  {
    type: 'Feature',
    properties: {
      'marker-color': '#7e7e7e',
      'marker-size': 'medium',
      'marker-symbol': '',
      name: 'The Crack',
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

beforeEach((done) => {
  poiModel
    .remove({})
    .then(() => {
      return poiModel.insertMany(pois);
    })
  routeModel
    .remove({})
    .then(() => {
      return routeModel.insertMany(routes);
    })
    .then(() => done());
});

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
      .send(poi)
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);
        poiModel
          .find()
          .then((pois) => {
            expect(pois.length).toBe(2);
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
      .expect(200)
      .expect((res) => {
        expect(res.body.pois.length).toBe(2);
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
      .send(route)
      .expect(400)
      .end((err, res) => {
        if (err)
          return done(err);
        routeModel
          .find()
          .then((routes) => {
            expect(routes.length).toBe(1);
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
      .expect(200)
      .expect((res) => {
        expect(res.body.routes.length).toBe(1);
      })
      .end(done);
  });
});
