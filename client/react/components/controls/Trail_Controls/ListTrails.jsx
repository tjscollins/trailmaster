/*----------Modules----------*/
import lineDistance from '@turf/line-distance';
import $ from 'jquery';
import React from 'react';
import {connect} from 'react-redux';


/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class ListTrails extends BaseComponent {
  constructor() {
    super();
  }
  componentWillReceiveProps(nextProps) {
    let {userSession, dispatch, trails} = nextProps;
    if (userSession.xAuth) {
      //get trails
      let getTrails = $.ajax({
        url: 'trails',
        type: 'get',
        beforeSend: (request) => {
          request.setRequestHeader('x-auth', userSession.xAuth);
        }
      });

      getTrails.done((res, status, jqXHR) => {
        let newTrails = JSON
          .parse(jqXHR.responseText)
          .trails;
        if (newTrails.length !== trails.myTrails.length) {
          dispatch(actions.displayTrails(newTrails));
        }
      });

      getTrails.fail((jqXHR, status, err) => {
        console.error(`Error retrieving user's trails ${err}`, jqXHR);
      });
    }
  }
  display(id) {
    let {dispatch, trails} = this.props;
    let {myTrails} = trails;
    return () => {
      let trail = myTrails.filter((item) => {
        return item._id === id;
      });
      if (trail.length > 0) {
        trail[0]
          .list
          .forEach((feature) => {
            dispatch(actions.toggleVisibility(feature._id));
          });
      }
    };
  }
  listTrails() {
    let {searchText, trails} = this.props;
    let {trailSearchText} = searchText;
    return trails
      .myTrails
      .map((trail) => {
        let {name, desc, date, _id} = trail;
        return name.match(new RegExp(trailSearchText, 'i'))
          ? (
            <tr id={_id} style={{cursor: 'pointer'}} className='point-of-interest' key={_id}>
              <td onClick={this.display(_id)} >{name}</td>
              <td onClick={this.display(_id)} >{desc}</td>
              <td onClick={this.display(_id)} >{date}</td>
              <td className='trail-length' onClick={this.display(_id)} >
                <p>{`${this.trailLength(_id)} miles`}</p>
              </td>
              <td style={{cursor: 'default'}}>
                <button className='btn btn-danger delete-trail' onClick={this.markForDelete(_id)}>
                  <i className='fa fa-trash' />
                </button>
              </td>
            </tr>
          )
          : null;
      });
  }
  markForDelete(id) {
    let {userSession, dispatch} = this.props;
    return (e) => {
      if (!userSession.xAuth) {
        alert('You must sign-in in order to delete trails');
        return;
      }
      if (confirm('Are you sure you want to delete this trail?')) {
        $
          .ajax({url: `/trails/${id}`, type: 'delete'})
          .done((trail) => {
            dispatch(actions.delTrail(trail.name));
          });
      }
    };
  }
  trailLength(id) {
    let {myTrails} = this.props.trails;
    let total = 0;
    myTrails.forEach((trail) => {
      if(trail._id === id) {
        trail.list.forEach((feature) => {
          if(feature.geometry.type === 'LineString') {
            total += lineDistance(feature, 'miles');
          }
        });
      }
    });
    return Math.floor(total*100)/100;
  }
  render() {
    return (
      <div>
        <h4 className='list-trail-header'>Your Saved Trails</h4>
        <table className='list-box table table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Desc
              </th>
              <th>
                Date
              </th>
              <th>
                Mapped Distance
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.listTrails()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect((state) => state)(ListTrails);
