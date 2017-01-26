/*global describe it sinon*/

/*----------Modules----------*/
import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import $ from 'jquery';

/*----------Components----------*/
import {ListPOI} from 'ListPOI';

describe('ListPOI', () => {
  it('should exist', () => {
    expect(ListPOI).toExist();
  });

  it('should render a list of geoJSON points', () => {
    var listPointsStub = sinon.stub(ListPOI.prototype, 'listPoints');
    var listPoi = ReactTestUtils.renderIntoDocument(<ListPOI/>);
    sinon
      .assert
      .called(listPointsStub);
  });
});
