/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';
import Controls from 'Controls';
import DistanceFilter from 'DistanceFilter';
import FAQ from 'FAQ';
import Header from 'Header';
import Import from 'Import';
import LoadingIndicator from 'LoadingIndicator';
import Login from 'Login';
import MapViewer from 'MapViewer';
import MockLocation from 'MockLocation';
import PasswordRecovery from 'PasswordRecovery';
import UpdatePOIorRoute from 'UpdatePOIorRoute';

export class MainContainer extends BaseComponent {
  // Cannot test in PhantomJS due to mapbox issues in MapViewer
  /*istanbul ignore next*/
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
        <LoadingIndicator />
      </div>
    );
  }
}

export default MainContainer;
