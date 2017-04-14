/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {Header} from 'Header';

describe('Header', () => {
  it('should exist', () => {
    expect(Header).toExist();
  });

  it('should manageLoginDisplay', () => {
    let props = {
      userSession: {
        xAuth: false
      },
      userLocation: {
        mapCentering: false
      }
    };
    let header = TestUtils.renderIntoDocument(<Header {...props} />);
    let loggedInDisplay = TestUtils.findRenderedDOMComponentWithClass(header, 'navbar-left');
    expect(/Create Account/.test(loggedInDisplay.innerHTML)
    && /Sign\-in/.test(loggedInDisplay.innerHTML) && !/Log out/.test(loggedInDisplay.innerHTML)).toBe(true);

    props = {
      userSession: {
        xAuth: true
      },
      userLocation: {
        mapCentering: false
      }
    };
    header = TestUtils.renderIntoDocument(<Header {...props} />);
    loggedInDisplay = TestUtils.findRenderedDOMComponentWithClass(header, 'navbar-left');
    expect(/Create Account/.test(loggedInDisplay.innerHTML)
    && /Sign\-in/.test(loggedInDisplay.innerHTML) && !/Log out/.test(loggedInDisplay.innerHTML)).toBe(false);
  });

  it('should toggle the auto-center property', () => {
    const spy = expect.createSpy();
    const props = {
      userSession: {
        xAuth: false
      },
      userLocation: {
        mapCentering: false
      },
      dispatch: spy
    };
    const header = TestUtils.renderIntoDocument(<Header {...props} />);
    const autoCenterDisplay = TestUtils.findRenderedDOMComponentWithClass(header, 'autocenter');
    expect(/Enable Auto\-Center/.test(autoCenterDisplay.innerHTML) && !/Disable/.test(autoCenterDisplay.innerHTML)).toBe(true);

    TestUtils
      .Simulate
      .click(autoCenterDisplay);

    expect(spy).toHaveBeenCalledWith({type: 'TOGGLE_MAP_CENTERING'});
  });
});
