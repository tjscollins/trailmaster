/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';
// import {createMap} from 'TrailmasterAPI';

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
    var self = this;
    var {layerIDs} = this;
    var {geoJSON} = this.props;
    var layerIDs = [];
    var filterPOI = document.getElementById('poi-searchText');
    var filterRoutes = document.getElementById('routes-searchText');
    mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
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
              console.log(`Creating map layer: ${layerID} label`, 'symbol');
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
          console.log('Creating map layer', layerID, layerType);
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
        console.log('Calling filterPOI');
        var {geoJSON} = self.props;
        var value = e
          .target
          .value
          .trim() || '!!!!!!!';
        layerIDs.forEach(function(layerID) {
          var re = new RegExp(value, 'i');
          if (layerID[1] === 'symbol') {
            //Only layers representing POIs
            if (self.shouldDisplay(layerID[0], re, self.props)) {
              //Only POIs that match the search for non-zero length search
              map.setLayoutProperty(layerID[0], 'visibility', 'visible');
            } else {
              map.setLayoutProperty(layerID[0], 'visibility', 'none');
            }
          }
        });
      });

      filterRoutes.addEventListener('keyup', function(e) {
        // If the input value matches a layerID set
        // it's visibility to 'visible' or else hide it.
        console.log('Calling filterRoutes');
        var {geoJSON} = self.props;
        var value = e
          .target
          .value
          .trim() || '!!!!!!!!';
        layerIDs.forEach(function(layerID) {
          var re = new RegExp(value, 'i');
          if (layerID[1] === 'line') {
            //Only Layers representing Route-Line
            if (self.shouldDisplay(layerID[0], re, self.props)) {
              map.setLayoutProperty(layerID[0], 'visibility', 'visible');
            } else {
              map.setLayoutProperty(layerID[0], 'visibility', 'none');
            }
          } else if (layerID[1] === 'label') {
            //Only Layers representing Route-Line
            //Trim off ' label' suffix from layerID
            var name = layerID[0].substring(0, layerID[0].length - 6);
            if (self.shouldDisplay(name, re, self.props)) {
              //Only Route-Lines that match the non-zero search
              map.setLayoutProperty(layerID[0], 'visibility', 'visible');
            } else {
              map.setLayoutProperty(layerID[0], 'visibility', 'none');
            }
          }
        });
      });
    });
    this.layerIDs = layerIDs;
    return map;
  }
  shouldDisplay(layerName, search, props) {
    //Props should be passed in here to allow selection between current or nextProps as appropriate
    var {geoJSON} = props;
    var {properties} = geoJSON
      .features
      .filter((point) => {
        return point.properties.name === layerName;
      })[0];
    return search.test(layerName) || properties.displayed;
  }
  componentWillReceiveProps(nextProps) {
    var {dispatch, searchText} = nextProps;
    var {map, layerIDs} = this;
    var searchPOI = new RegExp(searchText.POISearchText || '!!!!!!', 'i');
    var searchRoutes = new RegExp(searchText.RoutesSearchText || '!!!!!!', 'i');
    nextProps
      .geoJSON
      .features
      .forEach(({properties, geometry}) => {
        var {name, displayed} = properties;
        var i = layerIDs.map((id) => {
          return id[0];
        }).indexOf(name);
        if (i > -1) {
          if (this.shouldDisplay(name, searchPOI, nextProps) && layerIDs[i][1] === 'symbol') {
            map.setLayoutProperty(name, 'visibility', 'visible');
          } else if (this.shouldDisplay(name, searchRoutes, nextProps) && layerIDs[i][1] !== 'symbol') {
            map.setLayoutProperty(name, 'visibility', 'visible');
            map.setLayoutProperty(name + ' label', 'visibility', 'visible');
          } else {
            map.setLayoutProperty(name, 'visibility', 'none');
            if (layerIDs[i][1] !== 'symbol')
              map.setLayoutProperty(name + ' label', 'visibility', 'none');
            }

        }
      });

    if (nextProps.map.update) {
      map.remove();
      this.map = this.createMap();
      dispatch(actions.completeUpdateMap());
    }
  }
  componentDidMount() {
    var {dispatch} = this.props;
    this.map = this.map || this.createMap();
  }
  render() {
    return (<div id="mapviewer" className="mapviewer"/>);
  }
}
export default connect(state => state)(MapViewer);
