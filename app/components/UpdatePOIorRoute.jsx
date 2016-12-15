/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

import * as actions from 'actions';

class UpdatePOIorRoute extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this.state = {
      id: null,
      point: null
    };
  }
  formChange() {
    this.setState({
      point: {
        ...this.state.point,
        geometry: JSON.parse(this.refs.geometry.value),
        properties: {
          ...this.state.point.properties,
          name: this.refs.name.value,
          desc: this.refs.desc.value,
          condition: this.refs.cond.value
        }
      }
    });
  }
  formSubmit() {}
  listData() {
    var {searchText, geoJSON} = this.props;
    var {updateSearchText} = searchText;
    return geoJSON
      .features
      .map((point) => {
        var id = point._id;
        var {name, desc, condition, last} = point.properties;
        return name.match(new RegExp(updateSearchText, 'i'))
          ? (
            <tr onClick={this.select(point, id)} id={id} style={{
              cursor: 'pointer'
            }} className="point-of-interest" key={id}>
              <td>{name}</td>
              <td>{desc}</td>
              <td>{condition}</td>
              <td>{last}</td>
            </tr>
          )
          : null;
      });
  }
  select(point, id) {
    return () => {
      this.setState({id: id, point: point});
      $('#select-poi-route').modal('hide');
      $('#update-poi-route').modal('show');
    };
  }
  render() {
    var {dispatch} = this.props;
    var {point} = this.state;
    var name,
      desc,
      condition,
      geometry;
    if (point) {
      var {properties, geometry} = point;
      var {name, desc, condition} = properties;
    }
    return (
      <div>
        <div id="select-poi-route" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Update POI or Route</h4>
              </div>
              <div className="modal-body">
                <div className="search-box">
                  <div>
                    <input className="form-control" type="search" id="update-searchText" ref="updatesearchText" placeholder="Search" onChange={() => {
                      dispatch(actions.setUpdateSearchText(this.refs.updatesearchText.value));
                    }}/>
                  </div>
                </div>
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
                    {this.listData()}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div id="update-poi-route" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Update POI or Route</h4>
              </div>
              <div className="modal-body">
                <p>Instructions:</p>
                <p>Make changes to the geoJSON data for the selected POI or Route and view them in the preview map. When you are satisfied with your changes, click save.</p>

                <form onSubmit={this
                  .formSubmit
                  .bind(this)} onChange={this
                  .formChange
                  .bind(this)} id="updateform" ref="updateform">
                  <input className="form-control" ref="name" type="text" value={name}/>
                  <input className="form-control" ref="desc" type="text" value={desc}/>
                  <input className="form-control" ref="cond" type="text" value={condition}/>
                  <textarea className="form-control" ref="geometry" rows="10" wrap="soft" required value={JSON.stringify(geometry)}/>

                </form>

                <div id="preview-map"></div>
              </div>
              <div className="modal-footer">

                <button onClick={this
                  .formSubmit
                  .bind(this)} type="submit" className="btn btn-secondary" data-dismiss="modal">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(UpdatePOIorRoute);
