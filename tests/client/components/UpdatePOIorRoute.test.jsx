/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {UpdatePOIorRoute} from 'UpdatePOIorRoute';

describe('UpdatePOIorRoute', () => {
  it('should exist', () => {
    expect(UpdatePOIorRoute).toExist();
  });

  it('should render without errors', () => {
    try {
      let searchText = {updateSearchText: ''};
      let geoJSON = {features: []};
      let props = {searchText, geoJSON};
      let base = TestUtils.renderIntoDocument(<UpdatePOIorRoute {...props} />);
    } catch (err) {
      expect(err).toNotExist();
    }
  });
});
