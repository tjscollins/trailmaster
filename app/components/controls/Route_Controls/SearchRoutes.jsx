/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux Store----------*/
// import * as actions from 'actions';

class SearchRoutes extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    return (
      <div className="search-box">
        <div>
          <input className="form-control" type="search" ref="searchText" placeholder="Search Points of Interest" onChange={() => {
            var searchText = this.refs.searchText.value;/*dispatch(actions.setSearchText(searchText)); */
          }}/>
        </div>
      </div>
    );
  }
}

export default SearchRoutes;
