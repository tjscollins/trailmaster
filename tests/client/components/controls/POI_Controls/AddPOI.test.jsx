/*global describe it sinon*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
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
    const modalStub = sinon.stub(AddPOI.prototype, 'modal');
    const addPoi = TestUtils.renderIntoDocument(<AddPOI />);

    const modal = TestUtils.scryRenderedDOMComponentsWithClass(addPoi, 'modal fade');
    const btnInfo = TestUtils.scryRenderedDOMComponentsWithClass(addPoi, 'btn btn-info')[0];
    TestUtils
      .Simulate
      .click(btnInfo);
    sinon
      .assert
      .called(modalStub);
    expect(modal.length).toBe(1);

    modalStub.restore();
  });

  it('should submit data from add-poi-modal', () => {
    const submitStub = sinon.stub(AddPOI.prototype, 'submit');
    const addPoi = TestUtils.renderIntoDocument(<AddPOI />);

    const btnSubmit = TestUtils.scryRenderedDOMComponentsWithClass(addPoi, 'btn btn-secondary')[0];
    TestUtils
      .Simulate
      .click(btnSubmit);
    sinon
      .assert
      .called(submitStub);

    submitStub.restore();
  });
});
