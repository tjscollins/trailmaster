/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';
import Controls from 'Controls';
import Header from 'Header';
import Import from 'Import';
import Login from 'Login';
import MapViewer from 'MapViewer';
import PasswordRecovery from 'PasswordRecovery';
import UpdatePOIorRoute from 'UpdatePOIorRoute';

export class MainContainer extends BaseComponent {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header/>
        <Login/>
        <PasswordRecovery/>

        <MapViewer/>

        <Controls/>
        <Import/>
        <UpdatePOIorRoute/>
      </div>
    );
  }
}

export default MainContainer;
