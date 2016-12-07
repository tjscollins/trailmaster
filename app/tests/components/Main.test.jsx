/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import Main from 'Main';

describe('Main', () => {
  it('should exist', () => {
    expect(Main).toExist();
  });

  it('should render the <Header/> element', () => {
    const main = TestUtils.renderIntoDocument(<Main/>);
    const $el = $(ReactDOM.findDOMNode(main)).children('Header');
    expect($el).toExist();
  });

  it('should render the <Controls/> element', () => {
    const main = TestUtils.renderIntoDocument(<Main/>);
    const $el = $(ReactDOM.findDOMNode(main)).children('Controls');
    expect($el).toExist();
  });

  it('should render the <MapViewer/> element', () => {
    const main = TestUtils.renderIntoDocument(<Main/>);
    const $el = $(ReactDOM.findDOMNode(main)).children('MapViewer');
    expect($el).toExist();
  });
});
