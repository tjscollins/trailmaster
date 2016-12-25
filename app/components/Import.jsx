/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import toGeoJSON from '@mapbox/togeojson';
import {DOMParser} from 'xmldom';
import {month} from 'TrailmasterAPI';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Import extends BaseComponent {
  constructor() {
    super();
    this._bind('formChange');
    this.state = {
      dataType: 'gpx',
      importedGeoJSON: {
        features: [{}]
      }
    };
  }
  formChange(e) {
    var {
      name, desc, cond,
      // data,
      gpx,
      kml
    } = this.refs;
    var {features} = this.state.importedGeoJSON;
    if (Object.keys(features[0]).length === 0)
      return;
    if (e.target === gpx || e.target === kml) {
      this.setState({dataType: e.target.value});
    }
    var newGeoJSON = {
      ...this.state.importedGeoJSON,
      features: [
        {
          ...features[0],
          properties: {
            ...features[0].properties,
            name: name.value,
            desc: desc.value,
            cond: cond.value
          }
        }
      ]
    };
    this.setState({importedGeoJSON: newGeoJSON});
  }
  dataEntry() {
    var {data} = this.refs;
    var dataDOM = new DOMParser().parseFromString(data.value);
    var importedGeoJSON = this.state.dataType === 'kml'
      ? toGeoJSON.kml(dataDOM)
      : toGeoJSON.gpx(dataDOM);
    this.setState({importedGeoJSON: importedGeoJSON});
  }
  importData() {
    var {
      name, desc, cond,
      // data,
      // gpx,
      // kml
    } = this.refs;
    var {dispatch} = this.props;
    var routeList = this
      .state
      .importedGeoJSON
      .features[0]
      .geometry
      .coordinates
      .map((point) => {
        return [
          point[0] - 360,
          point[1]
        ];
      });
    var date = new Date();
    var newFeature = {
      type: 'Feature',
      properties: {
        stroke: '#555555',
        'stroke-width': 2,
        'stroke-opacity': 1,
        name: name.value,
        desc: desc.value,
        condition: cond.value,
        last: `${month(date.getMonth())} ${date.getFullYear()}`,
        displayed: false
      },
      geometry: {
        type: 'LineString',
        coordinates: [...routeList]
      }
    };
    $.ajax({
      url: '/routes',
      type: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify(newFeature)
    }).done((data) => {
      dispatch(actions.addRoute(data));
      dispatch(actions.updateMap());
    });
  }
  render() {
    return (
      <div id="import-route" className="modal fade">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title">Import Route from {/*KML or*/}
                GPX file</h4>
            </div>
            <div className="modal-body">
              <p>Instructions:</p>
              <p>Fill out name, description, and current known condition of the route. Paste the contents from your {/*KML or */}GPX file into the box below. Based on the map view of the route, you can delete/trim the series of GPS coordinates from your data until only the section you want remains</p>
              <form onSubmit={this
                .importData
                .bind(this)} onChange={this.formChange} id="importform" ref="importform">
                <input className="form-control" ref="name" type="text" placeholder="Name"/>
                <input className="form-control" ref="desc" type="text" placeholder="Description"/>
                <input className="form-control" ref="cond" type="text" placeholder="Condition"/>
                <textarea onChange={this
                  .dataEntry
                  .bind(this)} className="form-control" ref="data" rows="10" wrap="soft" required placeholder="Paste Route Data Here"/>

                <div className="form-check">
                  <label className="form-check-label">
                    Data Type: &nbsp;
                    <input type="radio" name="data-type" ref="gpx" value="gpx" defaultChecked={this.state.dataType === 'gpx'}/>
                    GPX &nbsp; {/* <input type="radio" name="data-type" ref="kml" value="kml" checked={this.state.dataType === 'kml'}/>
                    KML */}
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={this
                .importData
                .bind(this)} type="submit" className="btn btn-secondary" data-dismiss="modal">Import</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Import);
