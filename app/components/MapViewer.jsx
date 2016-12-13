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
    this.layerIDs = []; // Will contain a list of layers to filter against.
  }
  createMap(props) {
    //Passing props as arg to allow choice of nextProps or current props as appropriate
    var self = this;
    var {layerIDs} = this;
    var {geoJSON, userLocation} = props;
    var layerIDs = [];
    var filterPOI = document.getElementById('poi-searchText');
    var filterRoutes = document.getElementById('routes-searchText');
    mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
    var map = new mapboxgl.Map({
      container: 'mapviewer',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [
        userLocation.coords.longitude, userLocation.coords.latitude
      ],
      zoom: 12,
      hash: false,
      interactive: true
    });
    //Try loading interface
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      //place userLocation
      map.addSource('user', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                'marker-color': '#00007e',
                'marker-size': 'large',
                'marker-symbol': 'icon-color',
                name: 'You'
              },
              geometry: {
                type: 'Point',
                coordinates: [userLocation.coords.longitude, userLocation.coords.latitude]
              }
            }
          ]
        }
      });
      map.addLayer({
        'id': 'You Are Here',
        'type': 'symbol',
        'source': 'user',
        'layout': {
          'icon-image': 'marker-15',
          'icon-size': 2,
          'text-field': '{name}',
          'text-font': [
            'Open Sans Regular', 'Arial Unicode MS Regular'
          ],
          'text-size': 10,
          'text-offset': [
            0, 1
          ],
          'text-anchor': 'top',
          'visibility': 'visible'
        }
      });
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
              // console.log('Creating map layer', layerID, layerType);
              // console.log(`Creating map layer: ${layerID} label`, 'symbol');
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
    var {geoJSON, userSession} = props;
    var onePoint = geoJSON
      .features
      .filter((point) => {
        return point.properties.name === layerName;
      })[0];
    return search.test(layerName) || userSession
      .visibleFeatures
      .indexOf(onePoint._id) > -1;
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
            console.log('Displaying', name);
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
      console.log('Re-generating map');
      map.remove();
      this.map = this.createMap(nextProps);
      dispatch(actions.completeUpdateMap());
    } else if (nextProps.userLocation.mapCentering) {
      // var oldLong = this.props.userLocation.coords.longitude
      // var oldLat = this.props.userLocation.coords.latitude
      var newLong = nextProps.userLocation.coords.longitude;
      var newLat = nextProps.userLocation.coords.latitude;
      setTimeout(() => {
        this
          .map
          .getSource('user')
          .setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  'marker-color': '#00007e',
                  'marker-size': 'large',
                  'marker-symbol': 'icon-color',
                  name: 'You'
                },
                geometry: {
                  type: 'Point',
                  coordinates: [newLong, newLat]
                }
              }
            ]
          });

        //is New Position on Visible Map?
        var bounds = this
          .map
          .getBounds();
        var swLng = bounds._sw.lng,
          swLat = bounds._sw.lat;
        var neLng = bounds._ne.lng,
          neLat = bounds._ne.lat;
        if (newLong > swLng || newLong < neLng || newLat > neLat || newLat < swLat) {
          // this
          //   .map
          //   .fitBounds([
          //     [
          //       oldLong < newLong
          //         ? oldLong - 0.5
          //         : newLong - 0.5,
          //       oldLat < newLat
          //         ? oldLat - 0.5
          //         : newLat - 0.5
          //     ],
          //     [
          //       oldLong > newLong
          //         ? oldLong + 0.5
          //         : newLong + 0.5,
          //       oldLat > newLat
          //         ? oldLat + 0.5
          //         : newLat + 0.5
          //     ]
          //   ]);
          this
            .map
            .easeTo({
              duration: 5000,
              animate: true,
              center: [
                newLong, newLat
              ],
              zoom: this
                .map
                .getZoom()
            });
        }
      }, 750);

    }
  }
  componentDidMount() {
    var {dispatch} = this.props;
    this.map = this.map || this.createMap(this.props);
  }
  render() {
    return (<div id="mapviewer" className="mapviewer"/>);
  }
}
export default connect(state => state)(MapViewer);
