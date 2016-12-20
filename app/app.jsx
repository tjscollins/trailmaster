/*----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import * as actions from 'actions';

/*----------Components----------*/
import MainContainer from 'MainContainer';

/*----------Configure Redux Store----------*/
var getData = (route) => {
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open('GET', `/${route}`, false);
  xmlHTTP.send(null);
  return xmlHTTP.responseText;
};

var initialState = {
  geoJSON: {
    type: 'FeatureCollection',
    features: JSON
      .parse(getData('routes'))
      .routes
      .concat(JSON.parse(getData('pois')).pois)
  },
  userSession: {
    ...JSON.parse(sessionStorage.getItem('trailmaster-login')),
    visibleFeatures: []
  }
};

var store = configure(initialState);

store.subscribe(() => {});

//Initialize User Location Monitoring
var processGeolocation = (pos) => {
  store.dispatch(actions.updatePOS(pos));
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
