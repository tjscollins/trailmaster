/*global describe it*/
import expect from 'expect';
import df from 'deep-freeze-strict';

import * as actions from 'actions';
import * as reducers from 'reducers';
// var http = require('http'),
//   mockserver = require('mockserver');
//
// http
//   .createServer(mockserver('app/api/mocks'))
//   .listen('3000');

describe('redux', () => {

  //store
  describe('configureStore', () => {});

  //actions
  describe('actions', () => {
    describe('trails actions', () => {
      it('should generate the SAVE_TRAIL action', () => {
        var action = {
          type: 'SAVE_TRAIL',
          name: 'name',
          desc: 'desc',
          list: 'list'
        };
        var res = actions.saveTrail('list', 'name', 'desc');
        expect(res).toEqual(action);
      });
    });
    describe('userLocation actions', () => {
      it('should generate the UPDATE_POS action', () => {
        var action = {
          type: 'UPDATE_POS',
          position: 'position'
        };
        var res = actions.updatePOS('position');
        expect(res).toEqual(action);
      });

      it('should generate the TOGGLE_MAP_CENTERING action', () => {
        var action = {
          type: 'TOGGLE_MAP_CENTERING'
        };
        var res = actions.toggleMapCentering();
        expect(res).toEqual(action);
      });

      it('should generate the TRACK_ROUTE action', () => {
        var action = {
          type: 'TRACK_ROUTE'
        };
        var res = actions.trackRoute();
        expect(res).toEqual(action);
      });

      it('should generate the STOP_TRACKING_ROUTE action', () => {
        var action = {
          type: 'STOP_TRACKING_ROUTE'
        };
        var res = actions.stopTrackingRoute();
        expect(res).toEqual(action);
      });

      it('should generate the CLEAR_ROUTE_LIST action', () => {
        var action = {
          type: 'CLEAR_ROUTE_LIST'
        };
        var res = actions.clearRouteList();
        expect(res).toEqual(action);
      });

      it('should generate the ADD_TO_ROUTE_LIST action', () => {
        var action = {
          type: 'ADD_TO_ROUTE_LIST',
          position: 'position'
        };
        var res = actions.addToRouteList('position');
        expect(res).toEqual(action);
      });
    });

    describe('geoJSON actions', () => {
      it('should generate the TOGGLE_VISIBILITY action', () => {
        var action = {
          type: 'TOGGLE_VISIBILITY',
          id: '123'
        };
        var res = actions.toggleVisibility('123');
        expect(res).toEqual(action);
      });

      it('should generate the ADD_POI action', () => {
        var action = {
          type: 'ADD_POI',
          feature: 'feature'
        };
        var res = actions.addPOI('feature');
        expect(res).toEqual(action);
      });

      it('should generate the ADD_ROUTE action', () => {
        var action = {
          type: 'ADD_ROUTE',
          feature: 'feature'

        };
        var res = actions.addRoute('feature');
        expect(res).toEqual(action);
      });
    });

    describe('map actions', () => {
      it('should generate the UPDATE_MAP action', () => {
        var action = {
          type: 'UPDATE_MAP'
        };
        var res = actions.updateMap();
        expect(res).toEqual(action);
      });

      it('should generate the COMPLETE_UPDATE_MAP action', () => {
        var action = {
          type: 'COMPLETE_UPDATE_MAP'
        };
        var res = actions.completeUpdateMap();
        expect(res).toEqual(action);
      });
    });

    describe('searchText actions', () => {
      it('should generate the SET_POI_SEARCH_TEXT action', () => {
        var action = {
          type: 'SET_POI_SEARCH_TEXT',
          POISearchText: 'chalan'
        };
        var res = actions.setPOISearchText('chalan');
        expect(res).toEqual(action);
      });

      it('should generate the SET_ROUTES_SEARCH_TEXT action', () => {
        var action = {
          type: 'SET_ROUTES_SEARCH_TEXT',
          RoutesSearchText: 'chalan'
        };
        var res = actions.setRoutesSearchText('chalan');
        expect(res).toEqual(action);
      });
    });

  });

  //reducers
  describe('reducers', () => {
    describe('userSessionReducer', () => {
      it('should LOGIN', () => {
        var action = {
          type: 'LOGIN',
          xAuth: 'xAuth',
          userId: 'userId',
          email: 'email'
        };
        var state = {};
        var res = reducers.userSessionReducer(df(state), df(action));
        expect(res.xAuth).toBe(action.xAuth);
        expect(res.userId).toBe(res.userId);
        expect(res.email).toBe(res.email);
      });

      it('should LOGOUT', () => {
        var action = {
          type: 'LOGOUT'
        };

        var state = {
          xAuth: 'xAuth',
          userId: 'userId',
          email: 'email'
        };
        var state = {};
        var res = reducers.userSessionReducer(df(state), df(action));
        expect(res.xAuth).toNotExist();
        expect(res.userId).toNotExist();
        expect(res.email).toBe(res.email);
      });

      it('should TOGGLE VISIBILITY of listed items', () => {
        var action1 = {
          type: 'TOGGLE_VISIBILITY',
          id: 123
        };
        var action2 = {
          type: 'TOGGLE_VISIBILITY',
          id: 10
        };
        var state = {
          visibleFeatures: [10, 1]
        };

        var res = reducers.userSessionReducer(df(state), df(action1));
        expect(res.visibleFeatures.length).toBe(3);
        expect(res.visibleFeatures[2]).toBe(123);
        res = reducers.userSessionReducer(df(res), df(action2));
        expect(res.visibleFeatures.length).toBe(2);
        expect(res.visibleFeatures[1]).toBe(123);
      });
    });

    describe('trailsReducer', () => {
      it('should DISPLAY TRAILS belonging to the logged in user', () => {
        var action = {
          type: 'DISPLAY_TRAILS',
          trails: [1, 2, 3]
        };
        var state = {
          myTrails: []
        };

        var res = reducers.trailsReducer(df(state), df(action));
        expect(res.myTrails.length).toBe(3);
        expect(res.myTrails[0]).toBe(1);
      });

      it('should CLEAR currently displayed TRAILS', () => {
        var action = {
          type: 'CLEAR_TRAILS'
        };
        var state = {
          myTrails: [1, 2, 3]
        };
        var res = reducers.trailsReducer(df(state), df(action));
        expect(res.myTrails.length).toBe(0);
      });

      it('should SAVE a TRAIL', () => {
        var action = {
          type: 'SAVE_TRAIL',
          name: 'name',
          desc: 'desc',
          list: [
            {
              type: 'Feature',
              properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                name: 'Chalan Kiya to Kannat Tabla Connector',
                desc: 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
                condition: 'Uncut, overgrown',
                last: 'Dec 2015',
                displayed: false,
                id: '1'
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [
                    -214.27445769309995, 15.167432624111209
                  ],
                  [
                    -214.27433967590332, 15.167339428181535
                  ],
                  [
                    -214.27423238754272, 15.16729800775516
                  ],
                  [
                    -214.27410364151, 15.167266942430045
                  ],
                  [
                    -214.27393198013303, 15.167173746427308
                  ],
                  [
                    -214.27384614944458, 15.16707019526498
                  ],
                  [
                    -214.27374958992004, 15.1669459338032
                  ],
                  [
                    -214.2737603187561, 15.166790606873256
                  ],
                  [
                    -214.27362084388733, 15.166666345247119
                  ],
                  [
                    -214.27348136901855, 15.166593859264797
                  ],
                  [
                    -214.27334189414978, 15.166583504122432
                  ],
                  [
                    -214.2730736732483, 15.1665627938362
                  ],
                  [
                    -214.27295565605164, 15.166511018111713
                  ],
                  [
                    -214.27278399467468, 15.166500662965289
                  ],
                  [
                    -214.27260160446164, 15.16647995267094
                  ],
                  [
                    -214.2724084854126, 15.166438532076121
                  ],
                  [
                    -214.27226901054382, 15.16641782177568
                  ],
                  [
                    -214.27207589149472, 15.1663764011687
                  ],
                  [
                    -214.27189350128174, 15.166283204773304
                  ],
                  [
                    -214.2716896533966, 15.166148587685205
                  ],
                  [
                    -214.27155017852783, 15.166127877356354
                  ],
                  [
                    -214.27136778831482, 15.166179653174693
                  ],
                  [
                    -214.2711532115936, 15.166210718659611
                  ],
                  [
                    -214.27094936370847, 15.166231428980334
                  ],
                  [
                    -214.27080988883972, 15.166190008336828
                  ],
                  [
                    -214.27067041397092, 15.16606574635761
                  ],
                  [
                    -214.2705202102661, 15.16600361534061
                  ],
                  [-214.27037000656128, 15.165972549825248]
                ]
              }
            }, {
              type: 'Feature',
              properties: {
                'marker-color': '#7e7e7e',
                'marker-size': 'medium',
                'marker-symbol': '',
                name: 'Concrete Jesus',
                desc: 'Concrete statue of Jesus at the peak of Mt. Tapotchau',
                condition: 'Rough dirt road, easy access on foot',
                last: 'June 2016',
                displayed: false,
                id: '2'
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
                name: 'Rabbit Hole',
                desc: 'Hole descends from top of cliff to bottom, forming climbable cave',
                condition: 'Rope in good condition',
                last: 'June 2014',
                displayed: false,
                id: '4'
              },
              geometry: {
                type: 'Point',
                coordinates: [-214.25509214401245, 15.10071455043649]
              }
            }
          ]
        };
        var state = {
          myTrails: []
        };

        var res = reducers.trailsReducer(df(state), df(action));
        expect(res.myTrails).toExist();
        expect(res.myTrails.length).toBe(1);
        expect(res.myTrails[0]).toBeA('object');
        expect(res.myTrails[0].name).toEqual('name');
        expect(res.myTrails[0].desc).toEqual('desc');
        expect(res.myTrails[0].list).toEqual(action.list);

      });
    });

    describe('userLocationReducer', () => {
      it('should UPDATE the user\'s POS', () => {
        var action = {
          type: 'UPDATE_POS',
          position: {
            coords: {
              latitude: 10,
              longitude: 210
            }
          }
        };
        var state = {
          coords: {
            latitude: 15,
            longitude: 215
          }
        };
        var res = reducers.userLocationReducer(df(state), df(action));
        expect(res.coords.longitude).toBeA('number');
        expect(res.coords.latitude).toBeA('number');
        expect(res.coords.longitude).toNotEqual(state.coords.longitude);
        expect(res.coords.latitude).toNotEqual(state.coords.latitude);
        expect(res).toEqual(action.position);
      });

      it('should TOGGLE the MAP CENTERING state', () => {
        var action = {
          type: 'TOGGLE_MAP_CENTERING'
        };
        var state = {
          mapCentering: false
        };
        var res = reducers.userLocationReducer(df(state), df(action));
        expect(res.mapCentering).toBe(true);
      });

      it('should set the TRACK_ROUTE state', () => {
        var action = {
          type: 'TRACK_ROUTE'
        };
        var state = {
          trackingRoute: false
        };
        var res = reducers.userLocationReducer(df(state), df(action));
        expect(res.trackingRoute).toBe(true);
      });

      it('should unset the TRACK_ROUTE state', () => {
        var action = {
          type: 'STOP_TRACKING_ROUTE'
        };
        var state = {
          trackingRoute: true
        };
        var res = reducers.userLocationReducer(df(state), df(action));
        expect(res.trackingRoute).toBe(false);
      });

      it('should CLEAR the ROUTE LIST', () => {
        var action = {
          type: 'CLEAR_ROUTE_LIST'
        };
        var state = {
          routeList: [
            [
              1, 1
            ],
            [
              2, 2
            ],
            [3, 3]
          ]
        };
        var res = reducers.userLocationReducer(df(state), df(action));
        expect(res.routeList).toEqual([]);
      });

      it('should ADD a position TO the ROUTE LIST', () => {
        var action = {
          type: 'ADD_TO_ROUTE_LIST',
          position: {
            coords: {
              latitude: 10,
              longitude: 210
            }
          }
        };
        var state = {
          routeList: []
        };
        var res = reducers.userLocationReducer(df(state), df(action));
        expect(res.routeList).toBeA('array');
        expect(res.routeList.length).toBe(1);
        expect(res.routeList[0]).toBeA('array');
        expect(res.routeList[0][0]).toBe(210);
        expect(res.routeList[0][1]).toBe(10);
      });
    });

    describe('mapReducer', () => {
      it('should set the UPDATE MAP value', () => {
        var action = {
          type: 'UPDATE_MAP'
        };
        var state = {
          update: false
        };
        var res = reducers.mapReducer(df(state), df(action));
        expect(res.update).toBe(true);
      });

      it('should reset the UPDATE MAP value when COMPLETE', () => {
        var action = {
          type: 'COMPLETE_UPDATE_MAP'
        };
        var state = {
          update: true
        };
        var res = reducers.mapReducer(df(state), df(action));
        expect(res.update).toBe(false);
      });
    });

    describe('searchTextReducer', () => {
      it('should set updateSearchText', () => {
        var action = {
          type: 'UPDATE_SEARCH_TEXT',
          updateSearchText: 'search'
        };
        var state = {
          updateSearchText: ''
        };

        var res = reducers.searchTextReducer(df(state), df(action));
        expect(res.updateSearchText).toEqual(action.updateSearchText);
      });

      it('should set POISearchText', () => {
        var action = {
          type: 'SET_POI_SEARCH_TEXT',
          POISearchText: 'search'
        };
        var state = {
          POISearchText: ''
        };

        var res = reducers.searchTextReducer(df(state), df(action));
        expect(res.POISearchText).toEqual(action.POISearchText);
      });

      it('should set RoutesSearchText', () => {
        var action = {
          type: 'SET_ROUTES_SEARCH_TEXT',
          RoutesSearchText: 'search'
        };
        var state = {
          RoutesSearchText: ''
        };

        var res = reducers.searchTextReducer(df(state), df(action));
        expect(res.RoutesSearchText).toEqual(action.RoutesSearchText);
      });

      it('should set trailSearchText', () => {
        var action = {
          type: 'SET_TRAIL_SEARCH_TEXT',
          trailSearchText: 'search'
        };
        var state = {
          trailSearchText: ''
        };

        var res = reducers.searchTextReducer(df(state), df(action));
        expect(res.trailSearchText).toEqual(action.trailSearchText);
      });
    });

    describe('geoJSONReducer', () => {
      it('should ADD new POIs to the store', () => {
        var action = {
          type: 'ADD_POI',
          feature: 'feature'
        };
        var state = {
          type: 'FeatureCollection',
          features: []
        };
        var res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(1);
        expect(res.features[0]).toBe(action.feature);
      });

      it('should ADD new ROUTEs to the store', () => {
        var action = {
          type: 'ADD_ROUTE',
          feature: 'feature'
        };
        var state = {
          type: 'FeatureCollection',
          features: []
        };
        var res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(1);
        expect(res.features[0]).toBe(action.feature);
      });

      it('should UPDATE existing GEOJSON data', () => {
        var action = {
          type: 'UPDATE_GEO_JSON',
          point: {
            _id: 100,
            name: 'Tom'
          }
        };
        var state = {
          features: [
            {
              _id: 100,
              name: 'Joe'
            }, {
              _id: 102,
              name: 'Chelsea'
            }
          ]
        };
        var res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(2);
        expect(res.features[0].name).toBe('Chelsea');
        expect(res.features[1].name).toBe('Tom');
        expect(res.features[1]._id).toBe(100);
      });
    });
  });
});
