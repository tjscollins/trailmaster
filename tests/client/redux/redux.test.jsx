/*global describe it*/
import expect from 'expect';
import df from 'deep-freeze-strict';

import {configure} from 'configureStore';
import * as actions from 'actions';
import * as reducers from 'reducers';

// let http = require('http'),   mockserver = require('mockserver');
//
// http   .createServer(mockserver('app/api/mocks'))   .listen('3000');

describe('redux', () => {
  //store
  describe('configureStore', () => {
    it('should configure the Redux store to an initial state', () => {
      let initalState = {
        userSession: true,
        map: false,
        geoJSON: null
      };
      let {geoJSON, map, userSession} = configure(initalState).getState();
      expect(userSession).toBe(true);
      expect(map).toBe(false);
      expect(geoJSON).toBe(null);
    });
  });

  //actions
  describe('actions', () => {
    describe('trails actions', () => {
      it('should generate the DISPLAY_TRAILS actions', () => {
        let action = {
          type: 'DISPLAY_TRAILS',
          trails: 'trails',
        };
        expect(actions.displayTrails('trails')).toEqual(action);
      });

      it('should generate the CLEAR_TRAILS action', () => {
        let action = {
          type: 'CLEAR_TRAILS'
        };
        expect(actions.clearTrails()).toEqual(action);
      });

      it('should generate the SAVE_TRAIL action', () => {
        let action = {
          type: 'SAVE_TRAIL',
          name: 'name',
          desc: 'desc',
          list: 'list',
          bounds: 'bounds',
        };
        let res = actions.saveTrail('list', 'name', 'desc', 'bounds');
        expect(res).toEqual(action);
      });

      it('should generate the SHOW_TRAIL action', () => {
        let action = {
          type: 'SHOW_TRAIL',
          id: 'id',
        };
        expect(actions.showTrail('id')).toEqual(action);
      });
    });

    describe('userSession actions', () => {
      it('should generate the LOGIN action', () => {
        let action = {
          type: 'LOGIN',
          xAuth: 'xAuth',
          userId: 'userId',
          email: 'email',
        };
        let res = actions.login('xAuth', 'userId', 'email');
        expect(res).toEqual(action);
      });
      it('should generate the LOGOUT action', () => {
        let action = {
          type: 'LOGOUT'
        };
        let res = actions.logout();
        expect(res).toEqual(action);
      });
      it('should generate the TOGGLE_VISIBILITY action', () => {
        let action = {
          type: 'TOGGLE_VISIBILITY',
          id: 'id'
        };
        let res = actions.toggleVisibility('id');
        expect(res).toEqual(action);
      });
      it('should generate the UPDATE_DISTANCE_FILTER action', () => {
        let action = {
          type: 'UPDATE_DISTANCE_FILTER',
          distance: 'distance',
        };
        let res = actions.updateDistanceFilter('distance');
        expect(res).toEqual(action);
      });
      it('should generate the UPDATE_POS action', () => {
        let action = {
          type: 'UPDATE_POS',
          position: 'position'
        };
        let res = actions.updatePOS('position');
        expect(res).toEqual(action);
      });

      it('should generate the TOGGLE_MAP_CENTERING action', () => {
        let action = {
          type: 'TOGGLE_MAP_CENTERING'
        };
        let res = actions.toggleMapCentering();
        expect(res).toEqual(action);
      });

      it('should generate the TRACK_ROUTE action', () => {
        let action = {
          type: 'TRACK_ROUTE'
        };
        let res = actions.trackRoute();
        expect(res).toEqual(action);
      });

      it('should generate the STOP_TRACKING_ROUTE action', () => {
        let action = {
          type: 'STOP_TRACKING_ROUTE'
        };
        let res = actions.stopTrackingRoute();
        expect(res).toEqual(action);
      });

      it('should generate the CLEAR_ROUTE_LIST action', () => {
        let action = {
          type: 'CLEAR_ROUTE_LIST'
        };
        let res = actions.clearRouteList();
        expect(res).toEqual(action);
      });

      it('should generate the ADD_TO_ROUTE_LIST action', () => {
        let action = {
          type: 'ADD_TO_ROUTE_LIST',
          position: 'position'
        };
        let res = actions.addToRouteList('position');
        expect(res).toEqual(action);
      });

      it('should generate the STOP_GPS action', () => {
        const action = {type: 'STOP_GPS'};
        const res = actions.stopGPS();
        expect(res).toEqual(action);
      });
    });

    describe('geoJSON actions', () => {
      it('should generate the TOGGLE_VISIBILITY action', () => {
        let action = {
          type: 'TOGGLE_VISIBILITY',
          id: '123'
        };
        let res = actions.toggleVisibility('123');
        expect(res).toEqual(action);
      });

      it('should generate the ADD_POI action', () => {
        let action = {
          type: 'ADD_POI',
          feature: 'feature'
        };
        let res = actions.addPOI('feature');
        expect(res).toEqual(action);
      });

      it('should generate the ADD_ROUTE action', () => {
        let action = {
          type: 'ADD_ROUTE',
          feature: 'feature'
        };
        let res = actions.addRoute('feature');
        expect(res).toEqual(action);
      });

      it('should generate the UPDATE_GEO_JSON action', () => {
        let action = {
          type: 'UPDATE_GEO_JSON',
          point: 'point',
        };
        expect(actions.updateGeoJSON('point')).toEqual(action);
      });

      it('should generate the REPLACE_GEO_JSON action', () => {
        let action = {
          type: 'REPLACE_GEO_JSON',
          features: 'features',
        };
        expect(actions.replaceGeoJSON('features')).toEqual(action);
      });
    });

    describe('map actions', () => {
      it('should generate the MAP_LOADED action', () => {
          const action = {
            type: 'MAP_LOADED',
          };
          expect(actions.mapLoaded()).toEqual(action);
      });

      it('should generate the UPDATE_MAP action', () => {
        let action = {
          type: 'UPDATE_MAP'
        };
        let res = actions.updateMap();
        expect(res).toEqual(action);
      });

      it('should generate the COMPLETE_UPDATE_MAP action', () => {
        let action = {
          type: 'COMPLETE_UPDATE_MAP'
        };
        let res = actions.completeUpdateMap();
        expect(res).toEqual(action);
      });

      it('should generate the STORE_CENTER action', () => {
        let action = {
          type: 'STORE_CENTER',
          center: 'center',
        };
        expect(actions.storeCenter('center')).toEqual(action);
      });
    });

    describe('searchText actions', () => {
      it('should generate the UPDATE_SEARCH_TEXT action', () => {
        let action = {
          type: 'UPDATE_SEARCH_TEXT',
          updateSearchText: 'updateSearchText',
        };
        expect(actions.setUpdateSearchText('updateSearchText')).toEqual(action);
      });

      it('should generate the SET_POI_SEARCH_TEXT action', () => {
        let action = {
          type: 'SET_POI_SEARCH_TEXT',
          POISearchText: 'chalan'
        };
        let res = actions.setPOISearchText('chalan');
        expect(res).toEqual(action);
      });

      it('should generate the SET_ROUTES_SEARCH_TEXT action', () => {
        let action = {
          type: 'SET_ROUTES_SEARCH_TEXT',
          RoutesSearchText: 'chalan'
        };
        let res = actions.setRoutesSearchText('chalan');
        expect(res).toEqual(action);
      });

      it('should generate the SET_TRAIL_SEARCH_TEXT action', () => {
        let action = {
          type: 'SET_TRAIL_SEARCH_TEXT',
          trailSearchText: 'trailSearchText',
        };
        expect(actions.setTrailSearchText('trailSearchText')).toEqual(action);
      });
    });
  });

  //reducers
  describe('reducers', () => {
    describe('userSessionReducer', () => {
      it('should LOGIN', () => {
        let action = {
          type: 'LOGIN',
          xAuth: 'xAuth',
          userId: 'userId',
          email: 'email'
        };
        let state = {};
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.xAuth).toBe(action.xAuth);
        expect(res.userId).toBe(res.userId);
        expect(res.email).toBe(res.email);
      });

      it('should LOGOUT', () => {
        let action = {
          type: 'LOGOUT'
        };

        let state = {
          xAuth: 'xAuth',
          _id: 'userId',
          email: 'email'
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.xAuth).toBe(null);
        expect(res._id).toBe(null);
        expect(res.email).toBe(null);
      });

      it('should TOGGLE VISIBILITY of listed items', () => {
        let action1 = {
          type: 'TOGGLE_VISIBILITY',
          id: 123
        };
        let action2 = {
          type: 'TOGGLE_VISIBILITY',
          id: 10
        };
        let state = {
          visibleFeatures: [10, 1]
        };

        let res = reducers.userSessionReducer(df(state), df(action1));
        expect(res.visibleFeatures.length).toBe(3);
        expect(res.visibleFeatures[2]).toBe(123);
        res = reducers.userSessionReducer(df(res), df(action2));
        expect(res.visibleFeatures.length).toBe(2);
        expect(res.visibleFeatures[1]).toBe(123);
      });

      it('should update the distanceFilter', () => {
        let action = {
          type: 'UPDATE_DISTANCE_FILTER',
          distance: 100,
        };
        let state = {
          distanceFilter: 50
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.distanceFilter).toBe(100);
      });

      it('should UPDATE the user\'s POS', () => {
        const action = {
          type: 'UPDATE_POS',
          position: {
            coords: {
              latitude: 10,
              longitude: 210
            }
          }
        };
        const state = {
          coords: {
            latitude: 15,
            longitude: 215
          }
        };
        const expectation = {
          ...action.position,
          gpsTracking: {
            trueLocation: {
              latitude: 10,
              longitude: 210,
            },
          },
        };
        const res = reducers.userSessionReducer(df(state), df(action));
        expect(res.coords.longitude).toBeA('number');
        expect(res.coords.latitude).toBeA('number');
        expect(res.coords.longitude).toNotEqual(state.coords.longitude);
        expect(res.coords.latitude).toNotEqual(state.coords.latitude);
        expect(res).toEqual(expectation);
      });

      it('should TOGGLE the MAP CENTERING state', () => {
        let action = {
          type: 'TOGGLE_MAP_CENTERING'
        };
        let state = {
          mapCentering: false
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.mapCentering).toBe(true);
      });

      it('should set the TRACK_ROUTE state', () => {
        let action = {
          type: 'TRACK_ROUTE'
        };
        let state = {
          trackingRoute: false
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.trackingRoute).toBe(true);
      });

      it('should unset the TRACK_ROUTE state', () => {
        let action = {
          type: 'STOP_TRACKING_ROUTE'
        };
        let state = {
          trackingRoute: true
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.trackingRoute).toBe(false);
      });

      it('should CLEAR the ROUTE LIST', () => {
        let action = {
          type: 'CLEAR_ROUTE_LIST'
        };
        let state = {
          routeList: [
            [
              1, 1,
            ],
            [
              2, 2,
            ],
            [
              3, 3,
            ],
          ]
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.routeList).toEqual([]);
      });

      it('should ADD a position TO the ROUTE LIST', () => {
        let action = {
          type: 'ADD_TO_ROUTE_LIST',
          position: {
            coords: {
              latitude: 10,
              longitude: 210
            }
          }
        };
        let state = {
          routeList: []
        };
        let res = reducers.userSessionReducer(df(state), df(action));
        expect(res.routeList).toBeA('array');
        expect(res.routeList.length).toBe(1);
        expect(res.routeList[0]).toBeA('array');
        expect(res.routeList[0][0]).toBe(210);
        expect(res.routeList[0][1]).toBe(10);
      });

      it('should STOP tracking GPS through navigator.geolocation', () => {
        const action = {type: 'STOP_GPS'};
        const state = {
          gpsTracking: {
            watcher: 'watcher',
            mode: 'native',
          },
        };
        window.navigator.geolocation = {
          clearWatch: sinon.spy(),
        };
        const res = reducers.userSessionReducer(df(state), df(action));
        expect(res.gpsTracking.mode).toBe('ipinfo');
        expect(res.gpsTracking.watcher).toBe(null);
        sinon.assert.calledWith(window.navigator.geolocation.clearWatch, 'watcher');
      });
    });

    describe('trailsReducer', () => {
      it('should DISPLAY TRAILS belonging to the logged in user', () => {
        let action = {
          type: 'DISPLAY_TRAILS',
          trails: [1, 2, 3]
        };
        let state = {
          myTrails: []
        };

        let res = reducers.trailsReducer(df(state), df(action));
        expect(res.myTrails.length).toBe(3);
        expect(res.myTrails[0]).toBe(1);
      });

      it('should CLEAR currently displayed TRAILS', () => {
        let action = {
          type: 'CLEAR_TRAILS'
        };
        let state = {
          myTrails: [1, 2, 3]
        };
        let res = reducers.trailsReducer(df(state), df(action));
        expect(res.myTrails.length).toBe(0);
      });

      it('should SAVE a TRAIL', () => {
        let action = {
          type: 'SAVE_TRAIL',
          name: 'name',
          desc: 'desc',
          list: [
            {
              type: 'Feature',
              properties: {
                'stroke': '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                'name': 'Chalan Kiya to Kannat Tabla Connector',
                'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the' +
                    ' Chalan Kiya ravine',
                'condition': 'Uncut, overgrown',
                'last': 'Dec 2015',
                'displayed': false,
                'id': '1'
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [
                    -214.27445769309995, 15.167432624111209,
                  ],
                  [
                    -214.27433967590332, 15.167339428181535,
                  ],
                  [
                    -214.27423238754272, 15.16729800775516,
                  ],
                  [
                    -214.27410364151, 15.167266942430045,
                  ],
                  [
                    -214.27393198013303, 15.167173746427308,
                  ],
                  [
                    -214.27384614944458, 15.16707019526498,
                  ],
                  [
                    -214.27374958992004, 15.1669459338032,
                  ],
                  [
                    -214.2737603187561, 15.166790606873256,
                  ],
                  [
                    -214.27362084388733, 15.166666345247119,
                  ],
                  [
                    -214.27348136901855, 15.166593859264797,
                  ],
                  [
                    -214.27334189414978, 15.166583504122432,
                  ],
                  [
                    -214.2730736732483, 15.1665627938362,
                  ],
                  [
                    -214.27295565605164, 15.166511018111713,
                  ],
                  [
                    -214.27278399467468, 15.166500662965289,
                  ],
                  [
                    -214.27260160446164, 15.16647995267094,
                  ],
                  [
                    -214.2724084854126, 15.166438532076121,
                  ],
                  [
                    -214.27226901054382, 15.16641782177568,
                  ],
                  [
                    -214.27207589149472, 15.1663764011687,
                  ],
                  [
                    -214.27189350128174, 15.166283204773304,
                  ],
                  [
                    -214.2716896533966, 15.166148587685205,
                  ],
                  [
                    -214.27155017852783, 15.166127877356354,
                  ],
                  [
                    -214.27136778831482, 15.166179653174693,
                  ],
                  [
                    -214.2711532115936, 15.166210718659611,
                  ],
                  [
                    -214.27094936370847, 15.166231428980334,
                  ],
                  [
                    -214.27080988883972, 15.166190008336828,
                  ],
                  [
                    -214.27067041397092, 15.16606574635761,
                  ],
                  [
                    -214.2705202102661, 15.16600361534061,
                  ],
                  [
                    -214.27037000656128, 15.165972549825248,
                  ],
                ]
              }
            }, {
              type: 'Feature',
              properties: {
                'marker-color': '#7e7e7e',
                'marker-size': 'medium',
                'marker-symbol': '',
                'name': 'Concrete Jesus',
                'desc': 'Concrete statue of Jesus at the peak of Mt. Tapotchau',
                'condition': 'Rough dirt road, easy access on foot',
                'last': 'June 2016',
                'displayed': false,
                'id': '2'
              },
              geometry: {
                type: 'Point',
                coordinates: [-214.2563098669052, 15.18629359866948]
              }
            }, {
              type: 'Feature',
              properties: {
                'marker-color': '#7e7e7e',
                'marker-size': 'medium',
                'marker-symbol': '',
                'name': 'Rabbit Hole',
                'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
                'condition': 'Rope in good condition',
                'last': 'June 2014',
                'displayed': false,
                'id': '4'
              },
              geometry: {
                type: 'Point',
                coordinates: [-214.25509214401245, 15.10071455043649]
              }
            },
          ]
        };
        let state = {
          myTrails: []
        };

        let res = reducers.trailsReducer(df(state), df(action));
        expect(res.myTrails).toExist();
        expect(res.myTrails.length).toBe(1);
        expect(res.myTrails[0]).toBeA('object');
        expect(res.myTrails[0].name).toEqual('name');
        expect(res.myTrails[0].desc).toEqual('desc');
        expect(res.myTrails[0].list).toEqual(action.list);
      });
    });

    describe('mapReducer', () => {
      it('should register that MAP is LOADED', () => {
        const state = {
          loaded: false,
        };
        const action = {
          type: 'MAP_LOADED',
        };

        expect(reducers.mapReducer(df(state), df(action)).loaded).toEqual(true);
      });

      it('should set the UPDATE MAP value', () => {
        let action = {
          type: 'UPDATE_MAP'
        };
        let state = {
          update: false
        };
        let res = reducers.mapReducer(df(state), df(action));
        expect(res.update).toBe(true);
      });

      it('should reset the UPDATE MAP value when COMPLETE', () => {
        let action = {
          type: 'COMPLETE_UPDATE_MAP'
        };
        let state = {
          update: true
        };
        let res = reducers.mapReducer(df(state), df(action));
        expect(res.update).toBe(false);
      });

      it('should STORE the map\'s CENTER coordinates', () => {
        let action = {
          type: 'STORE_CENTER',
          center: [
            0, 1,
          ],
        };
        let state = {
          center: [null, null]
        };
        let res = reducers.mapReducer(df(state), df(action));
        expect(res.center).toEqual([0, 1]);
      });
    });

    describe('searchTextReducer', () => {
      it('should set updateSearchText', () => {
        let action = {
          type: 'UPDATE_SEARCH_TEXT',
          updateSearchText: 'search'
        };
        let state = {
          updateSearchText: ''
        };

        let res = reducers.searchTextReducer(df(state), df(action));
        expect(res.updateSearchText).toEqual(action.updateSearchText);
      });

      it('should set POISearchText', () => {
        let action = {
          type: 'SET_POI_SEARCH_TEXT',
          POISearchText: 'search'
        };
        let state = {
          POISearchText: ''
        };

        let res = reducers.searchTextReducer(df(state), df(action));
        expect(res.POISearchText).toEqual(action.POISearchText);
      });

      it('should set RoutesSearchText', () => {
        let action = {
          type: 'SET_ROUTES_SEARCH_TEXT',
          RoutesSearchText: 'search'
        };
        let state = {
          RoutesSearchText: ''
        };

        let res = reducers.searchTextReducer(df(state), df(action));
        expect(res.RoutesSearchText).toEqual(action.RoutesSearchText);
      });

      it('should set trailSearchText', () => {
        let action = {
          type: 'SET_TRAIL_SEARCH_TEXT',
          trailSearchText: 'search'
        };
        let state = {
          trailSearchText: ''
        };

        let res = reducers.searchTextReducer(df(state), df(action));
        expect(res.trailSearchText).toEqual(action.trailSearchText);
      });
    });

    describe('geoJSONReducer', () => {
      it('should ADD new POIs to the store', () => {
        let action = {
          type: 'ADD_POI',
          feature: 'feature'
        };
        let state = {
          type: 'FeatureCollection',
          features: []
        };
        let res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(1);
        expect(res.features[0]).toBe(action.feature);
      });

      it('should ADD new ROUTEs to the store', () => {
        let action = {
          type: 'ADD_ROUTE',
          feature: 'feature'
        };
        let state = {
          type: 'FeatureCollection',
          features: []
        };
        let res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(1);
        expect(res.features[0]).toBe(action.feature);
      });

      it('should UPDATE existing GEOJSON data', () => {
        let action = {
          type: 'UPDATE_GEO_JSON',
          point: {
            _id: 100,
            name: 'Tom'
          }
        };
        let state = {
          features: [
            {
              _id: 100,
              name: 'Joe'
            }, {
              _id: 102,
              name: 'Chelsea'
            },
          ]
        };
        let res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(2);
        expect(res.features[0].name).toBe('Chelsea');
        expect(res.features[1].name).toBe('Tom');
        expect(res.features[1]._id).toBe(100);
      });

      it('should REPLACE existing GEOJSON data', () => {
        let action = {
          type: 'REPLACE_GEO_JSON',
          features: [
            {
              _id: 102,
              name: 'Tom'
            }, {
              _id: 103,
              name: 'Ein'
            },
            {
              _id: 104,
              name: 'Jose',
            },
          ],
        };

        let state = {
          features: [
            {
              _id: 100,
              name: 'Joe',
            }, {
              _id: 101,
              name: 'Ria',
            },
          ]
        };

        let res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(3);
        expect(res.features[0].name).toBe('Tom');
        expect(res.features[1].name).toBe('Ein');
        expect(res.features[1]._id).toBe(103);
      });
    });
  });
});
