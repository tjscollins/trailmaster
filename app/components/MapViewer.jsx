/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

class MapViewer extends BaseComponent {
  constructor() {
    super();
    // _bind(...methods) {
    //   methods.forEach((method) => this[method] = this[method].bind(this));
    // } inherited from BaseComponent
    this.map = false;
  }
  createMap() {
    var {geoJSON} = this.props;
    var layerIDs = []; // Will contain a list used to filter against.
    var filterPOI = document.getElementById('poi-searchText');
    var filterRoutes = document.getElementById('routes-searchText');
    mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
    console.log('Generating Map...');
    var map = new mapboxgl.Map({
      container: 'mapviewer',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [
        145.72672, 15.16795
      ],
      zoom: 12,
      hash: false,
      interactive: true
    });
    //Try loading interface
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      //Try loading desired data....

      //Points of Interest & Labels
      var points = geoJSON
        .features
        .filter((point) => {
          return point.geometry.type === 'Point';
        });
      map.addSource('points', {
        'type': 'geojson',
        'data': {
          ...geoJSON,
          'features': points
        }
      });
      points.forEach((point) => {
        var layerID = point.properties.name;

        if (!map.getLayer(layerID)) {
          map.addLayer({
            'id': layerID,
            'type': 'symbol',
            'source': 'points',
            'layout': {
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
            },
            'filter': ['==', 'name', layerID]
          });

          layerIDs.push(layerID);
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
          console.log(value, layerID, layerID.match(re));
          map.setLayoutProperty(layerID, 'visibility', layerID.match(re) && value.length
            ? 'visible'
            : 'none');
        });
      });

      //Routes & Labels
      // map.addSource('routes', {
      //   'type': 'geojson',
      //   'data': {
      //     ...geoJSON,
      //     'features': geoJSON
      //       .features
      //       .filter((point) => {
      //         return point.geometry.type === 'LineString';
      //       })
      //   }
      // });
      // map.addLayer({
      //   'id': 'routes',
      //   'type': 'line',
      //   'source': 'routes',
      //   'layout': {
      //     'line-join': 'round',
      //     'line-cap': 'round'
      //   },
      //   'paint': {
      //     'line-color': '#500',
      //     'line-width': 2
      //   }
      // });
      // map.addLayer({
      //   'id': 'route-labels',
      //   'type': 'symbol',
      //   'source': 'routes',
      //   'layout': {
      //     'text-field': "{name}",
      //     'text-font': [
      //       'Open Sans Regular', 'Arial Unicode MS Regular'
      //     ],
      //     'text-size': 10,
      //     'text-offset': [
      //       0, 0.6
      //     ],
      //     'text-anchor': 'top'
      //   }
      // });
    });
    return map;
  }
  componentDidMount() {
    console.log('MapViewer mounted...');
    this.map = this.map || this.createMap();
  }
  render() {
    return (<div id="mapviewer" className="mapviewer"/>);
  }
}
export default connect(state => state)(MapViewer);
