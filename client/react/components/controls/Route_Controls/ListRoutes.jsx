/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import distance from '@turf/distance';
import lineDistance from '@turf/line-distance';

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
   * distanceFilter - filters out geoJSON not within (distanceFilter) miles of map center.
   *
   * @param  {array} features list of geoJSON features
   * @return {array}          filtered list of geoJSON features
   */
  distanceFilter(features) {
    let {distanceFilter} = this.props.userSession;
    // console.log('routes distanceFilter', distanceFilter);
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
          center.lng,
          center.lat
        ]
      }
    };
    return features.filter((feature) => {
      // calculate distance between feature and map center
      let {coordinates} = feature.geometry;
      let to = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': coordinates[0]
        }
      };
      console.log(feature.properties.name, distance(from, to, 'miles'));
      return distance(from, to, 'miles') < distanceFilter;
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
      let length = lineDistance(point, 'miles');
      return name.match(new RegExp(RoutesSearchText, 'i'))
        ? (
          <tr
            onClick={this.display(id)}
            id={id}
            style={this.displayStyle(id)}
            className='routes'
            key={id}>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{condition}<br /> <br />{Math.round(length*100)/100} miles</td>
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
