/*global describe it sinon*/
'use strict';
/*----------Modules-----------*/
import expect from 'expect';
import $ from 'jquery';

/*-----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

/*----------Components----------*/
import {Header} from 'Header';
import {validateServerData, fetchData} from 'TrailmasterAPI';


describe('TrailmasterAPI methods', () => {
  describe('fetchData', () => {
    it('should fetch geoJSON data from server and return that data in a single array', (done) => {
      const pois = [
        {
          '_creator': '123',
          '_id': '584dfbbfd96e98209375e82b',
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
          '_creator': '432',
          '_id': '585df765d96e98209375e82a',
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
          '_creator': '123',
          '_id': '586df765d96e98209375e82a',
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
          _creator: '432',
          _id: '587df765d96e98209375e82a',
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
        }, {
          _creator: '123',
          _id: '587df765d96e98209375e82b',
          type: 'Feature',
          properties: {
            'stroke': '#555555',
            'stroke-width': 2,
            'stroke-opacity': 1,
            'name': 'Damaged Data',
            'desc': 'garbage',
            'condition': 'needs to be tossed out by fetchData',
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

      const [lat,
        lng,
        dist] = [0, 0, 50];
      const stubGet = sinon.stub($, 'get');
      stubGet
        .withArgs(`/pois?lat=${lat}&lng=${lng}&dist=${dist}`)
        .returns({pois});
      stubGet
        .withArgs(`/routes?lat=${lat}&lng=${lng}&dist=${dist}`)
        .returns({routes});
      fetchData(lat, lng, dist)
        .then((response) => {
          pois.push(routes[0]);
          expect(response).toEqual(pois);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('validateServerData', () => {
    it('should return false for bad data', () => {
      let badData = {
        delete: false,
        geometry: {
          coordinates: []
        }
      };
      expect(validateServerData(badData)).toBe(false);
      badData = {
        delete: true,
        geometry: {
          coordinates: [1, 2, 3, 4]
        }
      };
      expect(validateServerData(badData)).toBe(false);
      badData = {
        delete: false,
        geometry: {
          type: 'LineString',
          coordinates: [
            [
              1, 2
            ],
            [
              3, 4
            ],
            [4]
          ]
        }
      };
      expect(validateServerData(badData)).toBe(false);
    });

    it('should return true for all other data', () => {
      let badData = {
        delete: false,
        geometry: {
          coordinates: [1, 2, 3, 4]
        }
      };
      expect(validateServerData(badData)).toBe(true);
    });
  });
});
