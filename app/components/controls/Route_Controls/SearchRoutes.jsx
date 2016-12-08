/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux Store----------*/
import * as actions from 'actions';

class SearchRoutes extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    var {dispatch} = this.props;
    return (
      <div className="search-box">
        <div>
          <input className="form-control" type="search" id="routes-searchText" ref="routessearchText" placeholder="Search Points of Interest" onChange={() => {
            dispatch(actions.setRoutesSearchText(this.refs.routessearchText.value));
          }}/>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(SearchRoutes);
