import $ from 'jquery';

export const fetchData = (lat, lng, dist) => {
  // debugger;
  console.log('Fetching data for: ', lat, lng, dist);
  return Promise.all([
    $.get(`/pois?lat=${lat}&lng=${lng - 360}&dist=${dist}`),
    $.get(`/routes?lat=${lat}&lng=${lng - 360}&dist=${dist}`),
  ]).then((data) => {
    console.log('Fetched data: ', data);
    return Promise.resolve(data);
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
            'name': 'You'
          },
          geometry: {
            type: 'Point',
            coordinates
          }
        },
      ]
    }
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
      'visibility': 'visible'
    }
  };

  const geoJSONSource = {
    'type': 'geojson',
    'data': {
      type: 'FeatureCollection',
      features,
    },
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
  function geoJSONLayer(source, id, type, layout) {
    return {
      id,
      type,
      source,
      layout,
      'filter': ['==', 'name', id]
    };
  }

  return {userSource, userLayer, geoJSONSource, geoJSONLayer};
};

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
