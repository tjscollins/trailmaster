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

//trails actions
export const displayTrails = (trails) => {
  return {type: 'DISPLAY_TRAILS', trails};
};

export const clearTrails = () => {
  return {type: 'CLEAR_TRAILS'};
};

export const saveTrail = (list, name, desc) => {
  return {type: 'SAVE_TRAIL', list, name, desc};
};

export const showTrail = (id) => {
  return {type: 'SHOW_TRAIL', id};
};

//userLocation actions
export const watchGPS = (watcher) => {
  return {type: 'WATCH_GPS', watcher};
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
