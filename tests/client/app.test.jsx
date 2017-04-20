/*global describe it*/
//Initialize testing environment with modules and polyfills
/*----------Modules----------*/
import expect from 'expect';


import 'bootstrap';
(function polyfills() {
  // Because PhantomJS is way behind on basic ES6 features
  if (!window.Promise) {
    require('es6-promise/auto');
  }
  if (!Array.isArray) {
    window.Array.isArray = function(arg) {
      return Object
        .prototype
        .toString
        .call(arg) === '[object Array]';
    };
  }
  Number.isNaN = Number.isNaN || function(value) {
    return value !== value;
  };
})();

describe('App', () => {
  it('should properly run tests', () => {
    expect(1).toBe(1);
  });
});
