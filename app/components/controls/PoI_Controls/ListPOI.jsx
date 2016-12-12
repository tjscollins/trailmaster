/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

class ListPOI extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  listPoints() {
    var {searchText, geoJSON} = this.props;
    var {POISearchText} = searchText;
    return geoJSON
      .features
      .filter((point) => {
        return point.geometry.type === 'Point';
      })
      .map((point) => {
        var id = point._id;
        var {name, desc, condition, last} = point.properties;
        return name.match(new RegExp(POISearchText, 'i'))
          ? (
            <tr onClick={this.display(id)} id={id} style={this.displayStyle(id)} className="point-of-interest" key={uuid()}>
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
        return point._id === id;
      })[0];
    return thisPoint.properties.displayed
      ? {
        fontWeight: 'bold',
        cursor: 'pointer'
      }
      : {
        fontWeight: 'normal',
        cursor: 'pointer'
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

export default connect(state => state)(ListPOI);
