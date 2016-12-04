/*----------Modules----------*/
import React from 'react';

//Simplifies binding methods to THIS variable in other components
class BaseComponent extends React.Component {
  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }
}

export default BaseComponent;
