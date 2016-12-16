/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import toGeoJSON from '@mapbox/togeojson';
import {DOMParser} from 'xmldom';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Import extends BaseComponent {
  constructor() {
    super();
    this.importedGeoJSON = {};
    this.formChange = this
      .formChange
      .bind(this);
    this.state = {
      dataType: 'gpx'
    };
  }
  formChange(e) {
    var {
      name, desc, cond,
      // data,
      gpx,
      kml
    } = this.refs;
    if (e.target === gpx || e.target === kml) {
      this.setState({dataType: e.target.value});
    }
    this.importedGeoJSON.features[0].properties.name = name.value;
    this.importedGeoJSON.features[0].properties.desc = desc.value;
    this.importedGeoJSON.features[0].properties.cond = cond.value;
    console.log(this.importedGeoJSON);
  }
  dataEntry() {
    var {data} = this.refs;
    var dataDOM = new DOMParser().parseFromString(data.value);
    this.importedGeoJSON = this.state.dataType === 'kml'
      ? toGeoJSON.kml(dataDOM)
      : toGeoJSON.gpx(dataDOM);
  }
  importData() {
    var {
      name, desc, cond,
      // data,
      // gpx,
      // kml
    } = this.refs;
    // console.log(this.importedGeoJSON.features[0]);
    var {dispatch} = this.props;
    var routeList = this
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
    dispatch(actions.addRoute(routeList, name.value, desc.value, cond.value, new Date()));
    dispatch(actions.updateMap());
  }
  render() {
    console.log(this.dataType);
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
                    <input type="radio" name="data-type" ref="gpx" value="gpx" checked={this.state.dataType === 'gpx'}/>
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
