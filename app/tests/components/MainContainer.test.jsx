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

  // var store = configure();
  // it('should render the <Header/> element', () => {
  //   const mainContainer = TestUtils.renderIntoDocument(
  //     <Provider store={store}>
  //       <MainContainer/>
  //     </Provider>
  //   );
  //   const $el = $(ReactDOM.findDOMNode(mainContainer)).children('Header');
  //   expect($el).toExist();
  // });
  //
  // it('should render the <Controls/> element', () => {
  //   const mainContainer = TestUtils.renderIntoDocument(
  //     <Provider store={store}>
  //       <MainContainer/>
  //     </Provider>
  //   );
  //   const $el = $(ReactDOM.findDOMNode(mainContainer)).children('Controls');
  //   expect($el).toExist();
  // });
  //
  // it('should render the <MapViewer/> element', () => {
  //   const mainContainer = TestUtils.renderIntoDocument(
  //     <Provider store={store}>
  //       <MainContainer/>
  //     </Provider>
  //   );
  //   const $el = $(ReactDOM.findDOMNode(mainContainer)).children('MapViewer');
  //   expect($el).toExist();
  // });
});
