/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import ConnectedL, {Login} from 'Login';

describe('Login', () => {
  it('should exist', () => {
    expect(Login).toExist();
  });

  it('should render without errors', (done) => {
    try {
      TestUtils.renderIntoDocument(<Provider store={configure()}><ConnectedL /></Provider>);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should send requests to create new accounts', () => {
    const ajaxPromise = {
      done: function(callback) {
        expect(typeof callback === 'function');
        expect(callback.length === 3).toBe(true);
        const res = '';
        const status = '';
        const jqXHR = {
          getResponseHeader: (str) => str,
          responseText: '{"_id": "1234"}',
        };
        callback(res, status, jqXHR);
      },
      fail: function(callback) {
        expect(typeof callback === 'function');
        expect(callback.length === 3).toBe(true);
        callback({}, '', '');
      },
    };
    const ajax = sinon.stub($, 'ajax').returns(ajaxPromise);
    const dispatch = sinon.spy().withArgs({type: 'LOGIN', xAuth: 'x-auth', userId: '1234', email: 'test@test.com'});
    const login = TestUtils.renderIntoDocument(<Login dispatch={dispatch} />);
    login.refs.createEmail.value='test@test.com';
    login.create();
    expect(ajax.calledOnce).toBe(true);
    expect(dispatch.calledOnce).toBe(true);
    ajax.restore();
  });
  it('should send login requests', () => {
    const ajaxPromise = {
      done: function(callback) {
        expect(typeof callback === 'function');
        expect(callback.length === 3).toBe(true);
        const res = '';
        const status = '';
        const jqXHR = {
          getResponseHeader: (str) => str,
          responseText: '{"_id": "1234"}',
        };
        callback(res, status, jqXHR);
      },
      fail: function(callback) {
        expect(typeof callback === 'function');
        expect(callback.length === 3).toBe(true);
        callback({}, '', '');
      },
    };
    const ajax = sinon.stub($, 'ajax').returns(ajaxPromise);
    const dispatch = sinon.spy().withArgs({type: 'LOGIN', xAuth: 'x-auth', userId: '1234', email: 'test@test.com'});
    const login = TestUtils.renderIntoDocument(<Login dispatch={dispatch} />);
    login.refs.password = {value: '123'};
    login.refs.email = {value: 'test@test.com'};
    login.login({preventDefault: () => {}});
    expect(ajax.calledOnce).toBe(true);
    ajax.restore();
  });
});
