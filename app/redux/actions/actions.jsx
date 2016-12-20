//user session actions
export var login = (xAuth, userId, email) => {
  return {type: 'LOGIN', xAuth, userId, email};
};

export var logout = () => {
  return {type: 'LOGOUT'};
};

export var toggleVisibility = (id) => {
  return {type: 'TOGGLE_VISIBILITY', id};
};

//trails actions
export var displayTrails = (trails) => {
  return {type: 'DISPLAY_TRAILS', trails};
};

export var clearTrails = () => {
  return {type: 'CLEAR_TRAILS'};
};

export var saveTrail = (list, name, desc) => {
  return {type: 'SAVE_TRAIL', list, name, desc};
};

export var showTrail = (id) => {
  return {type: 'SHOW_TRAIL', id};
};

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
export var addPOI = (feature) => {
  return {type: 'ADD_POI', feature};
};

export var addRoute = (feature) => {
  return {type: 'ADD_ROUTE', feature};
};

export var updateGeoJSON = (point) => {
  return {type: 'UPDATE_GEO_JSON', point};
};

//map actions
export var updateMap = () => {
  return {type: 'UPDATE_MAP'};
};

export var completeUpdateMap = () => {
  return {type: 'COMPLETE_UPDATE_MAP'};
};

//searchText actions
export var setUpdateSearchText = (updateSearchText) => {
  return {type: 'UPDATE_SEARCH_TEXT', updateSearchText}
};

export var setPOISearchText = (POISearchText) => {
  return {type: 'SET_POI_SEARCH_TEXT', POISearchText};
};

export var setRoutesSearchText = (RoutesSearchText) => {
  return {type: 'SET_ROUTES_SEARCH_TEXT', RoutesSearchText};
};

export var setTrailSearchText = (trailSearchText) => {
  return {type: 'SET_TRAIL_SEARCH_TEXT', trailSearchText};
};
