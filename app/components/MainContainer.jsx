/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';
import Header from 'Header';
import Controls from 'Controls';
import MapViewer from 'MapViewer';
import Login from 'Login';
import Import from 'Import';
import UpdatePOIorRoute from 'UpdatePOIorRoute';

export class MainContainer extends BaseComponent {
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
        <Login/>
        <Import/>
        <UpdatePOIorRoute/>
      </div>
    );
  }
}

export default MainContainer;
