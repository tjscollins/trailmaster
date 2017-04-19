/*global describe it sinon*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import $ from 'jquery';
let jQuery = $;
import * as api from 'TrailmasterAPI';

/*----------Components----------*/
import {Controls} from 'Controls';

import {SearchPOI} from 'SearchPOI';
import {ListPOI} from 'ListPOI';
import {AddPOI} from 'AddPOI';
import {SearchRoutes} from 'SearchRoutes';
import {ListRoutes} from 'ListRoutes';
import {AddRoutes} from 'AddRoutes';
import {SearchTrails} from 'SearchTrails';
import {ListTrails} from 'ListTrails';
import {AddTrails} from 'AddTrails';
import {Tools} from 'Tools';

describe('Controls', () => {
  it('should exist', () => {
    expect(Controls).toExist();
  });

  it('should render all controls components', () => {
    const initialState = {
      geoJSON: {
        type: 'FeatureCollection',
        features: []
      },
      userSession: {
        loading: true,
        visibleFeatures: [],
        distanceFilter: 50,
        trackingRoute: false,
        routeList: [],
        mapCentering: false,
        coords: {
          latitude: 0,
          longitude: 0
        },
        gpsTracking: {
          enable: true,
          watcher: null,
          mock: false
        }
      }
    };
    const store = configure(initialState);
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <Controls />
      </Provider>
    );
    let controls = ReactTestUtils.scryRenderedComponentsWithType(provider, Controls)[0];
    let addPOI = ReactTestUtils.scryRenderedComponentsWithType(controls, AddPOI);
    let listPOI = ReactTestUtils.scryRenderedComponentsWithType(controls, ListPOI);
    let searchPOI = ReactTestUtils.scryRenderedComponentsWithType(controls, SearchPOI);
    let addRoutes = ReactTestUtils.scryRenderedComponentsWithType(controls, AddRoutes);
    let listRoutes = ReactTestUtils.scryRenderedComponentsWithType(controls, ListRoutes);
    let searchRoutes = ReactTestUtils.scryRenderedComponentsWithType(controls, SearchRoutes);
    let addTrails = ReactTestUtils.scryRenderedComponentsWithType(controls, AddTrails);
    let listTrails = ReactTestUtils.scryRenderedComponentsWithType(controls, ListTrails);
    let searchTrails = ReactTestUtils.scryRenderedComponentsWithType(controls, SearchTrails);
    let tools = ReactTestUtils.scryRenderedComponentsWithType(controls, Tools);

    // expect(addPOI.length).toBe(1);
    expect(listPOI.length).toBe(1);
    expect(searchPOI.length).toBe(1);

    // expect(addRoutes.length).toBe(1);
    expect(listRoutes.length).toBe(1);
    expect(searchRoutes.length).toBe(1);

    expect(addTrails.length).toBe(1);
    expect(listTrails.length).toBe(1);
    expect(searchTrails.length).toBe(1);

    expect(tools.length).toBe(1);
  });

  it.skip('should call toggleUI method when the hide-arrow is clicked', () => {
    let toggleUISpy = sinon.spy(api, 'toggleUI');
    const initialState = {
      geoJSON: {
        type: 'FeatureCollection',
        features: []
      },
      userSession: {
        loading: true,
        visibleFeatures: [],
        distanceFilter: 50,
        trackingRoute: false,
        routeList: [],
        mapCentering: false,
        coords: {
          latitude: 0,
          longitude: 0
        },
        gpsTracking: {
          enable: true,
          watcher: null,
          mock: false
        }
      }
    };
    const store = configure(initialState);
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <Controls />
      </Provider>
    );
    let hideArrow = ReactTestUtils.scryRenderedDOMComponentsWithClass(provider, 'fa-arrow-left')[0];
    ReactTestUtils
      .Simulate
      .click(hideArrow);
    sinon
      .assert
      .called(toggleUISpy);
  });

  // describe('Controls.hide()', () => {
  //   it('should change the classes on #hide-arrow', () => {
  //     //How to Mock jquery so this is testable?
  //
  //     let store = configure({});
  //     let provider = ReactTestUtils.renderIntoDocument(
  //       <Provider store={store}><Controls/></Provider>
  //     );
  //     let controls = ReactTestUtils.scryRenderedComponentsWithType(provider, Controls)[0];
  //     controls.hide();
  //     let div = ReactTestUtils.scryRenderedDOMComponentsWithClass(controls, 'controls')[0];
  //     expect($(div).hasClass('hide-left')).toBe(true);
  //   });
  // });
});
