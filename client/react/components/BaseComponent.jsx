/*----------Modules----------*/
import React, {Component} from 'react';

/**
 * Base Component class to provide _bind to React Components
 */
class BaseComponent extends Component {
  /**
   * _bind - binds this on all methods provided as strings to _bind
   *
   */
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }

  render() {
    return <div />;
  }
}

export default BaseComponent;
