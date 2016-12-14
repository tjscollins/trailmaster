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
  createAccount() {
    $('#account-creator').modal('show');
  }
  handleCheckbox() {
    this
      .props
      .dispatch(actions.toggleMapCentering());
  }
  login() {
    $('#login-modal').modal('show');
  }
  logout() {
    var {dispatch, userSession} = this.props;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('DELETE', '/users/me/token', false);
    xmlHTTP.setRequestHeader('x-auth', userSession.xAuth);
    xmlHTTP.send(null);
    dispatch(actions.logout());
    dispatch(actions.clearTrails());
  }
  manageLogin() {
    var {userSession} = this.props;
    return userSession.xAuth
      ? [(
          <li>
            <a href="#">{userSession.email}</a>
          </li>
        ), (
          <li>
            <a href="#" onClick={this.logout}>Log out</a>
          </li>
        )]
      : [(
          <li>
            <a href="#" onClick={this.createAccount}>Create Account</a>
          </li>
        ), (
          <li>
            <a href="#" onClick={this.login}>Sign-in</a>
          </li>
        )];
  }
  hide() {
    if ($('.hidecontrols').hasClass('fa-arrow-left')) {
      //hide UI
      $('div.controls').addClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-left');
      $('.hidecontrols').addClass('fa-arrow-right');
      $('#Header').addClass('minified-header');
      $('.headerhidecontrols').css('display', 'inline-block');
      // $('.mapviewer').css('top', '0');
    } else {
      //show UI
      $('div.controls').removeClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-right');
      $('.hidecontrols').addClass('fa-arrow-left');
      $('#Header').removeClass('minified-header');
      $('.headerhidecontrols').css('display', 'none');
      // $('.mapviewer').css('top', '50px');
    }
  }
  render() {
    return (
      <nav id="Header" className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#" onClick={this.hide}>
              <i className="fa fa-compass" aria-hidden="true"/>TrailMaster &nbsp;
              <i className="headerhidecontrols fa fa-arrow-right" aria-hidden="true"/></a>
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarui">
            <ul className="nav navbar-nav navbar-left">
              {this.manageLogin()}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li id="centermap-checkbox">
                <input type="checkbox" onChange={this.handleCheckbox} ref="centerMap" checked={this.props.userLocation.mapCentering} value="centermap"/>
              </li>
              <li>
                <a>Keep Map Centered</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(state => state)(Header);
