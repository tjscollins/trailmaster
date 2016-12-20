/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

import * as actions from 'actions';

class UpdatePOIorRoute extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this.state = {
      id: null,
      point: null,
      map: null
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
  formSubmit() {
    var {dispatch} = this.props;
    this
      .state
      .map
      .remove();
    var type = this.state.point.geometry.type === 'Point'
      ? 'pois'
      : 'routes';
    $.ajax({
      url: `/${type}/${this.state.point._id}`,
      type: 'patch',
      headers: {
        'Content-type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify(this.state.point)
    }).done((data) => {
      dispatch(actions.updateGeoJSON(this.state.point));
      dispatch(actions.updateMap());
    });

  }
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
  shouldComponentUpdate(nextProps, nextState) {
    //Don't re-render whole component when Preview Map updates
    var {map, point} = this.state;
    var shouldUpdate = (map === nextState.map);
    return shouldUpdate;
  }
  render() {
    var {dispatch} = this.props;
    var {point} = this.state;
    if (point) {
      var {properties, geometry} = point;
      var {name, desc, condition} = properties;
      mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
      if (this.state.map !== null)
        this.state.map.remove();
      var map = new mapboxgl.Map({
        container: 'preview-map',
        style: 'mapbox://styles/mapbox/outdoors-v9',
        center: geometry.type === 'Point'
          ? geometry.coordinates
          : [...geometry.coordinates[0]],
        zoom: 12,
        hash: false,
        interactive: true
      });

      map.on('load', () => {
        //place userLocation
        console.log(point);
        map.addSource('preview', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [point]
          }
        });
        switch (point.geometry.type) {
          case 'Point':
            var layerType = 'symbol';
            var layout = {
              'icon-image': 'marker-15',
              'text-field': '{name}',
              'text-font': [
                'Open Sans Regular', 'Arial Unicode MS Regular'
              ],
              'text-size': 10,
              'text-offset': [
                0, 0.6
              ],
              'text-anchor': 'top'
            };
            break;
          case 'LineString':
            var layerType = 'line';
            var layout = {
              'line-join': 'round',
              'line-cap': 'round'
            };
            map.addLayer({
              'id': 'preview label',
              'type': 'symbol',
              'source': 'preview',
              'layout': {
                'text-field': '{name}',
                'text-font': [
                  'Open Sans Regular', 'Arial Unicode MS Regular'
                ],
                'text-size': 10,
                'text-offset': [
                  0, 0.6
                ],
                'text-anchor': 'top'
              }
            });
            break;
          default:
            throw new Error(`Unknown feature type ${layerType}`);
        }
        // console.log(layerType, layout);
        map.addLayer({'id': 'preview', 'type': layerType, 'source': 'preview', 'layout': layout});
        this.setState({map});
      });
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

                <form onChange={this
                  .formChange
                  .bind(this)} id="updateform" ref="updateform">
                  <input className="form-control" ref="name" type="text" value={name}/>
                  <input className="form-control" ref="desc" type="text" value={desc}/>
                  <input className="form-control" ref="cond" type="text" value={condition}/>
                  <textarea className="form-control" ref="geometry" rows="10" wrap="soft" required value={JSON.stringify(geometry, null, 2)}/>

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
