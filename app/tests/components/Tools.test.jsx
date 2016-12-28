/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {Tools} from 'Tools';

describe('Tools', () => {
  it('should exist', () => {
    expect(Tools).toExist();
  });
});
