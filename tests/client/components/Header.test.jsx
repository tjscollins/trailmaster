/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import {Header} from 'Header';

describe('Header', () => {
  it('should exist', () => {
    expect(Header).toExist();
  });

  it('should manageLoginDisplay', () => {
    var props = {
      userSession: {
        xAuth: false
      },
      userLocation: {
        mapCentering: false
      }
    };
    var header = ReactTestUtils.renderIntoDocument(<Header {...props}/>);
    var loggedInDisplay = ReactTestUtils.findRenderedDOMComponentWithClass(header, 'navbar-left');
    expect(/Create Account/.test(loggedInDisplay.innerHTML) && /Sign\-in/.test(loggedInDisplay.innerHTML) && !/Log out/.test(loggedInDisplay.innerHTML)).toBe(true);

    props = {
      userSession: {
        xAuth: true
      },
      userLocation: {
        mapCentering: false
      }
    };
    header = ReactTestUtils.renderIntoDocument(<Header {...props}/>);
    loggedInDisplay = ReactTestUtils.findRenderedDOMComponentWithClass(header, 'navbar-left');
    expect(/Create Account/.test(loggedInDisplay.innerHTML) && /Sign\-in/.test(loggedInDisplay.innerHTML) && !/Log out/.test(loggedInDisplay.innerHTML)).toBe(false);

  });

  it('should toggle the auto-center property', () => {
    var spy = expect.createSpy();
    var props = {
      userSession: {
        xAuth: false
      },
      userLocation: {
        mapCentering: false
      },
      dispatch: spy
    };
    var header = ReactTestUtils.renderIntoDocument(<Header {...props}/>);
    var autoCenterDisplay = ReactTestUtils.findRenderedDOMComponentWithClass(header, 'autocenter');
    expect(/Enable Auto\-Center/.test(autoCenterDisplay.innerHTML) && !/Disable/.test(autoCenterDisplay.innerHTML)).toBe(true);

    ReactTestUtils
      .Simulate
      .click(autoCenterDisplay);

    expect(spy).toHaveBeenCalledWith({type: 'TOGGLE_MAP_CENTERING'});
  });
});
