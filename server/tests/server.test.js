/*global describe it beforeEach*/
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {poiModel} = require('./../db/models/poi');

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

beforeEach((done) => {
  poiModel
    .remove({})
    .then(() => {
      return poiModel.insertMany(pois);
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
