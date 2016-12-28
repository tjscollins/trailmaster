/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

export class Tools extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  importData() {
    $('#import-route').modal('show');
  }
  updateMarker() {
    $('#select-poi-route').modal('show');
  }
  render() {
    return (
      <div className="">
        {/* <div style={{
          cursor: 'pointer'
          }} onClick={this.measure} className="row tool">
          <div className="col-xs-2">
          <i className="fa fa-map-o"/>
          </div>
          <div className="col-xs-10">
          <p>Measure Distance</p>
          </div>
        </div> */}
        <div style={{
          cursor: 'pointer'
        }} onClick={this.updateMarker} className="row tool">
          <div className="col-xs-2">
            <i className="fa fa-map-marker"/>
          </div>
          <div className="col-xs-10">
            <p>Update POI or Route</p>
          </div>
        </div>
        <div style={{
          cursor: 'pointer'
        }} onClick={this.importData} className="row tool">
          <div className="col-xs-2">
            <i className="fa fa-upload"/>
          </div>
          <div className="col-xs-10">
            <p>Import {/*KML or*/}
              GPX File as Route</p>
          </div>
        </div>
        {/* <div style={{
          cursor: 'pointer'
          }} onClick={this.updateMarker} className="row tool">
          <div className="col-xs-2">
          <i className="fa fa-pencil-square-o"/>
          </div>
          <div className="col-xs-10">
          <p>Edit Existing Trail</p>
          </div>
        </div> */}
      </div>
    );
  }
}

export default connect(state => state)(Tools);
