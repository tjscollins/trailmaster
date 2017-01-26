/*global describe it sinon*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import $ from 'jquery';
var jQuery = $;

/*----------Components----------*/
import {Controls} from 'Controls';

import {SearchPOI} from 'SearchPOI';
import {ListPOI} from 'ListPOI';
import {AddPOI} from 'AddPOI';
import {SearchRoutes} from 'SearchRoutes';
import {ListRoutes} from 'ListRoutes';
import {AddRoutes} from 'AddRoutes';
import {SearchTrails} from 'SearchTrails';
import {ListTrails} from 'ListTrails';
import {AddTrails} from 'AddTrails';
import {Tools} from 'Tools';

describe('Controls', () => {
  it('should exist', () => {
    expect(Controls).toExist();
  });

  it('should render all controls components', () => {
    var store = configure({});
    var provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}><Controls/></Provider>
    );
    var controls = ReactTestUtils.scryRenderedComponentsWithType(provider, Controls)[0];
    var addPOI = ReactTestUtils.scryRenderedComponentsWithType(controls, AddPOI);
    var listPOI = ReactTestUtils.scryRenderedComponentsWithType(controls, ListPOI);
    var searchPOI = ReactTestUtils.scryRenderedComponentsWithType(controls, SearchPOI);
    var addRoutes = ReactTestUtils.scryRenderedComponentsWithType(controls, AddRoutes);
    var listRoutes = ReactTestUtils.scryRenderedComponentsWithType(controls, ListRoutes);
    var searchRoutes = ReactTestUtils.scryRenderedComponentsWithType(controls, SearchRoutes);
    var addTrails = ReactTestUtils.scryRenderedComponentsWithType(controls, AddTrails);
    var listTrails = ReactTestUtils.scryRenderedComponentsWithType(controls, ListTrails);
    var searchTrails = ReactTestUtils.scryRenderedComponentsWithType(controls, SearchTrails);
    var tools = ReactTestUtils.scryRenderedComponentsWithType(controls, Tools);

    expect(addPOI.length).toBe(1);
    expect(listPOI.length).toBe(1);
    expect(searchPOI.length).toBe(1);

    expect(addRoutes.length).toBe(1);
    expect(listRoutes.length).toBe(1);
    expect(searchRoutes.length).toBe(1);

    expect(addTrails.length).toBe(1);
    expect(listTrails.length).toBe(1);
    expect(searchTrails.length).toBe(1);

    expect(tools.length).toBe(1);
  });

  it('should call Controls.hide method when the hide-arrow is clicked', () => {
    var hideStub = sinon.stub(Controls.prototype, 'hide');
    var store = configure({});
    var provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}><Controls/></Provider>
    );
    var hideArrow = ReactTestUtils.scryRenderedDOMComponentsWithClass(provider, 'fa-arrow-left')[0];
    ReactTestUtils
      .Simulate
      .click(hideArrow);
    sinon
      .assert
      .called(hideStub);
    hideStub.restore();
  });

  // describe('Controls.hide()', () => {
  //   it('should change the classes on #hide-arrow', () => {
  //     //How to Mock jquery so this is testable?
  //
  //     var store = configure({});
  //     var provider = ReactTestUtils.renderIntoDocument(
  //       <Provider store={store}><Controls/></Provider>
  //     );
  //     var controls = ReactTestUtils.scryRenderedComponentsWithType(provider, Controls)[0];
  //     controls.hide();
  //     var div = ReactTestUtils.scryRenderedDOMComponentsWithClass(controls, 'controls')[0];
  //     expect($(div).hasClass('hide-left')).toBe(true);
  //   });
  // });
});
