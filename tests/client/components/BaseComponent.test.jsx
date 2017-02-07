/*global describe it*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

export class TestComponent extends BaseComponent {
  constructor() {
    super();
    // this.testValue = true;
  }
  testValue() {
    return true;
  }
  testMethod() {
    return this.testValue();
  }
  render() {
    if(this.testMethod()) {
      return <div />;
    }
    return <p />;
  }
}

describe('BaseComponent', () => {
  it('should exist', () => {
    expect(BaseComponent).toExist();
  });

  describe('BaseComponent._bind', () => {
    it('should bind methods with this = BaseComponent', () => {
      let testComponent = TestUtils.renderIntoDocument(<TestComponent />);
      // console.log(testComponent);
      expect(testComponent.render().type).toBe('p');
      testComponent._bind('testMethod');
      expect(testComponent.render().type).toBe('div');
    });
  });
});
