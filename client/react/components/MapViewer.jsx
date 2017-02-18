/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';
import {mapConfig} from 'TrailmasterAPI';
import distance from '@turf/distance';

/*----------Components----------*/


/*----------Redux----------*/
import * as actions from 'actions';

export class MapViewer extends React.Component {
  state = {
    map: false,
    layerIDs: [],
    initCenter: true,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if(!this.state.map) {
      this.createMap(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      geoJSON: {features},
      map: {update},
      searchText: { POISearchText, RoutesSearchText },
      userSession: {mapCentering, coords: {longitude, latitude}},
    } = nextProps;
    const { map, layerIDs, initCenter } = this.state;
    let searchPOI = new RegExp(POISearchText || '!!!!!!', 'i');
    let searchRoutes = new RegExp(RoutesSearchText || '!!!!!!', 'i');

    if(update) {
      // Timeout hack to run AFTER map has loaded fully
      setTimeout(()=> {this.refreshMap(nextProps);}, 25);
      dispatch(actions.completeUpdateMap());
    }

    if(mapCentering || initCenter && this.state.map) {
      this.centerMap(longitude, latitude, initCenter);
      this.setState({initCenter: false});
    }

    // Check Map Layer Visibility
    features.forEach(({properties, geometry}) => {
      let {name, displayed} = properties;
      let i = layerIDs.map((id) => {
        return id[0];
      }).indexOf(name);
      if (i > -1) {
        // console.log(name);
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
  }
  centerMap(lng, lat, instant) {
    const {map} = this.state;
    if(instant) {
      map.jumpTo({
        center: [lng, lat],
        zoom: map.getZoom(),
      });
    } else {
      map.easeTo({
          duration: 5000,
          animate: true,
          center: [
            lng, lat
          ],
          zoom: map.getZoom()
        });
    }
  }
  createMap(props) {
    const {
      userSession: {
        coords: {
          longitude,
          latitude
        }
      },
      dispatch,
      map: {
        accessToken
      }
    } = props;

    // Initialize map
    mapboxgl.accessToken = accessToken;
    let map = new mapboxgl.Map({
      container: 'mapviewer',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [
        longitude, latitude
      ],
      zoom: 12,
      hash: false,
      interactive: true
    });
    // Add Mapbox Interface Controls
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl({maxWidth: 120, unit: 'imperial'}));
    dispatch(actions.storeCenter(map.getCenter()));

    map.on('load', () => {

    });

    map.on('moveend', () => {

    });


    this.setState({map});
  }
  createMapLayers(props) {
    // debugger;
    // console.log('createMapLayers');
    const {map} = this.state;
    let layerIDs = [];
    const {geoJSON, userSession: { coords: {latitude, longitude}}, dispatch} = props;

    // Place User Marker on Map
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
              coordinates: [ longitude, latitude, ],
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

    map.addSource('user', userSource);
    map.addLayer(userLayer);

    // Add Map Layers for GeoJSON Data
    let geoJSONSource = {
      'type': 'geojson',
      'data': geoJSON,
    };

    let geoJSONLayer = (source, id, type, layout) => {
      return {
          id,
          type,
          source,
          layout,
          'filter': ['==', 'name', id]
        };
    };
    map.addSource('geoJSON', geoJSONSource);

    geoJSON.features.forEach((feature) => {
      let {name} = feature.properties;
      let type = '', layout = {};
      switch(feature.geometry.type) {
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
      map.addLayer(geoJSONLayer('geoJSON', name, type, layout))
      layerIDs.push([name, type]);
    });
    this.setState({layerIDs});
  }
  refreshMap(props) {
    this.removeMapLayers();
    this.createMapLayers(props);
  }
  removeMapLayers() {
    let {layerIDs, map} = this.state;
    layerIDs.forEach((id) => {
      map.removeLayer(id);
    });
    this.setState({layerIDs: []});
  }
  shouldDisplay(layerName, search, props) {
    // Props should be passed in here to allow selection between current or
    // nextProps as appropriate
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
  render() {
    return (
      <div id='mapviewer' className='mapviewer' />
    );
  }
}

export default connect((state) => state)(MapViewer);
