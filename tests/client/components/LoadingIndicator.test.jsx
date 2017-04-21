/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import ConnectedLI, {LoadingIndicator} from 'LoadingIndicator';

describe('LoadingIndicator', () => {
  it('should exist', () => {
    expect(LoadingIndicator).toExist();
    expect(ConnectedLI).toExist();
  });
  it('should render without errors', (done) => {
    try {
      TestUtils.renderIntoDocument(<Provider store={configure()}><ConnectedLI /></Provider>);
      done();
    } catch (err) {
      done(err);
    }
  });
  it('should display a loading indicator if props.loading is TRUE', () => {
    const loadingIndicator = TestUtils.renderIntoDocument(<LoadingIndicator loading />);
    const indicator = TestUtils.findRenderedDOMComponentWithClass(loadingIndicator, 'loading-indicator');
    const spinner = TestUtils.findRenderedDOMComponentWithClass(loadingIndicator, 'uil-spin-css');
    expect(indicator).toExist();
    expect(spinner).toExist();
  });
  it('should NOT display a loading indicator if props.loading is FALSE', () => {
    const loadingIndicator = TestUtils.renderIntoDocument(<LoadingIndicator loading={false} />);
    const indicator = TestUtils.scryRenderedDOMComponentsWithClass(loadingIndicator, 'loading-indicator');
    const spinner = TestUtils.scryRenderedDOMComponentsWithClass(loadingIndicator, 'uil-spin-css');
    expect(indicator.length).toBe(0);
    expect(spinner.length).toBe(0);
  });
});
