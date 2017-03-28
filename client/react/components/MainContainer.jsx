/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';
import Controls from 'Controls';
import DistanceFilter from 'DistanceFilter';
import FAQ from 'FAQ';
import Header from 'Header';
import Import from 'Import';
import Login from 'Login';
import MapViewer from 'MapViewer';
import MockLocation from 'MockLocation';
import PasswordRecovery from 'PasswordRecovery';
import UpdatePOIorRoute from 'UpdatePOIorRoute';

export class MainContainer extends BaseComponent {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header />
        <Login />
        <PasswordRecovery />
        <MapViewer />
        <Controls />
        <Import />
        <UpdatePOIorRoute />
        <FAQ />
        <DistanceFilter />
        <MockLocation />
      </div>
    );
  }
}

export default MainContainer;
