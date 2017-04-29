/*----------Modules----------*/
import React, {Component, PropTypes} from 'react';
import mapboxgl from 'mapboxgl';
import {connect} from 'react-redux';
import distance from '@turf/distance';
import gjv from 'geojson-validation';

/*----------Components----------*/

/*----------API Functions----------*/
import {validateServerData, fetchData, mapConfig, changedProps, positionChanged} from 'TrailmasterAPI';

/*----------Redux----------*/
import * as actions from 'actions';

/**
 * Renders a <div id='mapviewer' class='mapviewer' /> and loads a mapbox-gl
 * map into the div.  Manages the state of that map and handles any updates
 * to the map or its layers.
 */
export class MapViewer extends Component {
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
    initCenter: true
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
    // const changes = changedProps(nextProps, this.props);
    // console.log('MapViewer componentWillReceiveProps', changes);
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
        },
        distanceFilter,
        gpsTracking
      }
    } = nextProps;
    const {map, layerIDs, initCenter} = this.state;
    const searchPOI = new RegExp(POISearchText || '!!!!!!', 'i');
    const searchRoutes = new RegExp(RoutesSearchText || '!!!!!!', 'i');

    if (update && this.state.map) {
      let {lng, lat} = map.getCenter();
      if (lat === 0 && lng === 0) {
        // Map was never properly centered
        this.centerMap(longitude, latitude, true);
      }

      if (gpsTracking.mock
        && (latitude !== this.props.userSession.coords.latitude
          || longitude !== this.props.userSession.coords.longitude)) {
        // New mock position has been set
        // Perform an initCenter
        this.centerMap(longitude, latitude, true);
      } else if( !gpsTracking.mock && this.props.userSession.gpsTracking.mock) {
        // Mock location was just turned off
        this.centerMap(longitude, latitude, true);
      }

      // Remove existing map layers, fetch new data, generate new map layers
      this.refreshMap(nextProps);
      dispatch(actions.completeUpdateMap());
    } else if (distanceFilter !== this.props.userSession.distanceFilter) {
      // console.log('Refreshing based on distanceFilter', distanceFilter, nextProps);
      this.refreshMap(nextProps);
    }

    /**
     * Compare position of nextProps w/ this.props.  If change exceeds threshold
     * (currently 5 feet), then update the user's position on the map.
     */
    if (positionChanged({
      longitude,
      latitude
    }, this.props.userSession.coords) && map.getSource('user') !== undefined) {
      // Update user's position on map to reflect new updated geolocation data
      const {userSource} = mapConfig([
        longitude, latitude
      ], null);
      // console.log('Updating user position');
      map
        .getSource('user')
        .setData(userSource.data);
    }

    if ((mapCentering || initCenter) && this.state.map) {
      // Re-center map on user
      let {lng, lat} = map.getCenter();
      // console.log('Centering Map');
      if (positionChanged({
        longitude,
        latitude
      }, {
        longitude: lng,
        latitude: lat
      })) {
        this.centerMap(longitude, latitude, initCenter);
      }
      this.setState({initCenter: false});
    }

    // Check Map Layer Visibility
    if (features !== undefined)
    features.forEach(({
      properties: {
        name,
        displayed
      },
      geometry
    }) => {
      let i = layerIDs.map((id) => {
        return id[0];
      }).indexOf(name);
      if (i > -1) {
        // console.log('Setting maplayer visibility', name);
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
          lng, lat
        ],
        zoom: map.getZoom()
      });
    } else {
      map.easeTo({
        duration: 250,
        animate: true,
        center: [
          lng, lat
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

    map.on('load', () => {
      try {
        const {userSource, geoJSONSource} = mapConfig([
          longitude, latitude
        ], []);
        map.addSource('user', userSource);
        map.addSource('geoJSON', geoJSONSource);
      } catch (error) {
        debugger;
      }
      dispatch(actions.updateMap());
      dispatch(actions.storeCenter(map.getCenter()));
    });

    map.on('moveend', () => {
      dispatch(actions.storeCenter(map.getCenter()));
    });

    this.setState({map});
    dispatch(actions.mapLoaded());
  }


  /**
  * createMapLayers -  Parses geoJSON data from the Redux store and uses it to build
  *                    map layers that display routes and pois from the store.
  *
  * @param  {Object} features geoJSON features to be added to map
  * @param  {Object} props receives props so that nextProps can be passed in for
  *                        certain situations.
  */
  createMapLayers(features, props) {
    const {layerIDs, map} = this.state;
    const {
      userSession: {
        coords: {
          latitude,
          longitude
        },
        distanceFilter
      },
      dispatch
    } = props;
    let newLayerIDs = [];

    layerIDs.forEach(([id, type]) => {
      try {
        map.removeLayer(id);
      } catch (error) {
        console.error(error);
      }
    });

    const {userSource, userLayer, geoJSONSource, addGeoJSONLayers} = mapConfig([
      longitude, latitude
    ], features);

    try {
      if (!gjv.valid(userSource.data))
        console.log('WARNING: ', userSource);
      map
        .getSource('user')
        .setData(userSource.data);
      map.addLayer(userLayer);
      newLayerIDs.push(['You Are Here', 'user']);
      // Add Map Layers for GeoJSON Data
      if (!gjv.valid(geoJSONSource.data))
        console.log('WARNING: ', geoJSONSource);
      map
        .getSource('geoJSON')
        .setData(geoJSONSource.data);

      features.forEach((feature) => {
        const {properties: {
            name
          }, geometry: {
            type
          }} = feature;
        let layerType = type === 'Point'
          ? 'symbol'
          : 'line';
        addGeoJSONLayers(feature, map);
        if (type === 'Point') {
          newLayerIDs.push([name, layerType]);
        } else if (type === 'LineString') {
          newLayerIDs.push([name, layerType]);
          newLayerIDs.push([
            name + ' label',
            layerType
          ]);
        }
      });
      this.setState({layerIDs: newLayerIDs});
    } catch (error) {
      console.error(error);
      debugger;
    }
  }

  /**
   * refreshMap - Remove existing layers from the map, fetch new data based on current
   *              application state, and generate new map layers.
   *
   * @param  {OBJECT} props props object to be passed to this.createMapLayers after
   *                        new data is fetched from the server
   */
  refreshMap(props) {
    // console.log('Mapviewer.refreshMap', props);
    const {
      userSession: {
        coords: {
          latitude,
          longitude
        },
        distanceFilter
      },
      dispatch
    } = props;
    fetchData(latitude, longitude, distanceFilter)
      .then((features) => {
        dispatch(actions.replaceGeoJSON(features));
        this.createMapLayers(features, props);
      }).catch((error) => {
        throw error;
      });
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
    return <div id='mapviewer' className='mapviewer' />;
  }
}

MapViewer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userSession: PropTypes.object.isRequired,
  geoJSON: PropTypes.object.isRequired,
  searchText: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired
};

export default connect((state) => state)(MapViewer);
