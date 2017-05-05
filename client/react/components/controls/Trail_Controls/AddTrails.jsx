/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import * as actions from 'actions';
import lineDistance from '@turf/line-distance';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
// import MapboxDirections from '@mapbox/mapbox-gl-directions';

/*----------API----------*/
import {month} from 'TrailmasterAPI';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

export class AddTrails extends BaseComponent {
  constructor() {
    super();
    this._bind('submit', 'fillRoads');
  }
  clearMap = () => {
    this.props.dispatch(actions.clearMap());
  }
  currentTrail() {
    let {geoJSON: {features}, userSession} = this.props;
    if (features === undefined) {
      return [];
    }
    return features
      .filter((point) => {
        return userSession
          .visibleFeatures
          .indexOf(point._id) > -1;
      })
      .map((point) => {
        const id = point._id;
        const {name, desc, condition, last} = point.properties;
        const {type} = point.geometry;
        const length = type === 'LineString' ? lineDistance(point, 'miles') : null;
        const route = length !== null;
        return (
          <tr onClick={this.remove(id)} id={id} className='point-of-interest' key={id} style={{
            cursor: 'pointer'
          }}>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{condition}<br /> <br />{route ? `${Math.round(length*100)/100} miles` : null} </td>
            <td>{last}</td>
          </tr>
        );
      });
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
  remove(id) {
    let {dispatch} = this.props;
    return () => {
      dispatch(actions.toggleFeatureOnMap(id));
    };
  }
  saveTrail = () => {
    const {xAuth} = this.props.userSession;
    if(xAuth) {
      // user is authenticated, so allow them to save their trail
      $('#save-trail-modal').modal('show');
    } else {
      // user is not authenticated, so show login first
      alert('You must be logged in to save a custom trail');
      $('#login-modal').modal('show');
    }
  }
  submit() {
    let {dispatch, geoJSON, userSession} = this.props;
    let {xAuth} = userSession;
    let {name, desc} = this.refs;
    let trailList = geoJSON
      .features
      .filter((point) => {
        return userSession
          .visibleFeatures
          .indexOf(point._id) > -1;
      });
    let date = new Date();
    let newTrail = {
      bounds: {},
      list: trailList,
      name: name.value,
      desc: desc.value,
      date: `${month(date.getMonth())} ${date.getFullYear()}`
    };
    let send = $.ajax({
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
          console.error(`Error fetching new trail: ${err}`, jqXHR);
        }
      });
    });

    send.fail((jqXHR, status, err) => {
      console.error(`Error saving new trail: ${err}`, jqXHR);
    });
  }
  render() {
    return (
      <div>
        <div id='save-or-clear-map'>
          <button
            id='clear-current-map-btn'
            onClick={this.clearMap}
            className='btn btn-default'>
            Clear Map
          </button>
          <button
            id='save-current-trail-btn'
            onClick={this.saveTrail}
            className='btn btn-primary'
            type='submit'>
            Save Current Map
          </button>
        </div>
        <br /><br />
        <h4 className='current-trail-header'>Currently Displayed Trail</h4>
        <table className='list-box table table-striped'>
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

        <div id='save-trail-modal' className='modal fade'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
                <h4 className='modal-title'>Save Current Trail</h4>
              </div>
              <div className='modal-body'>
                <form ref='addPOI'>
                  <input className='form-control' ref='name' type='text' placeholder='Name' />
                  <input className='form-control' ref='desc' type='text' placeholder='Description' />
                </form>
              </div>
              <div className='modal-footer'>
                <button onClick={this.submit} type='submit' className='btn btn-primary' data-dismiss='modal'>Save Trail</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => state)(AddTrails);
