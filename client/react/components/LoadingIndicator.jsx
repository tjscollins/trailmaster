/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class LoadingIndicator extends BaseComponent {
  constructor() {
    super();
  }

  render() {
    const {loading} = this.props;
    const loadingStyle = {
      'position': 'fixed',
      'top': '0px',
      'left': '0px',
      'zIndex': '10000',
      'width': '100%',
      'height': '100%',
      'background': 'rgba(0,0,0,0.5)'
    };
    return loading
      ? (<div className='loading-indicator' style={loadingStyle}>
        <div
          className='uil-spin-css'
          style={{
            transform: 'scale(0.6)'
          }}>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
        </div>
      </div>)
      : <div />;
  }
}


/**
 * mapStateToProps - convert redux store to component props
 *
 * @param  {object} state redux state
 * @return {object}       component props
 */
function mapStateToProps(state) {
  const loading = state.map.center === undefined || state.geoJSON.features === undefined;
  return {loading};
}

export default connect(mapStateToProps)(LoadingIndicator);
