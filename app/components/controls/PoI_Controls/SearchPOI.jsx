/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux Store----------*/
import * as actions from 'actions';

class SearchPOI extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
  }
  render() {
    var {dispatch} = this.props;
    return (
      <div className="search-box">
        <div>
          <input className="form-control" type="search" id="poi-searchText" ref="poisearchText" placeholder="Search Points of Interest" onChange={() => {
            console.log(this.refs.poisearchText.value);
            dispatch(actions.setPOISearchText(this.refs.poisearchText.value));
          }}/>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(SearchPOI);
