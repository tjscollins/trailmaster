/*----------Modules----------*/
import React from 'react';
import $ from 'jquery';
import {toggleUI} from 'TrailmasterAPI';
import uuid from 'uuid';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';
import SearchPOI from 'SearchPOI';
import ListPOI from 'ListPOI';
import AddPOI from 'AddPOI';
import SearchRoutes from 'SearchRoutes';
import ListRoutes from 'ListRoutes';
import AddRoutes from 'AddRoutes';
import SearchTrails from 'SearchTrails';
import ListTrails from 'ListTrails';
import AddTrails from 'AddTrails';
import Tools from 'Tools';

export class Controls extends BaseComponent {
  constructor() {
    super();
  }
  poiControls() {
    const isMobile = window.navigator.userAgent.match(/Android|iPhone|iPod/i);
    return isMobile ? [
      <AddPOI key={uuid()} />,
      <SearchPOI key={uuid()} />,
      <ListPOI key={uuid()} />,
    ] : [
      <SearchPOI key={uuid()} />,
      <ListPOI key={uuid()} />,
    ];
  }
  routesControls() {
    const isMobile = window.navigator.userAgent.match(/Android|iPhone|iPod/i);
    return isMobile ? [
      <AddRoutes key={uuid()} />,
      <SearchRoutes key={uuid()} />,
      <ListRoutes key={uuid()} />,
    ] : [
      <SearchRoutes key={uuid()} />,
      <ListRoutes key={uuid()} />,
    ];
  }
  render() {
    return (
      <div>
        <div className='controls'>
          <div id='accordion' role='tablist' aria-multiselectable='true'>
            <div className='panel panel-primary'>
              <div className='panel-heading' role='tab' id='headingOne'>
                <h3 className='controls-title'>
                  <a
                    data-toggle='collapse'
                    data-parent='#accordion'
                    href='#collapseOne'
                    aria-expanded='true'
                    aria-controls='collapseOne'>
                    <i className='fa fa-map-marker' />
                    &nbsp; Points of Interest
                  </a>
                </h3>
                <i
                  onClick={toggleUI.bind(this, 350)}
                  id='hide-arrow'
                  className='hidecontrols fa fa-2x fa-arrow-left'
                  aria-hidden='true' />
              </div>

              <div
                id='collapseOne'
                className='collapse in'
                role='tabpanel'
                aria-labelledby='headingOne'>
                <div className='panel-body control-panel'>
                  {this.poiControls()}
                </div>
              </div>
            </div>

            <div className='panel panel-primary'>
              <div className='panel-heading' role='tab' id='headingTwo'>
                <h3 className='controls-title'>
                  <a
                    className='collapsed'
                    data-toggle='collapse'
                    data-parent='#accordion'
                    href='#collapseTwo'
                    aria-expanded='false'
                    aria-controls='collapseTwo'>
                    <i className='fa fa-road' aria-hidden='true' />
                    &nbsp; Routes
                  </a>
                </h3>
              </div>

              <div
                id='collapseTwo'
                className='collapse'
                role='tabpanel'
                aria-labelledby='headingTwo'>
                <div className='panel-body control-panel'>
                  {this.routesControls()}
                </div>
              </div>
            </div>

            <div className='panel panel-primary'>
              <div className='panel-heading' role='tab' id='headingThree'>
                <h3 className='controls-title'>
                  <a
                    className='collapsed'
                    data-toggle='collapse'
                    data-parent='#accordion'
                    href='#collapseThree'
                    aria-expanded='false'
                    aria-controls='collapseThree'>
                    <i className='fa fa-tree' aria-hidden='true' />
                    &nbsp; Your Trails
                  </a>
                </h3>
              </div>
              <div
                id='collapseThree'
                className='collapse'
                role='tabpanel'
                aria-labelledby='headingThree'>
                <div className='panel-body control-panel'>
                  <AddTrails />
                  <hr />
                  <SearchTrails />
                  <ListTrails />
                </div>
              </div>
            </div>

            <div className='panel panel-primary'>
              <div className='panel-heading' role='tab' id='headingFour'>
                <h3 className='controls-title'>
                  <a
                    className='collapsed'
                    data-toggle='collapse'
                    data-parent='#accordion'
                    href='#collapseFour'
                    aria-expanded='false'
                    aria-controls='collapseFour'>
                    <i className='fa fa-wrench' aria-hidden='true' />
                    &nbsp; Tools
                  </a>
                </h3>
              </div>
              <div
                id='collapseFour'
                className='collapse'
                role='tabpanel'
                aria-labelledby='headingFour'>
                <div className='panel-body control-panel'>
                  <Tools />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;
