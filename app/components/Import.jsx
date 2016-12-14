/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Import extends BaseComponent {
  constructor() {
    super();
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
              <h4 className="modal-title">Import Route from KML or GPX file</h4>
            </div>
            <div className="modal-body">
              <p>Instructions:</p>
              <p>Fill out name, descriotion, and current known condition of the route. Paste the contents from your KML or GPX file into the box below. Based on the map view of the route, you can delete/trim the series of GPS coordinates from your data until only the section you want remains</p>
              <form ref="loginForm">
                <input className="form-control" ref="name" type="text" placeholder="Name"/>
                <input className="form-control" ref="desc" type="text" placeholder="Description"/>
                <input className="form-control" ref="cond" type="text" placeholder="Condition"/>
                <textarea className="form-control" ref="data" rows="10" wrap="soft" required placeholder="Paste Route Data Here"/>

                <div className="form-check">
                  <label className="form-check-label">
                    Data Type: &nbsp;
                    <input type="radio" name="data-type" ref="gpx" value="gpx"/>
                    GPX &nbsp;
                    <input type="radio" name="data-type" ref="kml" value="kml"/>
                    KML
                  </label>
                </div>
                {/* <div className="form-control">
                  <label>Data Type</label>

                </div> */}
              </form>
            </div>
            <div className="modal-footer">

              <button onClick={this.Import} type="submit" className="btn btn-secondary" data-dismiss="modal">Import</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Import);
