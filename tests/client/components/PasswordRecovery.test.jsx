/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

/*----------Components----------*/
import {PasswordRecovery} from 'PasswordRecovery';

describe('PasswordRecovery', () => {
  it('should exist', () => {
    expect(PasswordRecovery).toExist();
  });

  it('should render without errors', (done) => {
    try {
      TestUtils.renderIntoDocument(<PasswordRecovery />);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should send a reset password request for a valid email', () => {
    const pwRecov = TestUtils.renderIntoDocument(<PasswordRecovery />);
    pwRecov.refs.email.value = 'test@test.com';
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    pwRecov.resetPassword();
    expect(requests.length).toBe(1);
    expect(requests[0].url).toBe('/users/reset');
    expect(requests[0].method).toBe('POST');
    expect(requests[0].requestHeaders['Content-type']).toBe('application/json;charset=utf-8');
    expect(requests[0].requestBody).toBe(JSON.stringify({email: 'test@test.com'}));
    xhr.restore();
  });

  it('should NOT send a reset password requst for an invalid email', () => {
    const pwRecov = TestUtils.renderIntoDocument(<PasswordRecovery />);
    pwRecov.refs.email.value = 'testtest.com';
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    pwRecov.resetPassword();
    expect(requests.length).toBe(0);
    xhr.restore();
  });
});
