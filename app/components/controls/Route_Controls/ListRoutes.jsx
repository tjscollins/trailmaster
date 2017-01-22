/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import distance from '@turf/distance';

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
    let {dispatch} = this.props;
    return () => {
      dispatch(actions.toggleVisibility(id));
    };
  }
  displayStyle(id) {
    let {geoJSON, userSession} = this.props;
    let thisPoint = geoJSON
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
  /**
   * distanceFilter - filters out geoJSON not within 50 miles of map center.
   *
   * @param  {array} features list of geoJSON features
   * @return {array}          filtered list of geoJSON features
   */
  distanceFilter(features) {
    // get map center
    let {center} = this.props.map;
    if (!center)
      return [];
    let from = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': [
          center.lng - 360,
          center.lat
        ]
      }
    };
    return features.filter((feature) => {
      // calculate distance between feature and map center
      let {coordinates, type} = feature.geometry;
      let to = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': coordinates[0]
        }
      };
      // if dist > 100 miles, return false to filter feature if dist < 100 miles,
      // return true to keep feature
      // console.log(distance(from, to, 'miles'));
      return distance(from, to, 'miles') < 100;
    });
  }
  listRoutes() {
    let {geoJSON} = this.props;
    let {RoutesSearchText} = this.props.searchText;
    return this.distanceFilter(geoJSON.features.filter((point) => {
      return point.geometry.type === 'LineString';
    })).map((point) => {
      let id = point._id;
      let {name, desc, condition, last} = point.properties;
      return name.match(new RegExp(RoutesSearchText, 'i'))
        ? (
          <tr
            onClick={this.display(id)}
            id={id}
            style={this.displayStyle(id)}
            className="routes"
            key={id}>
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
