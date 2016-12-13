/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

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
    this.logout = this
      .logout
      .bind(this);
  }
  handleCheckbox() {
    //Toggle Map-Centering
    var {dispatch} = this.props;
    dispatch(actions.toggleMapCentering());
  }
  login() {
    $('#login-modal').modal('show');
  }
  logout() {
    var {dispatch} = this.props;
    dispatch(actions.logout());
    dispatch(actions.clearTrails());
  }
  manageLogin() {
    var {userSession} = this.props;
    return userSession.xAuth
      ? <a href="#" onClick={this.logout}>Log out</a>
      : <a href="#" onClick={this.login}>Sign-in</a>;
  }
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <i className="fa fa-compass" aria-hidden="true"></i>TrailMaster</a>
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav"></ul>
            <ul className="nav navbar-nav navbar-right">
              <li id="centermap-checkbox">
                <input type="checkbox" onChange={this.handleCheckbox} ref="centerMap" checked={this.props.userLocation.mapCentering} value="centermap"/>
              </li>
              <li>
                <a>Keep Map Centered</a>
              </li>
              <li>
                {this.manageLogin()}
              </li>
            </ul>

          </div>
        </div>
      </nav>
    );
  }
}

export default connect(state => state)(Header);
