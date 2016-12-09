/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

class AddRoutes extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this.tracking = this
      .tracking
      .bind(this);
    this.stopTracking = this
      .stopTracking
      .bind(this);
    this.trackingFlag = false;
  }
  modal() {
    $('#add-route-modal').modal('show');
  }
  tracking() {
    console.log('Started Tracking');
    var {dispatch} = this.props;
    // var form = this.refs.addPOI;
    this.list = [];
    var success = (pos) => {
      this
        .list
        .push([
          pos.coords.longitude - 360,
          pos.coords.latitude
        ]);
    };
    var error = (err) => {
      throw new Error(err.message);
    };
    var options = {
      timeout: 5000,
      enableHighAccuracy: true,
      maximumAge: 0
    };
    this.trackingFlag = true;
    navigator
      .geolocation
      .getCurrentPosition(success, error, options);
    this.trackingID = navigator
      .geolocation
      .watchPosition(success, error, options);
    $('#tracking-modal').modal('show');
  }
  stopTracking() {
    console.log('Stopped Tracking');
    var {dispatch} = this.props;
    var {name, desc, cond} = this.refs;
    var date = new Date();
    this.trackingFlag = false;
    navigator
      .geolocation
      .clearWatch(this.trackingID);
    console.log('Adding Route', name.value, this.list);
    dispatch(actions.addRoute(this.list, name.value, desc.value, cond.value, date));
    dispatch(actions.updateMap());
  }
  render() {
    return (
      <div>
        <button className="btn btn-info form-control" onClick={this.modal} type="submit">
          Add New Route
        </button>
        <div id="add-route-modal" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Add New Route</h4>
              </div>
              <div className="modal-body">
                <form ref="addRoute">
                  <input className="form-control" ref="name" type="text" placeholder="Name"/>
                  <input className="form-control" ref="desc" type="text" placeholder="Description"/>
                  <input className="form-control" ref="cond" type="text" placeholder="Condition"/>
                </form>
              </div>
              <div className="modal-footer">
                <button onClick={this.tracking} type="submit" className="btn btn-secondary" data-dismiss="modal">Add Route</button>
              </div>
            </div>
          </div>
        </div>

        <div id="tracking-modal" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Tracking...</h4>
              </div>
              <div className="modal-footer">
                <button onClick={this.stopTracking} type="submit" className="btn btn-danger" data-dismiss="modal">Stop Tracking</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(AddRoutes);
