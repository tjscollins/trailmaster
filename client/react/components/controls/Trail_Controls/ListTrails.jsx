/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class ListTrails extends BaseComponent {
  constructor() {
    super();
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
  display(id) {
    var {dispatch, trails} = this.props;
    var {myTrails} = trails;
    return () => {
      var trail = myTrails.filter((item) => {
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
            <tr id={_id} style={this.displayStyle(_id)} className="point-of-interest" key={_id}>
              <td onClick={this.display(_id)} >{name}</td>
              <td onClick={this.display(_id)} >{desc}</td>
              <td onClick={this.display(_id)} >{date}</td>
              <td style={{cursor: 'default'}}>
                <button className="btn btn-danger delete-trail" onClick={this.markForDelete(_id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          )
          : null;
      });
  }
  markForDelete(id) {
    var {userSession} = this.props;
    return (e) => {
      if (!userSession.xAuth) {
        alert('You must sign-in in order to delete trails');
        return;
      }
      if (confirm('Are you sure you want to delete this trail?')) {
        $
          .ajax({url: `/trails/${id}`, type: 'delete',})
          .done((data) => {
          });
      }
    };
  }
  render() {
    return (
      <div>
        <h4 className="list-trail-header">Your Saved Trails</h4>
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
              <th></th>
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

export default connect(state => state)(ListTrails);
