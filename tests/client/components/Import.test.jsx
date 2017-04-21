/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import toGeoJSON from '@mapbox/togeojson';
import {DOMParser} from 'xmldom';

/*----------Components----------*/
import ConnectedImport, {Import} from 'Import';

describe('Import', () => {
  it('should exist', () => {
    expect(Import).toExist();
  });

  it('should render without errors', (done) => {
    try {
      const provider = <Provider store={configure()}>
        <ConnectedImport />
      </Provider>;
      TestUtils.renderIntoDocument(provider);
      done();
    } catch (err) {
      expect(err).toNotExist();
      done(err);
    }
  });

  it('should store uploaded gpx data as geoJSON in the component\'s state', () => {
    const gpx = require('../util/data.gpx');
    const importComponent = TestUtils.renderIntoDocument(<Import dispatch={() =>{}} />);
    importComponent.refs.data.value = gpx;
    importComponent.dataEntry();
    expect(importComponent.state.importedGeoJSON)
      .toEqual(toGeoJSON.gpx(new DOMParser().parseFromString(gpx)));
  });

  it('should update route meta data as entered into the form', () => {
    const gpx = require('../util/data.gpx');
    const importComponent = TestUtils.renderIntoDocument(<Import dispatch={() =>{}} />);
    importComponent.refs.data.value = gpx;
    importComponent.dataEntry();
    const initName = toGeoJSON.gpx(new DOMParser().parseFromString(gpx)).features[0].properties.name;
    expect(importComponent.state.importedGeoJSON.features[0].properties.name).toBe(initName);
    importComponent.refs.name.value = 'Test Name';
    TestUtils.Simulate.change(importComponent.refs.name);
    importComponent.refs.desc.value = 'Test Desc';
    TestUtils.Simulate.change(importComponent.refs.desc);
    importComponent.refs.cond.value = 'Test Cond';
    TestUtils.Simulate.change(importComponent.refs.cond);

    expect(importComponent.state.importedGeoJSON.features[0].properties.name).toBe('Test Name');
    expect(importComponent.state.importedGeoJSON.features[0].properties.desc).toBe('Test Desc');
    expect(importComponent.state.importedGeoJSON.features[0].properties.cond).toBe('Test Cond');
  });

  it('should send finalized route data to the server', () => {
    const gpx = require('../util/data.gpx');
    const geoJSON = toGeoJSON.gpx(new DOMParser().parseFromString(gpx));
    const done = (func) => {
      func.call(null, geoJSON);
    };
    const ajax = sinon.stub($, 'ajax').returns({done});
    const dispatch = sinon.spy();
    const importComponent = TestUtils.renderIntoDocument(<Import dispatch={dispatch} />);
    importComponent.refs.data.value = gpx;
    importComponent.dataEntry();
    importComponent.importData();
    expect(dispatch.calledTwice).toBe(true);
    expect(ajax.calledOnce).toBe(true);
  });
});
