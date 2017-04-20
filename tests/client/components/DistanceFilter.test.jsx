/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import ConnectedDF, {DistanceFilter} from 'DistanceFilter';

describe('DistanceFilter', () => {
  it('should exist', () => {
    expect(DistanceFilter).toExist();
  });

  it('should render without errors', (done) => {
    try {
      TestUtils.renderIntoDocument(
        <Provider store={configure()}>
          <ConnectedDF />
        </Provider>);
    } catch (err) {
      expect(err).toNotExist();
      done(err);
    }
    done();
  });

  it('should dispatch updateDistanceFilter on submit', () => {
    const distanceFilter = 50;
    const dispatch = sinon.spy();
    let df = TestUtils.renderIntoDocument(<DistanceFilter dispatch={dispatch} userSession={{distanceFilter}} />);
    df.refs.distance.value = '100';
    let submit = TestUtils.findRenderedDOMComponentWithClass(df, 'btn-default');
    TestUtils.Simulate.click(submit);
    expect(dispatch.calledOnce).toBe(true);
  });
});
