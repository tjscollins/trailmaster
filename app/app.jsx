/*----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import * as actions from 'actions';

/*----------MongoDB----------*/
// import {MongoClient} from 'mongodb';
//
// MongoClient.connect('mongodb://localhost:27017/TrailMaster', getDB);

/*----------Components----------*/
import MainContainer from 'MainContainer';

/*----------Configure Redux Store----------*/
var store = configure();

//Initialize User Location Monitoring
var processGeolocation = (pos) => {
  console.log('Successful location:', pos);
  store.dispatch(actions.updatePOS(pos));
  if (store.getState().userLocation.trackingRoute)
    store.dispatch(actions.addToRouteList(pos));
    // store.dispatch(actions.updateMap());
  };

var geolocationError = (err) => {
  // alert('Error tracking user position: ' + err.message);
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
