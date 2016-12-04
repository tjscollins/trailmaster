/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';
import Header from 'Header';
import Controls from 'Controls';
import MapViewer from 'MapViewer';

class MainContainer extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    return (
      <div>
        <Header/>
        <Controls/>
        <MapViewer/>
        <h1>MainContainer.jsx</h1>
      </div>
    );
  }
};

export default MainContainer; // <- add me
