import * as redux from 'redux';
import thunk from 'redux-thunk';
import {
  geoJSONReducer,
  searchTextReducer,
  mapReducer,
  // userLocationReducer,
  trailsReducer,
  userSessionReducer
} from 'reducers';

export const configure = (initialState = {}) => {
  let reducer = redux.combineReducers({
    geoJSON: geoJSONReducer,
    searchText: searchTextReducer,
    map: mapReducer,
    // userLocation: userLocationReducer,
    trails: trailsReducer,
    userSession: userSessionReducer
  });

  let store = redux.createStore(reducer, initialState, redux.compose(redux.applyMiddleware(thunk), window.devToolsExtension
    ? window.devToolsExtension()
    : (f) => f));

  return store;
};
