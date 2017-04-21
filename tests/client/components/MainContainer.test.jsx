/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import ConnectedMC, {MainContainer} from 'MainContainer';

describe('MainContainer', () => {
  it('should exist', () => {
    expect(MainContainer).toExist();
    expect(ConnectedMC).toExist();
  });
});
