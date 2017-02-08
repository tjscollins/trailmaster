import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import $ from 'jquery';

export const createMap = (geoJSON, layerIDs) => {
  var filterPOI = document.getElementById('poi-searchText');
  var filterRoutes = document.getElementById('routes-searchText');
  mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
  // console.log('Generating Map...');
  var map = new mapboxgl.Map({container: 'mapviewer', style: 'mapbox://styles/mapbox/outdoors-v9', zoom: 3, hash: false, interactive: true});
  //Try loading interface
  map.addControl(new mapboxgl.GeolocateControl());
  map.addControl(new mapboxgl.NavigationControl());

  map.on('load', () => {
    //Try loading desired data....

    //Points of Interest & Labels
    var points = geoJSON.features;
    map.addSource('store', {
      'type': 'geojson',
      'data': {
        ...geoJSON,
        'features': points
      }
    });
    points.forEach((point) => {
      var layerID = point.properties.name;
      var layerType = '',
        layout = {};

      if (!map.getLayer(layerID)) {
        switch (point.geometry.type) {
          case 'Point':
            layerType = 'symbol';
            layout = {
              'icon-image': 'marker-15',
              'text-field': '{name}',
              'text-font': [
                'Open Sans Regular', 'Arial Unicode MS Regular'
              ],
              'text-size': 10,
              'text-offset': [
                0, 0.6
              ],
              'text-anchor': 'top',
              'visibility': 'none'
            };
            break;
          case 'LineString':
            layerType = 'line';
            layout = {
              'line-join': 'round',
              'line-cap': 'round',
              'visibility': 'none'
            };
            // console.log(`${layerID} label`);
            map.addLayer({
              'id': `${layerID} label`,
              'type': 'symbol',
              'source': 'store',
              'layout': {
                'text-field': '{name}',
                'text-font': [
                  'Open Sans Regular', 'Arial Unicode MS Regular'
                ],
                'text-size': 10,
                'text-offset': [
                  0, 0.6
                ],
                'text-anchor': 'top',
                'visibility': 'none'
              },
              'filter': ['==', 'name', layerID]
            });
            layerIDs.push([`${layerID} label`, 'label']);
            break;
          default:
            throw new Error(`Unknown feature type ${layerType}`);
        }
        // console.log('Creating map layer', layerID, layerType);
        map.addLayer({
          'id': layerID,
          'type': layerType,
          'source': 'store',
          'layout': layout,
          'filter': ['==', 'name', layerID]
        });

        layerIDs.push([layerID, layerType]);
      }
    });

    filterPOI.addEventListener('keyup', function(e) {
      // If the input value matches a layerID set
      // it's visibility to 'visible' or else hide it.
      var value = e
        .target
        .value
        .trim();
      layerIDs.forEach(function(layerID) {
        var re = new RegExp(value, 'i');
        if (layerID[1] === 'symbol') {
          map.setLayoutProperty(layerID[0], 'visibility', layerID[0].match(re) && value.length
            ? 'visible'
            : geoJSON.features.filter((point) => {
              return point.properties.name === layerID;
            })[0].properties.displayed
              ? 'visible'
              : 'none');
        }
      });
    });

    filterRoutes.addEventListener('keyup', function(e) {
      // If the input value matches a layerID set
      // it's visibility to 'visible' or else hide it.
      var value = e
        .target
        .value
        .trim();
      layerIDs.forEach(function(layerID) {
        var re = new RegExp(value, 'i');
        if (layerID[1] === 'line' || layerID[1] === 'label') {
          map.setLayoutProperty(layerID[0], 'visibility', layerID[0].match(re) && value.length
            ? 'visible'
            : geoJSON.features.filter((point) => {
              return point.properties.name === layerID;
            })[0].properties.displayed
              ? 'visible'
              : 'none');
        }
      });
    });
  });
  return map;
};

export const month = (mo) => {
  switch (mo) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return mo;
  }
};

export const validateServerData = (data) => {
  if (data.geometry.coordinates.length <= 1) return false;
  if (data.delete) return false;
  return true;
};

export const mapConfig = {
  user: {
    markerColor: '#120A8F',
    markerSize: 'large',
    markerSymbol: 'dot',
  },
  pois: {
  },
  routes: {

  },
  trails: {
  }
};

export const toggleUI = (delay) => {
    if ($('.hidecontrols').hasClass('fa-arrow-left')) {
      // hide UI
      $('div.controls').addClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-left').addClass('fa-arrow-right');
      $('#Header').addClass('minified-header').css('overflow', 'hidden');
      $('.headerhidecontrols').css('display', 'inline-block');
    } else {
      //show UI
      $('div.controls').removeClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-right').addClass('fa-arrow-left');
      $('#Header').removeClass('minified-header');
      setTimeout(() => {
        $('#Header').css('overflow', 'visible');
        $('.headerhidecontrols').css('display', 'none');
      }, delay);
    }
  };
