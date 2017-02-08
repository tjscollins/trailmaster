/*----------Modules----------*/
import React from 'react';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import {updateDistanceFilter} from 'actions';
import {connect} from 'react-redux';
import {toInt} from 'validator';

export class DistanceFilter extends BaseComponent {
  constructor() {
    super();
    this._bind('submit');
  }
  submit(e) {
    let {dispatch} = this.props;
    e.preventDefault();
    if (!Number.isNaN(toInt(this.refs.distance.value))) {
      dispatch(updateDistanceFilter(toInt(this.refs.distance.value)));
      this.refs.distance.value = '';
    }
  }
  render() {
    return (
      <div id='distance-filter' className='modal fade'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
              <h4 className='modal-title'>Distance Filter</h4>
            </div>

            <div className='modal-body'>
              <form onSubmit={this.submit} className='form-inline'>
                <div className='form-group'>
                  <label className='sr-only' htmlFor='distance'>Display Features Within:</label>
                  <label htmlFor='distance'>Display Features Within:</label>
                  <div className='input-group'>
                    <input type='text' className='form-control' ref='distance' placeholder={this.props.userSession.distanceFilter} />
                    <div className='input-group-addon'>miles</div>
                  </div>
                </div>
              </form>
            </div>

            <div className='modal-footer'>
              <button onClick={this.submit} type='button' className='btn btn-default' data-dismiss='modal'>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => state)(DistanceFilter);
