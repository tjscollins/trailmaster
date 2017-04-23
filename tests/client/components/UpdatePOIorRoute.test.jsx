/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import mapboxgl from 'mapboxgl';

import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import ConnectedUPR, {UpdatePOIorRoute} from 'UpdatePOIorRoute';

describe('UpdatePOIorRoute', () => {
  it('should exist', () => {
    expect(UpdatePOIorRoute).toExist();
  });

  it('should render without errors', (done) => {
    try {
      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let props = {searchText, geoJSON};
      TestUtils.renderIntoDocument(
        <Provider store={configure()}>
          <ConnectedUPR {...props} />
        </Provider>
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should update its state when data is input to the form', () => {
    let searchText = {updateSearchText: ''};
    let geoJSON = {features: []};
    let props = {searchText, geoJSON};
    let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
    let form = TestUtils.findRenderedDOMComponentWithTag(update, 'form');

    update.state = {point: {geometry: {}, properties: {}}};
    update.refs.name.value = 'name';
    update.refs.geometry.value = '[45,45]';
    update.refs.desc.value = 'desc';

    let set = sinon.stub(update, 'setState');
    TestUtils.Simulate.change(form);
    sinon.assert.calledWith(set, {
      point: {
        ...update.state.point,
        geometry: {
          ...update.state.point.geometry,
          coordinates: JSON.parse(update.refs.geometry.value),
        },
        properties: {
          ...update.state.point.properties,
          name: update.refs.name.value,
          desc: update.refs.desc.value,
          condition: update.refs.cond.value,
        },
      }
    });
  });

  it('should submit updated data to the server via ajax', () => {
    let searchText = {updateSearchText: ''};
    let geoJSON = {features: []};
    let props = {searchText, geoJSON};
    let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
    let form = TestUtils.findRenderedDOMComponentWithTag(update, 'form');

    update.state.point = {
        '_creator': '584dfbbfd96e98209375e82f',
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
      };

    update.state.map = {
      remove: sinon.spy(),
    };


    let ajaxStub = sinon.stub($, 'ajax');
    ajaxStub.returns({
      done: sinon.stub()
    });

    TestUtils.Simulate.submit(form);
    sinon.assert.calledOnce(ajaxStub);
    sinon.assert.calledOnce(update.state.map.remove);
    ajaxStub.restore();
  });

  it('should identify if geoJSON feature is a LineString', () => {
    let searchText = {updateSearchText: ''};
    let geoJSON = {features: []};
    let props = {searchText, geoJSON};
    let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);

    update.state.point = {
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [
              -214.2152855 + 360,
              15.167236099999998
            ],
            [
              -214.2152855 + 360,
              15.167236099999998
            ],
            [
              -214.2152855 + 360,
              15.167236099999998
            ]
          ]
        },
      };

      expect(update.isRoute()).toEqual({});
      update.state.point.geometry.type = 'Point';
      expect(update.isRoute()).toEqual({display: 'none'});
  });

  // Not Finished
  describe('UpdatePOIorRoute.listData', () => {
    it('should create a table row for each feature in the geoJSON prop', () => {
      let searchText = {updateSearchText: ''};
      let geoJSON = {features: [{
          '_creator': '586df765d96e98209375e82f',
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
          '_creator': '586df765d96e98209375e82f',
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
          '_creator': '586df765d96e98209375e82f',
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
        }]};
      let props = {searchText, geoJSON};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
      const rows = update.listData();
      expect(rows.every((row) => row.type === 'tr')).toBe(true);
      expect(rows.length).toBe(3);
    });

    it('should filter out items that do not match the searchText', () => {
      let searchText = {updateSearchText: 'Kagman'};
      let geoJSON = {features: [{
          '_creator': '586df765d96e98209375e82f',
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
          '_creator': '586df765d96e98209375e82f',
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
          '_creator': '586df765d96e98209375e82f',
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
        }]};
      let props = {searchText, geoJSON};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
      const rows = update.listData();
      expect(rows.every((row) => {
        return row === null || row.type === 'tr';
      })).toBe(true);
      expect(rows.length).toBe(3);
    });

    it('should return an empty array if geoJSON has no features attribute', () => {
      let searchText = {updateSearchText: ''};
      let geoJSON = {};
      let props = {searchText, geoJSON};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
      const rows = update.listData();
      expect(rows.every((row) => {
        return row === null || row.type === 'tr';
      })).toBe(true);
      expect(rows.filter((row) => row.type === 'tr').length).toBe(0);
      expect(rows.length).toBe(0);
    });
  });

  describe('UpdatePOIorRoute.markForDelete', () => {
    it('should require user to login before deleting items', () => {
      let alertStub = sinon.stub(window, 'alert');

      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let userSession = {xAuth: null};
      let props = {searchText, geoJSON, userSession};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);

      update.state.point = {
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [
                -214.2152855 + 360,
                15.167236099999998
              ],
              [
                -214.2152855 + 360,
                15.167236099999998
              ],
              [
                -214.2152855 + 360,
                15.167236099999998
              ]
            ]
          },
        };

      update.markForDelete();
      sinon.assert.calledWith(alertStub, 'You must sign-in in order to delete items');
      alertStub.restore();
    });

    it('should require user to confirm their intention to delete an item', () => {
      let confirmStub = sinon.stub(window, 'confirm').returns(true);
      let ajaxStub = sinon.stub($, 'ajax').returns({
        done: sinon.spy(),
      });

      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let userSession = {xAuth: 'null'};
      let props = {searchText, geoJSON, userSession};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);

      update.state.point = {
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [
                -214.2152855 + 360,
                15.167236099999998
              ],
              [
                -214.2152855 + 360,
                15.167236099999998
              ],
              [
                -214.2152855 + 360,
                15.167236099999998
              ]
            ]
          },
        };

      update.markForDelete();
      sinon.assert.calledWith(confirmStub, 'Are you sure you want to delete this item?');
      sinon.assert.calledOnce(ajaxStub);
      ajaxStub.restore();
      confirmStub.restore();
    });
  });

  describe('UpdatePOIorRoute.quickDelete', () => {
    it('should remove coordinates from a LineString', () => {
      const mapStub = sinon.stub(mapboxgl, 'Map');
      const mapObject = {
        on: sinon.spy(),
        remove: sinon.spy(),
        addSource: sinon.spy(),
        addLayer: sinon.spy(),
      };
      mapStub.returns(mapObject);
      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let props = {searchText, geoJSON};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);

      update.state.del = 'first';
      update.state.deleteN = '1';
      update.state.point = {
        '_creator': '586df765d96e98209375e82f',
        '_id': '585df765d96e98209375e82a',
        'type': 'Feature',
        'properties': {
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
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [-214 + 360, 15],
              [-215 + 360, 15],
              [-216 + 360, 15]
            ]
          },
        };

      let event = {preventDefault: sinon.spy()};

      update.quickDelete(event);

      sinon.assert.calledOnce(event.preventDefault);
      expect(update.state.point.geometry.coordinates.length).toBe(2);
      expect(update.state.point.geometry.coordinates[0]).toEqual([-215 + 360, 15]);

      update.state.del = 'last';
      update.quickDelete(event);
      sinon.assert.calledTwice(event.preventDefault);
      expect(update.state.point.geometry.coordinates.length).toBe(1);
      expect(update.state.point.geometry.coordinates[0]).toEqual([-215 + 360, 15]);

      mapStub.restore();
    });
  });

  describe('UpdatePOIorRoute.undoDelete', () => {
    it('should restore deleted items to the geoJSON feature', () => {
      const mapStub = sinon.stub(mapboxgl, 'Map');
      const mapObject = {
        on: sinon.spy(),
        remove: sinon.spy(),
        addSource: sinon.spy(),
        addLayer: sinon.spy(),
      };
      mapStub.returns(mapObject);
      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let props = {searchText, geoJSON};
      let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);

      update.state.point = {
        '_creator': '586df765d96e98209375e82f',
        '_id': '585df765d96e98209375e82a',
        'type': 'Feature',
        'properties': {
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
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [-215 + 360, 15],
            ]
          },
        };

      update.state.deletes = [
        {
          side: 'first',
          coords: [[-214 + 360, 15]],
        },
        {
          side: 'last',
          coords: [[-216 + 360, 15]],
        },
      ];

      let event = {preventDefault: sinon.spy()};

      update.undoDelete(event);

      sinon.assert.calledOnce(event.preventDefault);
      expect(update.state.point.geometry.coordinates.length).toBe(2);
      expect(update.state.point.geometry.coordinates[1]).toEqual([-216 + 360, 15]);

      update.undoDelete(event);
      sinon.assert.calledTwice(event.preventDefault);
      expect(update.state.point.geometry.coordinates.length).toBe(3);
      expect(update.state.point.geometry.coordinates[0]).toEqual([-214 + 360, 15]);

      mapStub.restore();
    });
  });
});
