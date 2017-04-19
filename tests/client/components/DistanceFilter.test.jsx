/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

/*----------Components----------*/
import {DistanceFilter} from 'DistanceFilter';

describe('DistanceFilter', () => {
  it('should exist', () => {
    expect(DistanceFilter).toExist();
  });

  it('should render without errors', (done) => {
    try {
      const distanceFilter = 50;
      TestUtils.renderIntoDocument(<DistanceFilter dispatch={()=>{}} userSession={{distanceFilter}} />);
    } catch (err) {
      expect(err).toNotExist();
      done(err);
    }
    done();
  });
});
