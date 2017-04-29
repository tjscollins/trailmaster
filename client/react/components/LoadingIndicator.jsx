/*----------Modules----------*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

export class LoadingIndicator extends Component {
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
      ? (
        <div>
          <div className='loading-indicator' style={loadingStyle}>
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
          </div>
        </div>
      )
      : <div id='done-loading' />;
  }
}

LoadingIndicator.propTypes = {
  loading: PropTypes.bool
};

/**
 * mapStateToProps - convert redux store to component props
 *
 * @param  {object} state redux state
 * @return {object}       component props
 */
function mapStateToProps(state) {
  console.log('Loading based on: ', state.map.loaded, state.geoJSON.features);
  const loading = !state.map.loaded || state.geoJSON.features === undefined;
  return {loading};
}

export default connect(mapStateToProps)(LoadingIndicator);
