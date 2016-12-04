/*----------Modules----------*/
import React from 'react';
import BaseComponent from 'BaseComponent';

class Header extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    return (
      <div>
        <h1>Header.jsx</h1>
      </div>
    );
  }
};

export default Header; // <- add me
