/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import * as actions from 'actions';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
// import MapboxDirections from '@mapbox/mapbox-gl-directions';

/*----------API----------*/
import {month} from 'TrailmasterAPI';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

class AddTrails extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this._bind('submit', 'fillRoads');
  }
  saveTrail() {
    $('#save-trail-modal').modal('show');
  }
  fillRoads(trail) {
    //Assume sorted in order -- need UI mechanism to do this
    //Get start and end points for given road section
    // var p1 = [
    //     -214.2152855, 15.167236099999998
    //   ],
    //   p2 = [-214.2292855, 15.168356099999997];
    //Call for directions between successive points via road
    // trail.map((feature, index) => {
    //   var directions = new MapboxDirections({
    //     accessToken,
    //     interactive: false,
    //     unit: 'imperial',
    //     profile: 'walking',
    //     controls: {
    //       inputs: false,
    //       instructions: false
    //     }
    //   });
    // });

    //Splice those directions into the list-box-margin

    //Return new list
  }
  submit() {
    // console.log('Submitting New Trail!');
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
    // this.fillRoads(trailList);
    var date = new Date();
    var newTrail = {
      list: trailList,
      name: name.value,
      desc: desc.value,
      date: `${month(date.getMonth())} ${date.getFullYear()}`
    };
    var send = $.ajax({
      url: '/trails',
      type: 'post',
      data: JSON.stringify(newTrail),
      beforeSend: function(req) {
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('x-auth', xAuth);
      }
    });

    send.done((res, status, jqXHR) => {
      $.ajax({
        url: '/trails',
        type: 'get',
        beforeSend: (req) => {
          req.setRequestHeader('x-auth', xAuth);
        },
        success: (res, status, jqXHR) => {
          dispatch(actions.displayTrails(JSON.parse(jqXHR.responseText).trails));
        },
        error: (jqXHR, status, err) => {
          console.log(`Error fetching new trail: ${err}`, jqXHR);
        }
      })
    });

    send.fail((jqXHR, status, err) => {
      console.log(`Error saving new trail: ${err}`, jqXHR);
    });

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
