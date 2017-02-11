/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';
import {mapConfig} from 'TrailmasterAPI';
import distance from '@turf/distance';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class MapViewer extends BaseComponent {
  constructor() {
    super();
    this._bind('createMap');
    this.state = {
      map: false,
      layerIDs: [],
      checkCenter: null
    };
  }
  createMap(props) {
    // Passing props as arg to allow choice of nextProps or current props as
    // appropriate
    console.log('MapViewer.createMap', this.props);
    const self = this;
    let {geoJSON, userSession, dispatch} = props;
    let {distanceFilter, coords} = userSession;
    let layerIDs = [];
    let filterPOI = document.getElementById('poi-searchText');
    let filterRoutes = document.getElementById('routes-searchText');
    mapboxgl.accessToken = this.props.map.accessToken;
    let map = new mapboxgl.Map({
      container: 'mapviewer',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [
        coords.longitude, coords.latitude,
      ],
      zoom: 12,
      hash: false,
      interactive: true
    });
    dispatch(actions.storeCenter(map.getCenter()));
    Promise.all([
      $.get(`/pois?lat=${coords.latitude}&lng=${coords.longitude-360}&dist=${distanceFilter}`),
      $.get(`/routes?lat=${coords.latitude}&lng=${coords.longitude-360}&dist=${distanceFilter}`),
    ]).then((res) => {
      let [{pois}, {routes}] = res;
      pois.concat(routes);
      dispatch(actions.replaceGeoJSON(pois));
    }).catch((err) => {
      console.error('Error fetching data', err);
    });
    //Try loading interface
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl({maxWidth: 120, unit: 'imperial'}));
    map.on('load', () => {
      //place userSession
      map.addSource('user', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                'marker-color': mapConfig.user.markerColor,
                'marker-size': mapConfig.user.markerSize,
                'marker-symbol': mapConfig.user.markerSymbol,
                'name': 'You'
              },
              geometry: {
                type: 'Point',
                coordinates: [userSession.coords.longitude, userSession.coords.latitude,]
              }
            },
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
            'Open Sans Regular', 'Arial Unicode MS Regular',
          ],
          'text-size': 10,
          'text-offset': [
            0, 1,
          ],
          'text-anchor': 'top',
          'visibility': 'visible'
        }
      });
      //Try loading desired data.... Points of Interest & Labels
      let points = geoJSON.features;
      map.addSource('store', {
        'type': 'geojson',
        'data': {
          ...geoJSON,
          'features': points
        }
      });
      points.forEach((point) => {
        let layerID = point.properties.name;
        let layerType = '';
        let layout = {};

        if (!map.getLayer(layerID)) {
          switch (point.geometry.type) {
            case 'Point':
              layerType = 'symbol';
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
              map.addLayer({
                'id': `${layerID} label`,
                'type': 'symbol',
                'source': 'store',
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
                  'visibility': 'none'
                },
                'filter': [
                  '==', 'name', layerID,
                ],
              });
              layerIDs.push([`${layerID} label`, 'label',]);
              break;
            default:
              throw new Error(`Unknown feature type ${layerType}`);
          }
          map.addLayer({
            'id': layerID,
            'type': layerType,
            'source': 'store',
            'layout': layout,
            'filter': [
              '==', 'name', layerID,
            ],
          });
          layerIDs.push([layerID, layerType,]);
        }
      });

      filterPOI.addEventListener('keyup', function(e) {
        // If the input value matches a layerID set it's visibility to 'visible' or else
        // hide it.
        let {geoJSON} = self.props;
        let value = e
          .target
          .value
          .trim() || '!!!!!!!';
        layerIDs.forEach(function(layerID) {
          let re = new RegExp(value, 'i');
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
        // If the input value matches a layerID set it's visibility to 'visible' or else
        // hide it.
        let {geoJSON} = self.props;
        let value = e
          .target
          .value
          .trim() || '!!!!!!!!';
        layerIDs.forEach(function(layerID) {
          let re = new RegExp(value, 'i');
          if (layerID[1] === 'line') {
            //Only Layers representing Route-Line
            if (self.shouldDisplay(layerID[0], re, self.props)) {
              map.setLayoutProperty(layerID[0], 'visibility', 'visible');
            } else {
              map.setLayoutProperty(layerID[0], 'visibility', 'none');
            }
          } else if (layerID[1] === 'label') {
            //Only Layers representing Route-Line Trim off ' label' suffix from layerID
            let name = layerID[0].substring(0, layerID[0].length - 6);
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
    map.on('moveend', () => {
      let {center} = self.props.map;
      let {distanceFilter} = self.props.userSession;
      let {lng, lat} = map.getCenter();
      dispatch(actions.storeCenter(map.getCenter()));
      let from = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': [
            center.lng - 360,
            center.lat
          ]
        }
      };
      let to = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': [lng, lat]
        }
      };
      if ( distance(from, to, 'miles') > distanceFilter/4 ) {
        Promise.all([
          $.get(`/pois?lat=${lat}&lng=${lng-360}&dist=${distanceFilter}`),
          $.get(`/routes?lat=${lat}&lng=${lng-360}&dist=${distanceFilter}`),
        ]).then((res) => {
          let [{pois}, {routes}] = res;
          dispatch(actions.replaceGeoJSON(pois.concat(routes)));
        }).catch((err) => {
          console.error('Error fetching data', err);
        });
      }
    });
    this.setState({map, layerIDs});
  }
  shouldDisplay(layerName, search, props) {
    // Props should be passed in here to allow selection between current or nextProps
    // as appropriate
    let {geoJSON, userSession} = props;
    let onePoint = geoJSON
      .features
      .filter((point) => {
        return point.properties.name === layerName;
      })[0];
    return search.test(layerName) || userSession
      .visibleFeatures
      .indexOf(onePoint._id) > -1;
  }
  componentWillReceiveProps(nextProps) {
    let {dispatch, searchText,} = nextProps;
    let {map, layerIDs,} = this.state;
    let searchPOI = new RegExp(searchText.POISearchText || '!!!!!!', 'i');
    let searchRoutes = new RegExp(searchText.RoutesSearchText || '!!!!!!', 'i');
    nextProps
      .geoJSON
      .features
      .forEach(({properties, geometry,}) => {
        let {name, displayed,} = properties;
        let i = layerIDs.map((id) => {
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
      this.createMap(nextProps);
      dispatch(actions.completeUpdateMap());
    } else if (nextProps.userSession.mapCentering) {
      let newLong = nextProps.userSession.coords.longitude;
      let newLat = nextProps.userSession.coords.latitude;
      setTimeout(() => {
        this
          .state
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
                  'name': 'You'
                },
                geometry: {
                  type: 'Point',
                  coordinates: [newLong, newLat,]
                }
              },
            ]
          });

        //is New Position on Visible Map?
        let bounds = this
          .state
          .map
          .getBounds();
        let swLng = bounds._sw.lng;
        let swLat = bounds._sw.lat;
        let neLng = bounds._ne.lng;
        let neLat = bounds._ne.lat;
        if (newLong > swLng || newLong < neLng || newLat > neLat || newLat < swLat) {
          this
            .state
            .map
            .easeTo({
              duration: 5000,
              animate: true,
              center: [
                newLong, newLat,
              ],
              zoom: this
                .state
                .map
                .getZoom()
            });
        }
      }, 750);
    }
  }
  componentDidMount() {
    if (!this.state.map) {
      this.createMap(this.props);
    }
  }
  render() {
    return (<div id='mapviewer' className='mapviewer'/>);
  }
}
export default connect((state) => state)(MapViewer);
