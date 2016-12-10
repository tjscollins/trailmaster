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
var store = configure();

//Initialize User Location Monitoring
var processGeolocation = (pos) => {
  store.dispatch(actions.updatePOS(pos));
  store.dispatch(actions.updateMap());
};

var geolocationError = (err) => {
  console.error('Error tracking user position', err);
};

var watchId = navigator
  .geolocation
  .watchPosition(processGeolocation,
  // Optional settings below
  geolocationError, {
    timeout: 5000,
    enableHighAccuracy: true,
    maximumAge: Infinity
  });

ReactDOM.render(
  <Provider store={store}>
  <MainContainer/>
</Provider>, document.getElementById('app'));
