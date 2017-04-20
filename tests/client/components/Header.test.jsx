/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import $ from 'jquery';

/*----------Components----------*/
import ConnectedH, {Header} from 'Header';

describe('Header', () => {
  it('should exist', () => {
    expect(Header).toExist();
  });

    it('should render without errors', (done) => {
      try {
        TestUtils.renderIntoDocument(
          <Provider store={configure()}>
            <ConnectedH />
          </Provider>);
      } catch (err) {
        expect(err).toNotExist();
        done(err);
      }
      done();
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

  it('should send a LOGOUT request to the server', () => {
    const ajax = sinon.stub($, 'ajax');
    const dispatch = sinon.spy();
    const props = {
      userSession: {
        xAuth: false,
        mapCentering: true
      },
      dispatch,
    };
    const header = TestUtils.renderIntoDocument(<Header {...props} />);
    header.logout();
    const ajaxOptions = ajax.getCall(0).args[0];
    const request = {setRequestHeader: sinon.stub()};
    ajaxOptions.beforeSend(request);
    ajaxOptions.success();
    ajaxOptions.error('jqXHR', 'status', 'err');
    expect(ajax.calledOnce).toBe(true);
    expect(ajaxOptions.url).toBe('/users/logout');
    expect(ajaxOptions.type).toBe('GET');
    expect(dispatch.calledTwice).toBe(true);
    expect(dispatch.getCall(0).args[0].type).toBe('LOGOUT');
    expect(dispatch.getCall(1).args[0].type).toBe('CLEAR_TRAILS');
    ajax.restore();
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
