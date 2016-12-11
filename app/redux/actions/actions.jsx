//userLocation actions
export var updatePOS = (position) => {
  return {type: 'UPDATE_POS', position};
};

export var toggleMapCentering = () => {
  return {type: 'TOGGLE_MAP_CENTERING'};
};

export var trackRoute = () => {
  return {type: 'TRACK_ROUTE'};
};

export var stopTrackingRoute = () => {
  return {type: 'STOP_TRACKING_ROUTE'};
};

export var clearRouteList = () => {
  return {type: 'CLEAR_ROUTE_LIST'};
};

export var addToRouteList = (position) => {
  return {type: 'ADD_TO_ROUTE_LIST', position};
};

//geoJSON actions
export var toggleVisibility = (id) => {
  return {type: 'TOGGLE_VISIBILITY', id};
};

export var addPOI = (pos, name, desc, cond, date) => {
  return {
    type: 'ADD_POI',
    pos,
    name,
    desc,
    cond,
    date
  };
};

export var addRoute = (list, name, desc, cond, date) => {
  return {
    type: 'ADD_ROUTE',
    list,
    name,
    desc,
    cond,
    date
  };
};

//map actions
export var updateMap = () => {
  return {type: 'UPDATE_MAP'};
};

export var completeUpdateMap = () => {
  return {type: 'COMPLETE_UPDATE_MAP'};
};

//searchText actions
export var setPOISearchText = (POISearchText) => {
  return {type: 'SET_POI_SEARCH_TEXT', POISearchText};
};

export var setRoutesSearchText = (RoutesSearchText) => {
  return {type: 'SET_ROUTES_SEARCH_TEXT', RoutesSearchText};
};
