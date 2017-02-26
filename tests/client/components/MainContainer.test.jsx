/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import {MainContainer} from 'MainContainer';

describe('MainContainer', () => {
  it('should exist', () => {
    expect(MainContainer).toExist();
  });

  // it('should render without errors', () => {
  //   const initialState = {
  //     map: {
  //       accessToken: 'randomstring'
  //     },
  //     geoJSON: {
  //       type: 'FeatureCollection',
  //       features: [],
  //     },
  //     userSession: {
  //       xAuth: '',
  //       email: '',
  //       _id: '',
  //       visibleFeatures: [],
  //       distanceFilter: 50,
  //       trackingRoute: false,
  //       routeList: [],
  //       mapCentering: false,
  //       coords: {
  //         latitude: 15,
  //         longitude: 145
  //       },
  //     },
  //   };
  //
  //   try {
  //     const mainContainer = TestUtils.renderIntoDocument(
  //       <Provider store={configure(initialState)}>
  //         <MainContainer />
  //       </Provider>
  //     );
  //   } catch (err) {
  //     expect(err).toNotExist();
  //   }
  // });

});
