/*eslint-disable no-invalid-this*/
/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

/*----------Components----------*/
import CMapViewer, {MapViewer} from 'MapViewer';
import {configure} from 'configureStore';
// import * as actions from 'actions';

const state = {
  map: {
    accessToken: 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA'
  },
  userSession: {
    coords: {
      latitude: 15,
      longitude: 145,
    },
  },
};

describe('MapViewer', () => {
  it('should exist', () => {
    expect(MapViewer).toExist();
  });

  describe('Mapviewer.createMap', () => {
    it('should be called when component is mounted', sinon.test(function() {
      let createMapStub = this.stub(MapViewer.prototype, 'createMap');
      let dispatchSpy = this.stub();
      TestUtils.renderIntoDocument(
        <MapViewer
          userSession={state.userSession}
          map={state.map}
          dispatch={dispatchSpy}
        />
      );
      expect(createMapStub.called).toBe(true);
    }));

    it('should create a mapbox-gl object and store it on the component\'s state', sinon.test(function() {
      let mapboxStub = this.stub(mapboxgl, 'Map').returns({
        getCenter: () => {},
        addControl: () => {},
        on: () => {},
        addLayer: () => {},
      });
      let dispatchSpy = this.stub();
      let mapViewer = TestUtils.renderIntoDocument(
        <MapViewer
          userSession={state.userSession}
          map={state.map}
          dispatch={dispatchSpy}
        />
      );

      expect(mapboxStub.called).toBe(true);
      expect(mapViewer.state.map).toNotBe(false);
    }));
  });

  // describe('MapViewer.createMapLayers', () => {
  //   it('should be called when component is mounted', sinon.test(function() {
  //     let createMapLayersStub = this.stub(MapViewer.prototype, 'createMapLayers');
  //     let mapboxStub = this.stub(mapboxgl, 'Map').returns({
  //       getCenter: () => {},
  //       addControl: () => {},
  //       on: () => {},
  //       addLayer: () => {},
  //     });
  //     let dispatchSpy = this.stub();
  //     TestUtils.renderIntoDocument(
  //       <MapViewer
  //         userSession={state.userSession}
  //         map={state.map}
  //         dispatch={dispatchSpy}
  //       />
  //     );
  //     expect(createMapLayersStub.called).toBe(true);
  //   }));
  // });

  // it('should render a map based on store.geoJSON', (done) => {
  //   var store = configure();
  //
  //   var processGeolocation = (pos) => {
  //     // alert('Successful location');
  //     store.dispatch(actions.updatePOS(pos));
  //     // store.dispatch(actions.updateMap());
  //   };
  //
  //   var geolocationError = (err) => {
  //     console.error('Error tracking user position', err);
  //   };
  //
  //   var watchId = navigator
  //     .geolocation
  //     .watchPosition(processGeolocation,
  //     // Optional settings below
  //     geolocationError, {
  //       timeout: 60000,
  //       enableHighAccuracy: true,
  //       maximumAge: Infinity
  //     });
  //
  //   var provider = TestUtils.renderIntoDocument(
  //     <Provider store={store}>
  //       <MapViewer/>
  //     </Provider>
  //   );
  //
  //   var mapViewer = TestUtils.scryRenderedComponentsWithType(provider, MapViewer)[0];
  //   var map = TestUtils.scryRenderedComponentsWithType(mapViewer, < canvas />);
  //   expect(map.length).toBe(1);
  //   console.log(map);
  //   done();
  // });
});
