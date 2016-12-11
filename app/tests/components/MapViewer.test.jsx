/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {MapViewer} from 'MapViewer';
import {configure} from 'configureStore';
import * as actions from 'actions';

describe('MapViewer', () => {
  it('should exist', () => {
    expect(MapViewer).toExist();
  });

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
