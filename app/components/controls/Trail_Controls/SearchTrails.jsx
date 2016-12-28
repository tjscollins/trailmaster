/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux Store----------*/
import * as actions from 'actions';

class SearchTrails extends BaseComponent {
  constructor() {
    super();
  }
  render() {
    var {dispatch} = this.props;
    return (
      <div className="search-box">
        <div>
          <input className="form-control" type="search" ref="searchText" placeholder="Search Your Saved Trails" onChange={() => {
            dispatch(actions.setTrailSearchText(this.refs.searchText.value));
          }}/>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(SearchTrails);
