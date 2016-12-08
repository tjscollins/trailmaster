/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

export class MapViewer extends BaseComponent {
  constructor() {
    super();
    // _bind(...methods) {
    //   methods.forEach((method) => this[method] = this[method].bind(this));
    // } inherited from BaseComponent
    this.map = false;
    this.layerIDs = []; // Will contain a list used to filter against.

  }
  createMap() {
    var {layerIDs} = this;
    var {geoJSON} = this.props;
    var filterPOI = document.getElementById('poi-searchText');
    var filterRoutes = document.getElementById('routes-searchText');
    mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
    // console.log('Generating Map...');
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
              layerIDs.push(`${layerID} label`);
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
          map.setLayoutProperty(layerID, 'visibility', layerID.match(re) && value.length
            ? 'visible'
            : 'none');
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
          map.setLayoutProperty(layerID, 'visibility', layerID.match(re) && value.length
            ? 'visible'
            : 'none');
        });
      });

      //Routes & Labels
      // map.addLayer({
      //   'id': 'routes',
      //   'type': 'line',
      //   'source': 'store',
      //   'layout': {
      //     'line-join': 'round',
      //     'line-cap': 'round'
      //   },
      //   'paint': {
      //     'line-color': '#500',
      //     'line-width': 2
      //   }
      // });

    });
    return map;
  }
  componentWillReceiveProps(nextProps) {
    var {map} = this;
    nextProps
      .geoJSON
      .features
      .map((feat) => {
        return feat.properties;
      })
      .forEach(({name, displayed}) => {
        // console.log('Checking for layer', name);
        if (this.layerIDs.indexOf(name) > -1) {
          // console.log('Toggling map layer', name, displayed);
          map.setLayoutProperty(name, 'visibility', displayed
            ? 'visible'
            : 'none');
          // console.log('Checking for layer', `${name} label`);
          if (this.layerIDs.indexOf(`${name} label`) > -1) {
            // console.log('Toggling map layer', `${name} label`, displayed);
            map.setLayoutProperty(`${name} label`, 'visibility', displayed
              ? 'visible'
              : 'none');
          }
        }
      });
  }
  componentDidMount() {
    // console.log('MapViewer mounted...');
    this.map = this.map || this.createMap();
  }
  render() {
    return (<div id="mapviewer" className="mapviewer"/>);
  }
}
export default connect(state => state)(MapViewer);
