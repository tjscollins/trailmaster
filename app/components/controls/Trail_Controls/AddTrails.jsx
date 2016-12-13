/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import * as actions from 'actions';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

class AddTrails extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this.submit = this
      .submit
      .bind(this);
  }
  saveTrail() {
    $('#save-trail-modal').modal('show');
  }
  submit() {
    console.log('Submitting New Trail!');
    var {dispatch, geoJSON, userSession} = this.props;
    var {name, desc} = this.refs;
    var trailList = geoJSON
      .features
      .filter((point) => {
        return userSession
          .visibleFeatures
          .indexOf(point._id) > -1;
      });
    dispatch(actions.saveTrail(trailList, name.value, desc.value, userSession.xAuth, userSession._id));
  }
  remove(id) {
    var {dispatch} = this.props;
    return () => {
      dispatch(actions.toggleVisibility(id));
    };
  }
  currentTrail() {
    var {geoJSON, userSession} = this.props;
    return geoJSON
      .features
      .filter((point) => {
        return userSession
          .visibleFeatures
          .indexOf(point._id) > -1;
      })
      .map((point) => {
        var id = point._id;
        var {name, desc, condition, last} = point.properties;
        return (
          <tr onClick={this.remove(id)} id={id} className="point-of-interest" key={id} style={{
            cursor: 'pointer'
          }}>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{condition}</td>
            <td>{last}</td>
          </tr>
        );
      });
  }
  render() {
    return (
      <div>
        <button onClick={this.saveTrail} className="btn btn-info form-control" type="submit">
          Save Current Trail
        </button>
        <h4>Current Trail Includes:</h4>
        <table className="list-box table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Description
              </th>
              <th>
                Condition
              </th>
              <th>
                Last Outing
              </th>
            </tr>
          </thead>
          <tbody>
            {this.currentTrail()}
          </tbody>
        </table>

        <div id="save-trail-modal" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Save Current Trail</h4>
              </div>
              <div className="modal-body">
                <form ref="addPOI">
                  <input className="form-control" ref="name" type="text" placeholder="Name"/>
                  <input className="form-control" ref="desc" type="text" placeholder="Description"/>
                </form>
              </div>
              <div className="modal-footer">
                <button onClick={this.submit} type="submit" className="btn btn-secondary" data-dismiss="modal">Save Trail</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(AddTrails);
