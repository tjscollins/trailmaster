/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import mapboxgl from 'mapboxgl';

/*----------Components----------*/
import {UpdatePOIorRoute} from 'UpdatePOIorRoute';

describe('UpdatePOIorRoute', () => {
  // let stubMap = sinon.stub(mapboxgl, 'Map');
  // stubMap.returns({
  //   on: function(event, callback) {
  //     console.log(event, callback);
  //   },
  //   addSource: function(name, source) {
  //     console.log(name, source);
  //   },
  //   addLayer: function(layer) {
  //     console.log(layer);
  //   },
  // });

  it('should exist', () => {
    expect(UpdatePOIorRoute).toExist();
  });

  it('should render without errors', (done) => {
    try {
      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let props = {searchText, geoJSON};
      TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
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
  it('should create a table row for each feature in the geoJSON prop', () => {
    let searchText = {updateSearchText: ''};
    let geoJSON = {features: []};
    let props = {searchText, geoJSON};
    let update = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
    expect(update.listData()).toEqual([]);
  });
});
