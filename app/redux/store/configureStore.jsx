import * as redux from 'redux';
import thunk from 'redux-thunk';
import {geoJSONReducer, searchTextReducer, mapReducer, userLocationReducer} from 'reducers';

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({geoJSON: geoJSONReducer, searchText: searchTextReducer, map: mapReducer, userLocation: userLocationReducer});

  var store = redux.createStore(reducer, initialState, redux.compose(redux.applyMiddleware(thunk), window.devToolsExtension
    ? window.devToolsExtension()
    : f => f));

  return store;
};
