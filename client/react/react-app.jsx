/*----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import * as actions from 'actions';

/*----------Components----------*/
import MainContainer from 'MainContainer';

/**
 * function - Initialize redux store, configure the geolocation service,
 *             and render the react application
 */
(function() {
  const initialState = {
    map: {
      accessToken: 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73' +
          '_X2M9PxDO_4KA'
    },
    geoJSON: {
      type: 'FeatureCollection',
      features: []
    },
    userSession: {
      ...JSON.parse(sessionStorage.getItem('trailmaster-login')),
      visibleFeatures: [],
      distanceFilter: 50,
      trackingRoute: false,
      routeList: [],
      mapCentering: false,
      coords: {
        latitude: 0,
        longitude: 0,
      }
    }
  };

  let store = configure(initialState);

  //Initialize User Location Monitoring
  const processGeolocation = (pos) => {
    console.log('Position found', pos);
    store.dispatch(actions.updatePOS(pos));
    store.dispatch(actions.updateMap());
    if (store.getState().userSession.trackingRoute)
      store.dispatch(actions.addToRouteList(pos));
    };

  const geolocationError = (err) => {
    console.error('Error tracking user position', err);
  };

  navigator
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
      <MainContainer />
    </Provider>, document.getElementById('app'));
})();
