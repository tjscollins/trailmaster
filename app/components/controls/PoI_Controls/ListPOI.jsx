/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

class ListPOI extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  listPoints() {
    return this
      .props
      .geoJSON
      .features
      .filter((point) => {
        return point.geometry.type === 'Point';
      })
      .map((point) => {
        var {name, desc, condition, last} = point.properties;
        return (
          <tr onClick={this.display} className="point-of-interest" key={uuid()}>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{condition}</td>
            <td>{last}</td>
          </tr>
        );
      });
  }
  display() {
    //Display point on map
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
