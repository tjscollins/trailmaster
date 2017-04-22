/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import ConnectedML, {MockLocation} from 'MockLocation';

describe('MockLocation', () => {
  it('should exist', () => {
    expect(MockLocation).toExist();
    expect(ConnectedML).toExist();
  });

  it('should render without errors', (done) => {
    try {
      TestUtils.renderIntoDocument(
        <Provider store={configure()}>
          <ConnectedML />
        </Provider>
      );
      done();
    } catch (error) {
      done(error);
    }
  });

  it('should submit mock gps coordinates to the redux store', () => {
    const dispatch = sinon.spy();
    const event = {
      preventDefault: sinon.spy(),
    };
    const userSession = {
      coords: {
        latitude: 0,
        longitude: 0,
      },
    };
    const mockedPosition = {
      coords: {
        latitude: 34.1184,
        longitude: -118.3004,
      },
    };
    const mockLocation = TestUtils.renderIntoDocument(
      <MockLocation dispatch={dispatch} userSession={userSession} />
    );
    mockLocation.refs.latitude.value = '34.1184';
    mockLocation.refs.longitude.value = '-118.3004';
    mockLocation.submit(event);
    expect(dispatch.withArgs({type: 'MOCK_POS', position: mockedPosition}).calledOnce).toBe(true);
    expect(dispatch.withArgs({type: 'UPDATE_MAP'}).calledOnce).toBe(true);
  });

  it('should NOT submit invalid gps coordinates to the redux store', () => {
    const dispatch = sinon.spy();
    const event = {
      preventDefault: sinon.spy(),
    };
    const userSession = {
      coords: {
        latitude: 0,
        longitude: 0,
      },
    };
    const mockLocation = TestUtils.renderIntoDocument(
      <MockLocation dispatch={dispatch} userSession={userSession} />
    );
    mockLocation.refs.latitude.value = '34';
    mockLocation.refs.longitude.value = '-218.3004';
    mockLocation.submit(event);
    expect(dispatch.called).toBe(false);
    mockLocation.refs.longitude.value = '-a18.3004';
    mockLocation.submit(event);
    expect(dispatch.called).toBe(false);
    mockLocation.refs.longitude.value = '-118.3004';
    mockLocation.submit(event);
    expect(dispatch.called).toBe(true);
  });

  it('should unMock a mocked position from the redux store', () => {
    const userSession = {
      coords: {
        latitude: 0,
        longitude: 0,
      },
    };
    const dispatch = sinon.spy();
    const reload = sinon.stub(window.location, 'reload');
    const event = {
      preventDefault: sinon.spy(),
    };
    const mockLocation = TestUtils.renderIntoDocument(
      <MockLocation dispatch={dispatch} userSession={userSession} />
    );
    mockLocation.clear(event);
    sinon.assert.calledOnce(reload);
    sinon.assert.notCalled(dispatch);
    reload.restore();
  });
});
