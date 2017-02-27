import $ from 'jquery';

export const fetchData = (lat, lng, dist) => {
  // console.log('Fetching data for: ', lat, lng, dist);
  return Promise.all([
    $.get(`/pois?lat=${lat}&lng=${lng - 360}&dist=${dist}`),
    $.get(`/routes?lat=${lat}&lng=${lng - 360}&dist=${dist}`),
  ]).then((data) => {
    // console.log('Fetched data: ', data);
    return Promise.resolve(data);
  }).catch((error) => {
    return Promise.reject(error);
  });
};

export const validateServerData = (data) => {
  let {coordinates, type,} = data.geometry;
  if (coordinates.length <= 1)
    return false;
  if (type === 'LineString' && coordinates.filter((coord) => {
    return coord.length !== 2;
  }).length > 0)
    return false;
  if (data.delete)
    return false;
  return true;
};

export const mapConfig = (coordinates, features) => {
  const userSource = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            'marker-color': 'cyan',
            'marker-size': 'large',
            'marker-symbol': 'icon-color',
            'name': 'You',
          },
          geometry: {
            type: 'Point',
            coordinates,
          },
        },
      ],
    },
  };
  const userLayer = {
    'id': 'You Are Here',
    'type': 'symbol',
    'source': 'user',
    'layout': {
      'icon-image': 'marker-15',
      'icon-size': 2,
      'text-field': '{name}',
      'text-font': [
        'Open Sans Regular', 'Arial Unicode MS Regular',
      ],
      'text-size': 10,
      'text-offset': [
        0, 1,
      ],
      'text-anchor': 'top',
      'visibility': 'visible',
    },
  };

  const geoJSONSource = {
    'type': 'geojson',
    'data': {
      type: 'FeatureCollection',
      features
    }
  };

  /**
   * geoJSONLayer - returns a config object for a mapbox layer
   *
   * @param  {STRING} source collection to pull geoJSON data from
   * @param  {STRING} id     name for the layer
   * @param  {STRING} type   type of layer (symbol or line)
   * @param  {OBJECT} layout layer layout configuration
   * @return {OBJECT}        passed to mapbox-gl.Map.addLayer
   */
  function addGeoJSONLayers(feature, map) {
    const {properties: {name}, geometry} = feature;
    let type = '';
    let layout = {};
    switch (geometry.type) {
      case 'Point':
        type = 'symbol';
        layout = {
          'icon-image': 'marker-15',
          'text-field': '{name}',
          'text-font': [
            'Open Sans Regular', 'Arial Unicode MS Regular',
          ],
          'text-size': 10,
          'text-offset': [
            0, 0.6,
          ],
          'text-anchor': 'top',
          'visibility': 'none',
        };
        break;
      case 'LineString':
        type = 'line';
        layout = {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'none',
        };
        // Create Text Label for LineString layers
        map.addLayer({
          'id': `${name} label`,
          'type': 'symbol',
          'source': 'geoJSON',
          'layout': {
            'text-field': '{name}',
            'text-font': [
              'Open Sans Regular', 'Arial Unicode MS Regular',
            ],
            'text-size': 10,
            'text-offset': [
              0, 0.6,
            ],
            'text-anchor': 'top',
            'visibility': 'none',
          },
          'filter': ['==', 'name', name]
        });
        break;
      default:
        throw new Error(`Unknown feature type ${feature.geometry.type}`);
    }
    map.addLayer({
      'id': name,
      type,
      'source': 'geoJSON',
      layout,
      'filter': [
        '==', 'name', name,
      ],
    });
  }

  return {userSource, userLayer, geoJSONSource, addGeoJSONLayers};
};


/**
 * changedProps - utility function to identify which properties have changed
 *                in the props object
 *
 * @param  {OBJECT} nextProps new props object
 * @param  {OBJECT} oldProps  old props object
 * @return {array}           list of properties that have changed values
 */
export function changedProps(nextProps, oldProps) {
  let list = [];
  for (let key in oldProps) {
    if (nextProps[key] != oldProps[key]) {
      list.push([key, nextProps[key], oldProps[key]]);
    }
  }
  return list;
}

/**
 * positionChanged - returns true of position changed by more than a certain fraction
 *                    of a degree in either direction.
 *
 * @param  {type} posOne description
 * @param  {type} posTwo description
 * @return {type}        description
 */
export function positionChanged(posOne, posTwo) {
  const SENSITIVITY = 20000;
  return (Math.floor(posOne.latitude*SENSITIVITY) !== Math.floor(posTwo.latitude*SENSITIVITY) ||
    Math.floor(posOne.latitude*SENSITIVITY) !== Math.floor(posTwo.latitude*SENSITIVITY));
}

/*istanbul ignore next*/
export const toggleUI = (delay) => {
  if ($('.hidecontrols').hasClass('fa-arrow-left')) {
    // hide UI
    $('div.controls').addClass('hide-left');
    $('.hidecontrols')
      .removeClass('fa-arrow-left')
      .addClass('fa-arrow-right');
    $('#Header')
      .addClass('minified-header')
      .css('overflow', 'hidden');
    $('.headerhidecontrols').css('display', 'inline-block');
  } else {
    //show UI
    $('div.controls').removeClass('hide-left');
    $('.hidecontrols')
      .removeClass('fa-arrow-right')
      .addClass('fa-arrow-left');
    $('#Header').removeClass('minified-header');
    setTimeout(() => {
      $('#Header').css('overflow', 'visible');
      $('.headerhidecontrols').css('display', 'none');
    }, delay);
  }
};
