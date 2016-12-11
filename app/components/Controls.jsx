/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

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

export class Controls extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  hide() {
    if ($('#hidecontrols').hasClass('fa-arrow-left')) {
      $('div.controls').css('left', '-325px');
      $('#hidecontrols').removeClass('fa-arrow-left');
      $('#hidecontrols').addClass('fa-arrow-right');
    } else {
      $('div.controls').css('left', '0px');
      $('#hidecontrols').removeClass('fa-arrow-right');
      $('#hidecontrols').addClass('fa-arrow-left');
    }
  }
  render() {
    return (
      <div>
        <div className="controls">
          <div id="accordion" role="tablist" aria-multiselectable="true">
            <div className="panel panel-primary">
              <div className="panel-heading" role="tab" id="headingOne">
                <h3 className="controls-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Points of Interest
                  </a>
                </h3>
                <i onClick={this.hide} id="hidecontrols" className="fa fa-2x fa-arrow-left" aria-hidden="true"/>
              </div>

              <div id="collapseOne" className="collapse in" role="tabpanel" aria-labelledby="headingOne">
                <div className="panel-body control-panel">
                  <AddPOI/>
                  <SearchPOI/>
                  <ListPOI/>
                </div>
              </div>
            </div>
            <div className="panel panel-primary">
              <div className="panel-heading" role="tab" id="headingTwo">
                <h3 className="controls-title">
                  <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Routes
                  </a>
                </h3>
              </div>
              <div id="collapseTwo" className="collapse" role="tabpanel" aria-labelledby="headingTwo">
                <div className="panel-body control-panel">
                  <AddRoutes/>
                  <SearchRoutes/>
                  <ListRoutes/>
                </div>
              </div>
            </div>
            <div className="panel panel-primary">
              <div className="panel-heading" role="tab" id="headingThree">
                <h3 className="controls-title">
                  <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Your Trails
                  </a>
                </h3>
              </div>
              <div id="collapseThree" className="collapse" role="tabpanel" aria-labelledby="headingThree">
                <div className="panel-body control-panel">
                  <AddTrails/>
                  <SearchTrails/>
                  <ListTrails/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Controls);
