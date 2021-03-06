/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';


describe('BaseComponent', () => {
  it('should exist', () => {
    expect(BaseComponent).toExist();
  });

  it('should render without errors', () => {
    try {
      let base = TestUtils.renderIntoDocument(<BaseComponent />);
    } catch (err) {
      expect(err).toNotExist();
    }
  });
});
