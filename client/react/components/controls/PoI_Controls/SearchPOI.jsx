/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux Store----------*/
import * as actions from 'actions';

export class SearchPOI extends BaseComponent {
  constructor() {
    super();
  }
  render() {
    var {dispatch} = this.props;
    return (
      <div className="search-box">
        <div>
          <input className="form-control" type="search" id="poi-searchText" ref="poisearchText" placeholder="Search Points of Interest" onChange={() => {
            dispatch(actions.setPOISearchText(this.refs.poisearchText.value));
          }}/>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(SearchPOI);
