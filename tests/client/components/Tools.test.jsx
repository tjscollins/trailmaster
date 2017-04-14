/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {Tools} from 'Tools';

describe('Tools', () => {
  it('should exist', () => {
    expect(Tools).toExist();
  });

  it('should render without errors', () => {
    try {
      let base = TestUtils.renderIntoDocument(<Tools />);
    } catch (err) {
      expect(err).toNotExist();
    }
  });
});
