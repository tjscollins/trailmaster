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
  }
  modal() {
    $('#add-route-modal').modal('show');
  }
  tracking() {
    console.log('Started Tracking');
    var {dispatch} = this.props;
    dispatch(actions.trackRoute());
    $('#tracking-modal').modal('show');
  }
  stopTracking() {
    console.log('Stopped Tracking');
    var {dispatch, userLocation} = this.props;
    var {name, desc, cond} = this.refs;
    var date = new Date();
    dispatch(actions.stopTrackingRoute());
    console.log('Adding Route', name.value, userLocation.routeList);
    if (userLocation.routeList.length > 0) {
      dispatch(actions.addRoute(userLocation.routeList, name.value, desc.value, cond.value, date));
    } else {
      console.error('No Route added due to lack of routeList');
    }
    dispatch(actions.clearRouteList());
    dispatch(actions.updateMap());
  }
  render() {
    return (
      <div>
        <button className="btn btn-info form-control" onClick={this.modal} type="submit">
          Track New Route
        </button>
        <div id="add-route-modal" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Track New Route</h4>
              </div>
              <div className="modal-body">
                <form ref="addRoute">
                  <input className="form-control" ref="name" type="text" placeholder="Name"/>
                  <input className="form-control" ref="desc" type="text" placeholder="Description"/>
                  <input className="form-control" ref="cond" type="text" placeholder="Condition"/>
                </form>
              </div>
              <div className="modal-footer">
                <button onClick={this.tracking} type="submit" className="btn btn-secondary" data-dismiss="modal">Track Route</button>
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
              <div className="modal-body">
                <p>
                  <span style={{
                    color: 'red'
                  }}>Warning</span>: Tracking only works while this message is visible. Locking or sleeping your device will pause GPS tracking and create gaps in your route. Unlocking or waking your device will resume tracking when this message is visible again.</p>
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
