/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import {month} from 'TrailmasterAPI';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class AddPOI extends BaseComponent {
  constructor() {
    super();
    this._bind('submit');
  }
  modal() {
    $('#add-poi-modal').modal('show');
  }
  submit() {
    var {dispatch, userSession} = this.props;
    var {name, desc, cond} = this.refs;
    var date = new Date();
    var newFeature = {
      type: 'Feature',
      properties: {
        'marker-color': '#7e7e7e',
        'marker-size': 'medium',
        'marker-symbol': '',
        'name': name.value,
        'desc': desc.value,
        'condition': cond.value,
        'last': `${month(date.getMonth())} ${date.getFullYear()}`,
        'displayed': false,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          userSession.coords.longitude,
          userSession.coords.latitude
        ]
      }
    };
    $.ajax({
      url: '/pois',
      type: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify(newFeature)
    }).done((data) => {
      dispatch(actions.addPOI(data));
      dispatch(actions.updateMap());
    });
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
