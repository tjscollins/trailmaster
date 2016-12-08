export var toggleVisibility = (id) => {
  return {type: 'TOGGLE_VISIBILITY', id};
};

export var setPOISearchText = (POISearchText) => {
  return {type: 'SET_POI_SEARCH_TEXT', POISearchText};
};
