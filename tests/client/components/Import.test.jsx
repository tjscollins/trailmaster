/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {Import} from 'Import';

describe('Import', () => {
  it('should exist', () => {
    expect(Import).toExist();
  });

  it('should render without errors', () => {
    try {
      let base = TestUtils.renderIntoDocument(<Import />);
    } catch (err) {
      expect(err).toNotExist();
    }
  });
});
