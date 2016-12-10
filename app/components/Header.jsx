/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
// import 'bootstrap';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Header extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods) from BaseComponent
    this.handleCheckbox = this
      .handleCheckbox
      .bind(this);
  }
  handleCheckbox() {
    //Toggle Map-Centering
    var {dispatch} = this.props;
    dispatch(actions.toggleMapCentering());
  }
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">TrailMaster</a>
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              {/* <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown
                <span className="caret"/>
                </a>
                <ul className="dropdown-menu">
                <li>
                <a href="#">Action</a>
                </li>
                <li>
                <a href="#">Another action</a>
                </li>
                <li>
                <a href="#">Something else here</a>
                </li>
                <li role="separator" className="divider"/>
                <li>
                <a href="#">Separated link</a>
                </li>
                <li role="separator" className="divider"/>
                <li>
                <a href="#">One more separated link</a>
                </li>
                </ul>
              </li> */}

            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#">Sign-in</a>
              </li>
            </ul>
            <form className="navbar-form navbar-right">
              <div className="header-search form-group">
                <input type="text" className="header-search-input form-control" placeholder="Search for Points of Interest, Routes, or Trails"/>
              </div>
              <div className="form-group">
                <input type="checkbox" onChange={this.handleCheckbox} ref="centerMap" checked={this.props.userLocation.mapCentering} value="centermap"/>
                Keep Map Centered
              </div>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(state => state)(Header);
