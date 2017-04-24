/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import mapboxgl from 'mapboxgl';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

import * as actions from 'actions';

export class UpdatePOIorRoute extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this._bind('formChange', 'deleteLast', 'deleteFirst', 'deleteTen', 'deleteHund', 'quickDelete', 'undoDelete', 'isRoute', 'markForDelete');
    this.state = {
      id: null,
      point: null,
      map: null,
      del: 'first',
      deleteN: 10,
      deletes: [],
    };
  }
  /*istanbul ignore next*/
  deleteLast() {
    this.setState({del: 'last'});
  }
  /*istanbul ignore next*/
  deleteFirst() {
    this.setState({del: 'first'});
  }
  /*istanbul ignore next*/
  deleteTen() {
    this.setState({deleteN: 10});
  }
  /*istanbul ignore next*/
  deleteHund() {
    this.setState({deleteN: 100});
  }
  formChange() {
    this.setState({
      point: {
        ...this.state.point,
        geometry: {
          ...this.state.point.geometry,
          coordinates: JSON.parse(this.refs.geometry.value),
        },
        properties: {
          ...this.state.point.properties,
          name: this.refs.name.value,
          desc: this.refs.desc.value,
          condition: this.refs.cond.value,
        },
      }
    });
  }
  formSubmit() {
    const {dispatch} = this.props;
    this
      .state
      .map
      .remove();
    const type = this.state.point.geometry.type === 'Point'
      ? 'pois'
      : 'routes';
    $.ajax({
      url: `/${type}/${this.state.point._id}`,
      type: 'patch',
      headers: {
        'Content-type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify(this.state.point),
    }).done( /*istanbul ignore next*/(data) => {
      window
        .location
        .reload(true);
      // dispatch(actions.updateGeoJSON(this.state.point));
      // dispatch(actions.updateMap());
    });
  }
  isRoute() {
    const {point} = this.state;
    if (point) {
      return point.geometry.type === 'Point'
        ? {
          display: 'none'
        }
        : {};
    }
    return {};
  }
  listData() {
    const {searchText, geoJSON: {features}} = this.props;
    const {updateSearchText} = searchText;
    if (features === undefined) {
      return [];
    }
    return features
      .map((point) => {
        const id = point._id;
        const {name, desc, condition, last} = point.properties;
        return name.match(new RegExp(updateSearchText, 'i'))
          ? (
            <tr onClick={this.select(point, id)} id={id} style={{
              cursor: 'pointer'
            }} className='point-of-interest' key={id}>
              <td>{name}</td>
              <td>{desc}</td>
              <td>{condition}</td>
              <td>{last}</td>
            </tr>
          )
          : null;
      });
  }
  markForDelete() {
    const {id} = this.state;
    const {userSession} = this.props;
    const type = this.state.point.geometry.type === 'Point'
      ? 'pois'
      : 'routes';
    if (!userSession.xAuth) {
      alert('You must sign-in in order to delete items');
      return;
    }
    if (confirm('Are you sure you want to delete this item?')) {
      $
        .ajax({url: `/${type}/${id}`, type: 'delete'})
        .done((data) => {
          window
            .location
            .reload(true);
        });
    }
  }
  quickDelete(e) {
    e.preventDefault();
    const {del, deleteN, point} = this.state;
    const {coordinates, type} = point.geometry;
    if(type !== 'LineString') return;
    if (del === 'first') {
      const newCoords = coordinates.slice(deleteN);
      this.setState({
        point: {
          ...this.state.point,
          geometry: {
            ...point.geometry,
            coordinates: newCoords,
          },
        },
        deletes: [
          ...this.state.deletes, {
            side: 'first',
            coords: coordinates.slice(0, deleteN),
          },
        ],
      });
    } else if (del === 'last') {
      const newCoords = coordinates.slice(0, coordinates.length - deleteN);
      this.setState({
        point: {
          ...this.state.point,
          geometry: {
            ...point.geometry,
            coordinates: newCoords,
          },
        },
        deletes: [
          ...this.state.deletes, {
            side: 'last',
            coords: coordinates.slice(coordinates.length - deleteN),
          },
        ],
      });
    }
  }
  select(point, id) {
    return /*istanbul ignore next*/ () => {
      this.setState({id: id, point: point});
      $('#select-poi-route').modal('hide');
      $('#update-poi-route').modal('show');
    };
  }
  /*ignore istanbul next*/
  shouldComponentUpdate(nextProps, nextState) {
    //Don't re-render whole component when Preview Map updates
    return this.state.map === nextState.map;
  }
  undoDelete(e) {
    e.preventDefault();
    const {deletes, point} = this.state;
    const mostRecent = deletes.pop();
    if (mostRecent.side === 'first') {
      this.setState({
        point: {
          ...this.state.point,
          geometry: {
            ...point.geometry,
            coordinates: [
              ...mostRecent.coords,
              ...point.geometry.coordinates,
            ],
          },
        },
        deletes,
      });
    } else if (mostRecent.side === 'last') {
      this.setState({
        point: {
          ...this.state.point,
          geometry: {
            ...point.geometry,
            coordinates: [
              ...point.geometry.coordinates,
              ...mostRecent.coords,
            ],
          },
        },
        deletes,
      });
    }
  }
  render() {
    const {dispatch} = this.props;
    const {point} = this.state;
    console.log(point);
    if (point) {
      /*eslint-disable no-var*/
      var {properties, geometry} = point;
      var {name, desc, condition} = properties;
      mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';
      if (this.state.map !== null) {
        this
          .state
          .map
          .remove();
      }
      var map = new mapboxgl.Map({
        container: 'preview-map',
        style: 'mapbox://styles/mapbox/outdoors-v9',
        center: geometry.type === 'Point'
          ? geometry.coordinates
          : [...geometry.coordinates[0]],
        zoom: 12,
        hash: false,
        interactive: true,
      });

      map.on('load', () => {
        //place userSession
        map.addSource('preview', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [point],
          },
        });
        switch (point.geometry.type) {
          case 'Point':
            var layerType = 'symbol';
            var layout = {
              'icon-image': 'marker-15',
              'text-field': '{name}',
              'text-font': [
                'Open Sans Regular', 'Arial Unicode MS Regular',
              ],
              'text-size': 10,
              'text-offset': [
                0, 0.6,
              ],
              'text-anchor': 'top',
            };
            break;
          case 'LineString':
            var layerType = 'line';
            var layout = {
              'line-join': 'round',
              'line-cap': 'round',
            };
            map.addLayer({
              'id': 'preview label',
              'type': 'symbol',
              'source': 'preview',
              'layout': {
                'text-field': '{name}',
                'text-font': [
                  'Open Sans Regular', 'Arial Unicode MS Regular',
                ],
                'text-size': 10,
                'text-offset': [
                  0, 0.6,
                ],
                'text-anchor': 'top',
              },
            });
            break;
          default:
            throw new Error(`Unknown feature type ${layerType}`);
        }
        map.addLayer({'id': 'preview', 'type': layerType, 'source': 'preview', 'layout': layout});
        this.setState({map});
      });
    }
    return (
      <div>
        <div id='select-poi-route' className='modal fade'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
                <h4 className='modal-title'>Update POI or Route</h4>
              </div>
              <div className='modal-body'>
                <div className='search-box'>
                  <div>
                    <input className='form-control' type='search' id='update-searchText' ref='updatesearchText' placeholder='Search' onChange={() => {
                      dispatch(actions.setUpdateSearchText(this.refs.updatesearchText.value));
                    }}/>
                  </div>
                </div>
                <table className='list-box table table-striped'>
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
              <div className='modal-footer'>
                <button type='submit' className='btn btn-secondary' data-dismiss='modal'>Close</button>
              </div>
            </div>
          </div>
        </div>

        <div id='update-poi-route' className='modal fade'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
                <button className='btn btn-danger delete-feature' onClick={this.markForDelete}>
                  <i className='fa fa-trash'></i>
                </button>
                <h4 className='modal-title'>Update POI or Route</h4>
              </div>
              <div className='modal-body'>
                <p>Instructions:</p>
                <p>Make changes to the geoJSON data for the selected POI or Route and view them in the preview map. When you are satisfied with your changes, click save.</p>

                <form onSubmit={this.formSubmit.bind(this)} onChange={this.formChange} id='updateform' ref='updateform' className='form-horizontal'>
                  <div className='form-group'>
                    <label htmlFor='name' className='col-xs-2 control-label'>Name</label>
                    <div className='col-xs-10'>
                      <input className='form-control' id='name' ref='name' type='text' value={name} />
                    </div>
                  </div>
                  <div className='form-group '>
                    <label htmlFor='desc' className='col-xs-2 control-label'>Description</label>
                    <div className='col-xs-10'>
                      <input className='form-control' id='desc' ref='desc' type='text' value={desc} />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='cond' className='col-xs-2 control-label'>Condition</label>
                    <div className='col-xs-10'>
                      <input className='form-control' id='cond' ref='cond' type='text' value={condition} />
                    </div>
                  </div>
                  <div className='form-group'>
                    <div className='col-xs-8'>
                      <textarea id='edit-json-coordinates'
                        className='form-control col-xs-8'
                        ref='geometry'
                        rows='10'
                        wrap='soft'
                        required
                        value={JSON.stringify(geometry
                          ? geometry.coordinates
                        : null, null, 2)} />
                    </div>

                    <div style={this.isRoute()} className='col-xs-4'>
                      <button onClick={this.quickDelete} className='btn btn-default form-control'>Quick Delete</button>
                      <br/>
                      <br/>
                      <div className='form-check'>
                        <div className='form-inline col-xs-6'>
                          <label className='form-check-label'>
                            <input onChange={this.deleteFirst} type='radio' name='delete-type' ref='first' value='first' checked={this.state.del === 'first'}/>
                            &nbsp; First
                          </label>
                        </div>

                        <div className='col-xs-6'>
                          <label className='form-check-label'>
                            <input onChange={this.deleteLast} type='radio' name='delete-type' ref='last' value='last' checked={this.state.del === 'last'}/>
                            &nbsp; Last
                          </label>
                        </div>
                      </div>
                      <div className='form-check'>
                        <div className='col-xs-6'>
                          <label className='form-check-label'>
                            <input onChange={this.deleteTen} type='radio' name='deleteN' ref='ten' value='ten' checked={this.state.deleteN === 10}/>
                            &nbsp; 10
                          </label>
                        </div>
                        <div className='col-xs-6'>
                          <label className='form-check-label'>
                            <input onChange={this.deleteHund} type='radio' name='deleteN' ref='hund' value='hund' checked={this.state.deleteN === 100}/>
                            &nbsp; 100
                          </label>
                          <br/>
                          <br/>
                        </div>
                      </div>

                      <button onClick={this.undoDelete} className='btn btn-default form-control'>Undo Delete</button>
                    </div>
                  </div>
                </form>

                <div id='preview-map'></div>
              </div>
              <div className='modal-footer'>
                <button className='btn btn-secondary' data-dismiss='modal'>Cancel</button>
                <button onClick={this
                  .formSubmit
                  .bind(this)} type='submit' className='btn btn-primary' data-dismiss='modal'>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(UpdatePOIorRoute);
