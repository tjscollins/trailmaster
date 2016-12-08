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

    it('should generate the SET_POI_SEARCH_TEXT action', () => {
      var action = {
        type: 'SET_POI_SEARCH_TEXT',
        POISearchText: 'chalan'
      };
      var res = actions.setPOISearchText('chalan');
      expect(res).toEqual(action);
    });
  });

  //reducers
  describe('reducers', () => {
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
    });
  });
});
