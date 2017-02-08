/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import uuid from 'uuid';
import {toggleUI} from 'TrailmasterAPI';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Header extends BaseComponent {
  constructor() {
    super();
    this._bind('logout', 'toggleAutoCenter');
  }
  logout() {
    let {dispatch, userSession} = this.props;
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
    let {userSession} = this.props;
    return userSession.xAuth
      ? [(
          <li key={uuid()}>
            <a href='#'>{userSession.email}</a>
          </li>
        ), (
          <li key={uuid()}>
            <a href='#' onClick={this.logout}>Log out</a>
          </li>
        )]
      : [(
          <li key={uuid()}>
            <a href='#' onClick={this.showAccountCreator}>Create Account</a>
          </li>
        ), (
          <li key={uuid()}>
            <a href='#' onClick={this.showLogin}>Sign-in</a>
          </li>
        )];
  }
  setDistanceFilter() {
    $('#distance-filter').modal('show');
  }
  showAccountCreator() {
    $('#account-creator').modal('show');
  }
  showFAQ() {
    $('#faq-modal').modal('show');
  }
  showLogin() {
    $('#login-modal').modal('show');
  }
  toggleAutoCenter() {
    this
      .props
      .dispatch(actions.toggleMapCentering());
  }
  render() {
    let {userLocation} = this.props;
    let autoCenter = () => {
      return userLocation.mapCentering
        ? 'Disable Auto-Center'
        : 'Enable Auto-Center';
    };
    return (
      <nav id='Header' className='navbar navbar-default navbar-fixed-top'>
        <div className='navbar-header'>
          <a className='navbar-brand' href='#' onClick={toggleUI.bind(this, 350)}>
            <i className='fa fa-compass' aria-hidden='true' />TrailMaster &nbsp;
            <i className='headerhidecontrols fa fa-arrow-right' aria-hidden='true' /></a>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbarui' aria-expanded='false'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar' />
            <span className='icon-bar' />
            <span className='icon-bar' />
          </button>
        </div>

        <div className='collapse navbar-collapse' id='navbarui'>
          <ul className='nav navbar-nav navbar-left'>
            {this.manageLoginDisplay()}
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button'
                aria-haspopup='true' aria-expanded='false'>Settings <span className='caret' /></a>
              <ul className='dropdown-menu'>
                <li>
                  <a className='autocenter' onClick={this.toggleAutoCenter} style={{
                    cursor: 'pointer'
                  }}>{autoCenter()}</a>
                </li>
                <li><a href='#' onClick={this.setDistanceFilter}>Set Distance Filter</a></li>
                {/* <li><a href='#'>Something else here</a></li>
                  <li role='separator' className='divider'></li>
                  <li><a href='#'>Separated link</a></li>
                  <li role='separator' className='divider'></li>
                <li><a href='#'>One more separated link</a></li> */}
              </ul>
            </li>

            <li>
              <a onClick={this.showFAQ} style={{
                cursor: 'pointer'
              }}>FAQ</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default connect((state) => state)(Header);
