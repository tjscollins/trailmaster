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
import {AddPOI} from 'AddPOI';

describe('AddPOI', () => {

  it('should exist', () => {
    expect(AddPOI).toExist();
  });

  it('should render and display add-poi-modal', () => {
    var modalStub = sinon.stub(AddPOI.prototype, 'modal');
    var addPoi = ReactTestUtils.renderIntoDocument(<AddPOI/>);

    var modal = ReactTestUtils.scryRenderedDOMComponentsWithClass(addPoi, 'modal fade');
    var btnInfo = ReactTestUtils.scryRenderedDOMComponentsWithClass(addPoi, 'btn btn-info')[0];
    ReactTestUtils
      .Simulate
      .click(btnInfo);
    sinon
      .assert
      .called(modalStub);
    expect(modal.length).toBe(1);

    modalStub.restore();
  });

  it('should submit data from add-poi-modal', () => {
    var submitStub = sinon.stub(AddPOI.prototype, 'submit');
    var addPoi = ReactTestUtils.renderIntoDocument(<AddPOI/>);

    var btnSubmit = ReactTestUtils.scryRenderedDOMComponentsWithClass(addPoi, 'btn btn-secondary')[0];
    ReactTestUtils
      .Simulate
      .click(btnSubmit);
    sinon
      .assert
      .called(submitStub);

    submitStub.restore();
  });
});
