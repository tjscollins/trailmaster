/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

class ListTrails extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  display(id) {
    var {dispatch, trails} = this.props;
    var {myTrails} = trails;
    return () => {
      var trail = myTrails.filter((item) => {
        return item._id === id;
      });
      // console.log(trail);
      if (trail.length > 0) {
        trail[0]
          .list
          .forEach((feature) => {
            dispatch(actions.toggleVisibility(feature._id));
          });
      }
    };
  }
  displayStyle(id) {
    return {cursor: 'pointer'};
  }
  listTrails() {
    var {searchText, trails} = this.props;
    var {trailSearchText} = searchText;
    return trails
      .myTrails
      .map((trail) => {
        var {name, desc, date, _id} = trail;
        return name.match(new RegExp(trailSearchText, 'i'))
          ? (
            <tr onClick={this.display(_id)} id={_id} style={this.displayStyle(_id)} className="point-of-interest" key={_id}>
              <td>{name}</td>
              <td>{desc}</td>
              <td>{date}</td>
            </tr>
          )
          : null;
      });
  }
  componentWillReceiveProps(nextProps) {
    var {userSession, dispatch, trails} = nextProps;
    if (userSession.xAuth) {
      //get trails
      var getTrails = $.ajax({
        url: 'trails',
        type: 'get',
        beforeSend: function(request) {
          request.setRequestHeader('x-auth', userSession.xAuth);
        }
      });

      getTrails.done((res, status, jqXHR) => {
        var newTrails = JSON
          .parse(jqXHR.responseText)
          .trails;
        if (newTrails.length !== trails.myTrails.length) {
          dispatch(actions.displayTrails(newTrails));
        }
      });

      getTrails.fail((jqXHR, status, err) => {
        console.log(`Error retrieving user's trails ${err}`, jqXHR);
      });
    }
  }
  render() {
    return (
      <table className="list-box table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>
              Description
            </th>
            <th>
              Date Created
            </th>
          </tr>
        </thead>
        <tbody>
          {this.listTrails()}
        </tbody>
      </table>
    );
  }
}

export default connect(state => state)(ListTrails);
