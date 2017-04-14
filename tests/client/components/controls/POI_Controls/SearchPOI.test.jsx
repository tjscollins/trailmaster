/*global describe it sinon*/

/*----------Modules----------*/
import expect from 'expect';

import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';
import $ from 'jquery';

/*----------Components----------*/
import {SearchPOI} from 'SearchPOI';

describe('SearchPOI', () => {
  it('should exist', () => {
    expect(SearchPOI).toExist();
  });

  it('should dispatch new POISearchText', () => {
    var spy = expect.createSpy();
    var searchPoi = TestUtils.renderIntoDocument(<SearchPOI dispatch={spy}/>);
    searchPoi.refs.poisearchText.value = 'test';
    TestUtils
      .Simulate
      .change(searchPoi.refs.poisearchText);
    expect(spy).toHaveBeenCalledWith({type: 'SET_POI_SEARCH_TEXT', POISearchText: 'test'});
  });
});
