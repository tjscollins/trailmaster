/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

class AddPOI extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this.submit = this
      .submit
      .bind(this);
  }
  modal() {
    $('#add-poi-modal').modal('show');
  }
  submit() {
    var {dispatch, userLocation} = this.props;
    var {name, desc, cond} = this.refs;
    var date = new Date();
    // console.log('Received position, adding new POI', name.value, userLocation);
    dispatch(actions.addPOI(userLocation, name.value, desc.value, cond.value, date));
    dispatch(actions.updateMap());
  }
  render() {
    return (
      <div>
        <button className="btn btn-info form-control" onClick={this.modal} type="button">
          Add New Point of Interest
        </button>
        <div id="add-poi-modal" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Add New Point of Interest</h4>
              </div>
              <div className="modal-body">
                <form ref="addPOI">
                  <input className="form-control" ref="name" type="text" placeholder="Name"/>
                  <input className="form-control" ref="desc" type="text" placeholder="Description"/>
                  <input className="form-control" ref="cond" type="text" placeholder="Condition"/>
                </form>
              </div>
              <div className="modal-footer">
                <button onClick={this.submit} type="submit" className="btn btn-secondary" data-dismiss="modal">Add POI</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(AddPOI);
