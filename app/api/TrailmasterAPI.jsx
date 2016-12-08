import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

export var createMap = (geoJSON, layerIDs) => {
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
