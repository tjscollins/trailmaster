/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class ListRoutes extends BaseComponent {
  constructor() {
    super();
  }
  display(id) {
    //Display point on map
    var {dispatch} = this.props;
    return () => {
      dispatch(actions.toggleVisibility(id));
    };
  }
  displayStyle(id) {
    var {geoJSON, userSession} = this.props;
    var thisPoint = geoJSON
      .features
      .filter((point) => {
        return point._id === id;
      })[0];
    return userSession
      .visibleFeatures
      .indexOf(thisPoint._id) > -1
      ? {
        fontWeight: 'bold',
        cursor: 'pointer'
      }
      : {
        fontWeight: 'normal',
        cursor: 'pointer'
      };
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
        var id = point._id;
        var {name, desc, condition, last} = point.properties;
        return name.match(new RegExp(RoutesSearchText, 'i'))
          ? (
            <tr onClick={this.display(id)} id={id} style={this.displayStyle(id)} className="routes" key={id}>
              <td>{name}</td>
              <td>{desc}</td>
              <td>{condition}</td>
              <td>{last}</td>
            </tr>
          )
          : null;
      });
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
