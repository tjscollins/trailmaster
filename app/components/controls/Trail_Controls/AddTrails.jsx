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
    var month = (mo) => {
      switch (mo) {
        case 0:
          return 'Jan';
        case 1:
          return 'Feb';
        case 2:
          return 'Mar';
        case 3:
          return 'Apr';
        case 4:
          return 'May';
        case 5:
          return 'Jun';
        case 6:
          return 'Jul';
        case 7:
          return 'Aug';
        case 8:
          return 'Sep';
        case 9:
          return 'Oct';
        case 10:
          return 'Nov';
        case 11:
          return 'Dec';
        default:
          return mo;
      }
    };
    console.log('Submitting New Trail!');
    var {dispatch, geoJSON, userSession} = this.props;
    var {xAuth} = userSession;
    var {name, desc} = this.refs;
    var trailList = geoJSON
      .features
      .filter((point) => {
        return userSession
          .visibleFeatures
          .indexOf(point._id) > -1;
      });
    var date = new Date();
    var newTrail = {
      list: trailList,
      name: name.value,
      desc: desc.value,
      date: `${month(date.getMonth())} ${date.getFullYear()}`
    };
    var send = new XMLHttpRequest();
    send.open('POST', '/trails', false);
    send.setRequestHeader('Content-type', 'application/json');
    send.setRequestHeader('x-auth', xAuth);
    send.send(JSON.stringify(newTrail));
    console.log(send.response, JSON.stringify(newTrail));
    var get = new XMLHttpRequest();
    get.open('GET', '/trails', false);
    get.setRequestHeader('x-auth', xAuth);
    get.send(null);
    var displayTrails = JSON
      .parse(get.responseText)
      .trails;
    dispatch(actions.displayTrails(displayTrails));

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
