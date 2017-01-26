/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux Store----------*/
import * as actions from 'actions';

export class SearchRoutes extends BaseComponent {
  constructor() {
    super();
  }
  render() {
    var {dispatch} = this.props;
    return (
      <div className="search-box">
        <div>
          <input className="form-control" type="search" id="routes-searchText" ref="routessearchText" placeholder="Search Routes" onChange={() => {
            dispatch(actions.setRoutesSearchText(this.refs.routessearchText.value));
          }}/>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(SearchRoutes);
