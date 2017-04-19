/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

/*----------Components----------*/
import {FAQ} from 'FAQ';

describe('FAQ', () => {
  it('should exist', () => {
    expect(FAQ).toExist();
  });

  it('should render without errors', (done) => {
    try {
      TestUtils.renderIntoDocument(<FAQ />);
      done();
    } catch (err) {
      done(err);
    }
  });
});
