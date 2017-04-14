/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {PasswordRecovery} from 'PasswordRecovery';

describe('PasswordRecovery', () => {
  it('should exist', () => {
    expect(PasswordRecovery).toExist();
  });

  it('should render without errors', () => {
    try {
      let base = TestUtils.renderIntoDocument(<PasswordRecovery />);
    } catch (err) {
      expect(err).toNotExist();
    }
  });
});
