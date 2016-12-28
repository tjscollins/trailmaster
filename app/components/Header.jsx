/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import uuid from 'uuid';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Header extends BaseComponent {
  constructor() {
    super();
    this._bind('logout', 'toggleAutoCenter');
  }
  hide() {
    if ($('.hidecontrols').hasClass('fa-arrow-left')) {
      //hide UI
      $('div.controls').addClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-left');
      $('.hidecontrols').addClass('fa-arrow-right');
      $('#Header').addClass('minified-header');
      $('.headerhidecontrols').css('display', 'inline-block');
    } else {
      //show UI
      $('div.controls').removeClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-right');
      $('.hidecontrols').addClass('fa-arrow-left');
      $('#Header').removeClass('minified-header');
      $('.headerhidecontrols').css('display', 'none');
    }
  }
  logout() {
    var {dispatch, userSession} = this.props;
    $.ajax({
      url: '/users/me/token',
      type: 'DELETE',
      beforeSend: function(request) {
        request.setRequestHeader('x-auth', userSession.xAuth);
      },
      success: function(result) {
        dispatch(actions.logout());
        dispatch(actions.clearTrails());
      },
      error: function(jqXHR, status, err) {
        console.log(`Error logging out: ${err}`, jqXHR);
      }
    });
  }
  manageLoginDisplay() {
    var {userSession} = this.props;
    return userSession.xAuth
      ? [(
          <li key={uuid()}>
            <a href="#">{userSession.email}</a>
          </li>
        ), (
          <li key={uuid()}>
            <a href="#" onClick={this.logout}>Log out</a>
          </li>
        )]
      : [(
          <li key={uuid()}>
            <a href="#" onClick={this.showAccountCreator}>Create Account</a>
          </li>
        ), (
          <li key={uuid()}>
            <a href="#" onClick={this.showLogin}>Sign-in</a>
          </li>
        )];
  }
  showAccountCreator() {
    $('#account-creator').modal('show');
  }
  showLogin() {
    $('#login-modal').modal('show');
  }
  toggleAutoCenter() {
    console.log('Click!');
    this
      .props
      .dispatch(actions.toggleMapCentering());
  }
  render() {
    var {userLocation} = this.props;
    var autoCenter = () => {
      return userLocation.mapCentering
        ? 'Disable Auto-Center'
        : 'Enable Auto-Center';
    };
    return (
      <nav id="Header" className="navbar navbar-default navbar-fixed-top">
        <div className="navbar-header">
          <a className="navbar-brand" href="#" onClick={this.hide}>
            <i className="fa fa-compass" aria-hidden="true"/>TrailMaster &nbsp;
            <i className="headerhidecontrols fa fa-arrow-right" aria-hidden="true"/></a>
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarui" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbarui">
          <ul className="nav navbar-nav navbar-left">
            {this.manageLoginDisplay()}
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a className="autocenter" onClick={this.toggleAutoCenter} style={{
                cursor: 'pointer'
              }}>{autoCenter()}</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default connect(state => state)(Header);
