/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';
import {createMap} from 'TrailmasterAPI';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

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
  }
  componentWillReceiveProps(nextProps) {
    var {dispatch} = this.props;
    var {map} = this;
    var willReplaceMap = nextProps.map.update;
    nextProps
      .geoJSON
      .features
      .map((feat) => {
        return feat.properties;
      })
      .forEach(({name, displayed}) => {
        if (this.layerIDs.map((id) => {
          return id[0];
        }).indexOf(name) > -1) {
          map.setLayoutProperty(name, 'visibility', displayed
            ? 'visible'
            : 'none');
          if (this.layerIDs.map((id) => {
            return id[0];
          }).indexOf(`${name} label`) > -1) {
            map.setLayoutProperty(`${name} label`, 'visibility', displayed
              ? 'visible'
              : 'none');
          }
        }
      });

    if (willReplaceMap) {
      map.remove();
      this.map = this.createMap();
      dispatch(actions.completeUpdateMap());
    }
  }
  componentDidMount() {
    var {dispatch} = this.props;
    // console.log('MapViewer mounted...');
    this.map = this.map || this.createMap();
    // dispatch(actions.updateMap(map));
  }
  render() {
    return (<div id="mapviewer" className="mapviewer"/>);
  }
}
export default connect(state => state)(MapViewer);
