/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';
import {mapConfig} from 'TrailmasterAPI';
import distance from '@turf/distance';

/*----------Components----------*/

/*----------API Functions----------*/
import {validateServerData} from 'TrailmasterAPI';

/*----------Redux----------*/
import * as actions from 'actions';

/**
 * Renders a <div id='mapviewer' class='mapviewer' /> and loads a mapbox-gl
 * map into the div.  Manages the state of that map and handles any updates
 * to the map or its layers.
 */
export class MapViewer extends React.Component {
  /**
   * Mapviewer.state stores information about the mapboxgl map being rendered.
   *
   * @property {OBJECT} state.map          Stores the mapbox-gl instance for the component
   * @property {ARRAY}  state.layerIDs     Stores a list of map layers that have been placed
   *                                       on the map.
   * @property {BOOLEAN} state.initCenter  Whether the mapbox-gl map still needs to be correctly
   *                                       centered for the first time.
   */
  state = {
    map: null,
    layerIDs: [],
    initCenter: true,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /**
     * if - Determine whether to create a new map
     *      Must run AFTER component mounts so that the target DOM element
     *      will actually exist in the DOM tree.
     *
     * @param  {BOOLEAN} !this.state.map  Check if mapbox-gl map has been stored
     *                                    in the component's state.
     */
    if (!this.state.map) {
      this.createMap(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      geoJSON: {
        features
      },
      map: {
        update
      },
      searchText: {
        POISearchText,
        RoutesSearchText
      },
      userSession: {
        mapCentering,
        coords: {
          longitude,
          latitude
        }
      },
    } = nextProps;
    const {map, layerIDs, initCenter} = this.state;
    let searchPOI = new RegExp(POISearchText || '!!!!!!', 'i');
    let searchRoutes = new RegExp(RoutesSearchText || '!!!!!!', 'i');

    if (update) {
      this.refreshMap(nextProps);
      dispatch(actions.completeUpdateMap());
    }

    if (mapCentering || initCenter && this.state.map) {
      this.centerMap(longitude, latitude, initCenter);
      this.setState({initCenter: false});
    }

    // Check Map Layer Visibility
    features.forEach(({properties: {name, displayed}, geometry}) => {
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
  }

  centerMap(lng, lat, instant) {
    const {map} = this.state;
    if (instant) {
      map.jumpTo({
        center: [
          lng, lat,
        ],
        zoom: map.getZoom(),
      });
    } else {
      map.easeTo({
        duration: 5000,
        animate: true,
        center: [
          lng, lat,
        ],
        zoom: map.getZoom()
      });
    }
  }

  /**
   * createMap -  Generates  and configures the mapbox-gl.Map instance
   *              and stores it in this.state
   *
   * @param  {OBJECT} props receives props so that nextProps can be passed in for
   *                        certain situations.
   */
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
        longitude, latitude,
      ],
      zoom: 12,
      hash: false,
      interactive: true
    });
    // Add Mapbox Interface Controls
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl({maxWidth: 120, unit: 'imperial'}));

    map.on('load', () => {
      dispatch(actions.storeCenter(map.getCenter()));
      dispatch(actions.updateMap());
    });

    map.on('moveend', () => {
      dispatch(actions.storeCenter(map.getCenter()));
    });

    this.setState({map});
  }

  /**
   * createMapLayers -  Parses geoJSON data from the Redux store and uses it to build
   *                    map layers that display routes and pois from the store.
   *
   * @param  {OBJECT} props receives props so that nextProps can be passed in for
   *                        certain situations.
   */
  createMapLayers(props, getNewData) {
    const {map} = this.state;
    let layerIDs = [];
    const {
      geoJSON,
      userSession: {
        coords: {
          latitude,
          longitude
        },
        distanceFilter,
      },
      dispatch
    } = props;

    if (getNewData) {
      Promise.all([
        $.get(`/pois?lat=${latitude}&lng=${longitude - 360}&dist=${distanceFilter}`),
        $.get(`/routes?lat=${latitude}&lng=${longitude - 360}&dist=${distanceFilter}`),
      ]).then((data) => {
        let features = data.reduce((acc, currentObject) => {
          let allObjects = [];
          for (let key in currentObject) {
            // Validate Server Data BEFORE loading it into Redux Store
            if (Array.isArray(currentObject[key])) {
              currentObject[key].forEach((item) => {
                if (validateServerData(item)) allObjects.push(item);
              });
            }
          }
          return acc.concat(allObjects);
        }, []);
        dispatch(actions.replaceGeoJSON(features));
        this.createMapLayers(props, false);
      });
    } else {
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
                coordinates: [
                  longitude, latitude,
                ],
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
          'filter': ['==', 'name', id,]
        };
      };
      map.addSource('geoJSON', geoJSONSource);

      geoJSON
        .features
        .forEach((feature) => {
          let {name} = feature.properties;
          let type = '',
            layout = {};
          switch (feature.geometry.type) {
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
                'filter': ['==', 'name', name,]
              });
              break;
            default:
              throw new Error(`Unknown feature type ${feature.geometry.type}`);
          }
          map.addLayer(geoJSONLayer('geoJSON', name, type, layout))
          layerIDs.push([name, type,]);
        });
      this.setState({layerIDs});
    }
  }

  refreshMap(props) {
    // console.log('Mapviewer.refreshMap');
    this.removeMapLayers();
    this.createMapLayers(props, true);
  }

  removeMapLayers() {
    let {layerIDs, map} = this.state;
    layerIDs.forEach((id) => {
      map.removeLayer(id);
    });
    this.setState({layerIDs: []});
  }

  shouldDisplay(layerName, search, props) {
    // debugger;
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
    return (<div id='mapviewer' className='mapviewer'/>);
  }
}

export default connect((state) => state)(MapViewer);
