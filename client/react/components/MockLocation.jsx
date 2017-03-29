/*----------Modules----------*/
import React from 'react';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import {mockPOS, unMockPos} from 'actions';
import {connect} from 'react-redux';
import {toInt} from 'validator';

export class MockLocation extends BaseComponent {
  constructor() {
    super();
    this._bind(['submit', 'clear']);
  }
  clear(e) {
    let {dispatch} = this.props;
    e.preventDefault();
    $('#mock-location').modal('hide');
    let {latitude, longitude} = this.refs;
    latitude.value = '';
    longitude.value = '';
    dispatch(unMockPos());
  }
  submit(e) {
    let {dispatch} = this.props;
    e.preventDefault();
    $('#mock-location').modal('hide');
    let {latitude, longitude} = this.refs;
    let lat = toInt(latitude.value);
    let lng = toInt(longitude.value);
    if(!Number.isNaN(lat) && !Number.isNaN(lng)) {
      dispatch(mockPOS({coords: {latitude: lat, longitude: lng}}));
    }
  }
  render() {
    const {latitude, longitude} = this.props.userSession.coords;
    return (
      <div id='mock-location' className='modal fade'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
              <h4 className='modal-title'>Search Near</h4>
            </div>

            <div className='modal-body'>
              <form onSubmit={this.submit} className='form-inline'>
                <div className='form-group'>
                  <p>Fetch Data Near:</p>

                  <div className='input-group'>
                    <label className='sr-only' htmlFor='latitude'>Latitude to search near:</label>
                    <div className='input-group-addon'>Latitude</div>
                    <input type='text' className='form-control' ref='latitude' placeholder={`${latitude}`} />
                    <label className='sr-only' htmlFor='longitude'>Longitude to search near:</label>
                    <div className='input-group-addon'>Longitude</div>
                    <input type='text' className='form-control' ref='longitude' placeholder={`${longitude}`} />
                  </div>
                </div>
              </form>
            </div>

            <div className='modal-footer'>
              <button onClick={this.submit} type='button' className='btn btn-default' data-dismiss='modal'>Save</button>
              <button onClick={this.clear} type='button' className='btn btn-warning' data-dismiss='modal'>Clear</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => state)(MockLocation);
