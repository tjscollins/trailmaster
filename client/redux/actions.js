//user session actions
export const login = (xAuth, userId, email) => {
  return {type: 'LOGIN', xAuth, userId, email};
};

export const logout = () => {
  return {type: 'LOGOUT'};
};

export const toggleVisibility = (id) => {
  return {type: 'TOGGLE_VISIBILITY', id};
};

export const updateDistanceFilter = (distance) => {
  return {type: 'UPDATE_DISTANCE_FILTER', distance};
};

export const showTrail = (id) => {
  return {type: 'SHOW_TRAIL', id};
};

export const watchGPS = (watcher) => {
  return {type: 'WATCH_GPS', watcher};
};

export const stopGPS = () => {
  return {type: 'STOP_GPS'};
};

export const updatePOS = (position) => {
  return {type: 'UPDATE_POS', position};
};

export const mockPOS = (position) => {
  return {type: 'MOCK_POS', position};
};

export const unMockPos = () => {
  return {type: 'UNMOCK_POS'};
};

export const toggleMapCentering = () => {
  return {type: 'TOGGLE_MAP_CENTERING'};
};

export const trackRoute = () => {
  return {type: 'TRACK_ROUTE'};
};

export const stopTrackingRoute = () => {
  return {type: 'STOP_TRACKING_ROUTE'};
};

export const clearRouteList = () => {
  return {type: 'CLEAR_ROUTE_LIST'};
};

export const addToRouteList = (position) => {
  return {type: 'ADD_TO_ROUTE_LIST', position};
};

//trails actions
export const displayTrails = (trails) => {
  return {type: 'DISPLAY_TRAILS', trails};
};

export const clearTrails = () => {
  return {type: 'CLEAR_TRAILS'};
};

export const saveTrail = (list, name, desc, bounds) => {
  return {type: 'SAVE_TRAIL', list, name, desc, bounds};
};

export const delTrail = (name) => {
  return {
    type: 'DEL_TRAIL',
    name,
  };
};

//geoJSON actions
export const addPOI = (feature) => {
  return {type: 'ADD_POI', feature};
};

export const addRoute = (feature) => {
  return {type: 'ADD_ROUTE', feature};
};

export const updateGeoJSON = (point) => {
  return {type: 'UPDATE_GEO_JSON', point};
};

export const replaceGeoJSON = (features) => {
  return {type: 'REPLACE_GEO_JSON', features};
};

//map actions
export const mapLoaded = () => {
    return {type: 'MAP_LOADED'};
};

export const updateMap = () => {
  return {type: 'UPDATE_MAP'};
};

export const completeUpdateMap = () => {
  return {type: 'COMPLETE_UPDATE_MAP'};
};

export const storeCenter = (center) => {
  return {type: 'STORE_CENTER', center};
};

//searchText actions
export const setUpdateSearchText = (updateSearchText) => {
  return {type: 'UPDATE_SEARCH_TEXT', updateSearchText};
};

export const setPOISearchText = (POISearchText) => {
  return {type: 'SET_POI_SEARCH_TEXT', POISearchText};
};

export const setRoutesSearchText = (RoutesSearchText) => {
  return {type: 'SET_ROUTES_SEARCH_TEXT', RoutesSearchText};
};

export const setTrailSearchText = (trailSearchText) => {
  return {type: 'SET_TRAIL_SEARCH_TEXT', trailSearchText};
};
