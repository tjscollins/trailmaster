/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

class ListRoutes extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  listPoints() {
    var {RouteSearchText} = this.props.searchText;
    return this
      .props
      .geoJSON
      .features
      .filter((point) => {
        return point.geometry.type === 'LineString';
      })
      .map((point) => {
        var {name, desc, condition, last, id} = point.properties;
        return (
          <tr onClick={this.display(id)} id={id} style={this.displayStyle(id)} className="routes" key={uuid()}>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{condition}</td>
            <td>{last}</td>
          </tr>
        );
      });
  }
  display(id) {
    //Display point on map
    var {dispatch} = this.props;
    return () => {
      dispatch(actions.toggleVisibility(id));
    };
  }
  displayStyle(id) {
    var {geoJSON} = this.props;
    var thisPoint = geoJSON
      .features
      .filter((point) => {
        return point.properties.id === id;
      })[0];
    return thisPoint.properties.displayed
      ? {
        fontWeight: 'bold'
      }
      : {
        fontWeight: 'normal'
      };
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
              Condition
            </th>
            <th>
              Last Outing
            </th>
          </tr>
        </thead>
        <tbody>
          {this.listPoints()}
        </tbody>
      </table>
    );
  }
}

export default connect(state => state)(ListRoutes);
