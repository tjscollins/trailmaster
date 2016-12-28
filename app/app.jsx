/*----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import * as actions from 'actions';

/*----------Modules----------*/
import $ from 'jquery';

/*----------Components----------*/
import MainContainer from 'MainContainer';

/*----------Configure Redux Store----------*/
Promise.all([
  $.get('/routes'),
  $.get('/pois')
]).then(res => {
  initialize(res);
}).catch(err => {
  console.log('Error fetching data', err);
});

const initialize = (geoJSON) => {
  var features = geoJSON.reduce((acc, curr) => {
    var allObjects = [];
    for (var array in curr) {
      allObjects = allObjects.concat(curr[array]);
    }
    return acc.concat(allObjects);
  }, []);
  const initialState = {
    map: {
      accessToken: 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA'
    },
    geoJSON: {
      type: 'FeatureCollection',
      features
    },
    userSession: {
      ...JSON.parse(sessionStorage.getItem('trailmaster-login')),
      visibleFeatures: []
    }
  };

  var store = configure(initialState);

  //Initialize User Location Monitoring
  var processGeolocation = (pos) => {
    // console.log('Position found', pos);
    store.dispatch(actions.updatePOS(pos));
    store.dispatch(actions.updateMap());
    if (store.getState().userLocation.trackingRoute)
      store.dispatch(actions.addToRouteList(pos));
    };

  var geolocationError = (err) => {
    console.error('Error tracking user position', err);
  };

  var watchId = navigator
    .geolocation
    .watchPosition(processGeolocation,
    // Optional settings below
    geolocationError, {
      timeout: 60000,
      enableHighAccuracy: true,
      maximumAge: Infinity
    });

  ReactDOM.render(
    <Provider store={store}>
    <MainContainer/>
  </Provider>, document.getElementById('app'));
};
