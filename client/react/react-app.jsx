/*----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import * as actions from 'actions';

/*----------Components----------*/
import MainContainer from 'MainContainer';

/*----------API----------*/
import {positionChanged} from 'TrailmasterAPI';
import {toFloat} from 'validator';

let store = null;
if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  const initialState = {
    map: {
      accessToken: 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73' +
          '_X2M9PxDO_4KA'
    },
    geoJSON: {
      type: 'FeatureCollection',
      // features: []
    },
    userSession: {
      ...JSON.parse(sessionStorage.getItem('trailmaster-login')),
      loading: true,
      visibleFeatures: [],
      distanceFilter: 50,
      trackingRoute: false,
      routeList: [],
      mapCentering: false,
      coords: {
        latitude: 0,
        longitude: 0
      },
      gpsTracking: {
        enable: true,
        watcher: null,
        mock: false,
        mode: 'native',
      }
    }
  };

  store = configure(initialState);

  //Initialize User Location Monitoring
  const processGeolocation = (pos) => {
    let {
      userSession: {
        coords: {
          latitude,
          longitude
        },
        gpsTracking: {
          mock,
        },
      },
    } = store.getState();
    if (positionChanged({
      latitude,
      longitude
    }, pos.coords) && !mock) {
      store.dispatch(actions.updatePOS(pos));
    }
    if (store.getState().userSession.trackingRoute)
      store.dispatch(actions.addToRouteList(pos));
    };

  const geolocationError = (err) => {
    console.error('Error tracking user position', err);
    store.dispatch(actions.stopGPS());
    $.getJSON('https://ipinfo.io', function(data) {
      const parse = /([\d\.]+)/g;
      const latitude = toFloat(parse.exec(data.loc)[0]);
      const longitude = toFloat(parse.exec(data.loc)[0]);
      const pos = {
        coords: {
          latitude,
          longitude,
        },
      };
      store.dispatch(actions.updatePOS(pos));
      const {map} = store.getState();
    });
  };

  const watcher = navigator
    .geolocation
    .watchPosition(processGeolocation,
    // Optional settings below
    geolocationError, {
      timeout: 60000,
      enableHighAccuracy: true,
      maximumAge: Infinity
    });

  store.dispatch(actions.watchGPS(watcher));
} else {
  const initialState = {
    map: {
      accessToken: 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73' +
          '_X2M9PxDO_4KA'
    },
    geoJSON: {
      type: 'FeatureCollection',
      // features: []
    },
    userSession: {
      loading: true,
      visibleFeatures: [],
      distanceFilter: 50,
      trackingRoute: false,
      routeList: [],
      mapCentering: false,
      coords: {
        latitude: 0,
        longitude: 0
      },
      gpsTracking: {
        enable: true,
        watcher: null,
        mock: false
      }
    }
  };

  store = configure(initialState);
}

const reactApp = <Provider store={store}>
  <MainContainer />
</Provider>;

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(reactApp, document.getElementById('app'));
}

export default reactApp;
