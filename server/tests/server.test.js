/*global describe it beforeEach*/
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {poiModel} = require('./../db/models/poi');

beforeEach((done) => {
  poiModel
    .remove({})
    .then(() => {
      done();
    });
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
          .find()
          .then((pois) => {
            expect(pois.length).toBe(1);
            expect(pois[0].type === 'Feature');
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
            expect(pois.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      });
  });
});
