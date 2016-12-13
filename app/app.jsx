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

var sendData = (route, data) => {
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open('POST', `/${route}`, true);
  xmlHTTP.setRequestHeader('Content-type', 'appliction/json');
  xmlHTTP.onload = () => {
    console.log(xmlHTTP.responseText);
  };
  xmlHTTP.send(JSON.stringify(data));
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
  // trails: {
  //   myTrails: JSON
  //     .parse(getData('trails'))
  //     .trails
  // }
};
var store = configure(initialState);

store.subscribe(() => {});

//Initialize User Location Monitoring
var processGeolocation = (pos) => {
  console.log('Successful location:', pos);
  store.dispatch(actions.updatePOS(pos));
  if (store.getState().userLocation.trackingRoute)
    store.dispatch(actions.addToRouteList(pos));
    // store.dispatch(actions.updateMap());
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

function getDB(err, db) {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

}
