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
  listRoutes() {
    var {geoJSON} = this.props;
    var {RoutesSearchText} = this.props.searchText;
    return geoJSON
      .features
      .filter((point) => {
        return point.geometry.type === 'LineString';
      })
      .map((point) => {
        var {name, desc, condition, last, id} = point.properties;
        return name.match(new RegExp(RoutesSearchText, 'i'))
          ? (
            <tr onClick={this.display(id)} id={id} style={this.displayStyle(id)} className="routes" key={uuid()}>
              <td>{name}</td>
              <td>{desc}</td>
              <td>{condition}</td>
              <td>{last}</td>
            </tr>
          )
          : null;
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
          {this.listRoutes()}
        </tbody>
      </table>
    );
  }
}

export default connect(state => state)(ListRoutes);
