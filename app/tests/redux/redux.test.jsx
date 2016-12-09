/*global describe it*/
import expect from 'expect';
import df from 'deep-freeze-strict';

import * as actions from 'actions';
import * as reducers from 'reducers';

describe('redux', () => {

  //store
  describe('configureStore', () => {});

  //actions
  describe('actions', () => {
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
        pos: 'pos',
        name: 'name',
        desc: 'desc',
        cond: 'cond',
        date: 'date'
      };
      var res = actions.addPOI('pos', 'name', 'desc', 'cond', 'date');
      expect(res).toEqual(action);
    });

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

  //reducers
  describe('reducers', () => {
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
    });

    describe('geoJSONReducer', () => {
      it('should toggle visibility of POI', () => {
        var action = {
          type: 'TOGGLE_VISIBILITY',
          id: '123'
        };
        var geoJSON = {
          features: [
            {
              properties: {
                'id': '123',
                'displayed': true
              }
            }
          ]
        };
        var res = reducers.geoJSONReducer(df(geoJSON), df(action));
        expect(res.features[0].properties.displayed).toBe(false);
      });

      it('should ADD new POIs to the store', () => {
        var action = {
          type: 'ADD_POI',
          pos: {
            coords: {
              longitude: 145,
              latitude: 15
            }
          },
          name: 'Test Point',
          desc: 'Description',
          cond: 'Condition',
          date: new Date(2016, 11, 25, 0, 0, 0)
        };
        var state = {
          type: 'FeatureCollection',
          features: []
        };

        var res = reducers.geoJSONReducer(df(state), df(action));
        expect(res.features.length).toBe(1);
        expect(res.features[0].properties.name).toBe(action.name);
        expect(res.features[0].properties.desc).toBe(action.desc);
        expect(res.features[0].properties.condition).toBe(action.cond);
        expect(res.features[0].properties.last).toBe('Dec 2016');
        expect(res.features[0].geometry.coordinates[0]).toBe(-215);
        expect(res.features[0].geometry.coordinates[1]).toBe(15);
      });
    });

    describe('searchTextReducer', () => {});
  });
});
