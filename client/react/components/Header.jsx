/*----------Modules----------*/
import React from 'react';
import PropTypes from 'prop-types';
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
      url: '/users/logout',
      type: 'GET',
      beforeSend: function(request) {
        request.setRequestHeader('x-auth', userSession.xAuth);
      },
      success: function(result) {
        dispatch(actions.logout());
        dispatch(actions.clearTrails());
      },
      error: function(jqXHR, status, err) {
        console.error(`Error logging out: ${status} ${err}`, jqXHR);
      },
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
        ),]
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
  /*istanbul ignore next*/
  setDistanceFilter() {
    $('#distance-filter').modal('show');
  }
  /*istanbul ignore next*/
  setMockLocation() {
    $('#mock-location').modal('show');
  }
  /*istanbul ignore next*/
  showAccountCreator() {
    $('#account-creator').modal('show');
  }
  /*istanbul ignore next*/
  showFAQ() {
    $('#faq-modal').modal('show');
  }
  /*istanbul ignore next*/
  showLogin() {
    $('#login-modal').modal('show');
  }
  /*istanbul ignore next*/
  toggleHeader() {
    if ($('button.navbar-toggle').hasClass('collapsed')) {
      setTimeout(() => {
        $('nav').css('height', '50px');
      }, 350);
    } else {
      $('nav').css('height', 'auto');
    }
  }
  toggleAutoCenter() {
    this
      .props
      .dispatch(actions.toggleMapCentering());
  }
  render() {
    let {userSession} = this.props;
    let autoCenter = () => {
      return userSession.mapCentering
        ? 'Disable Auto-Center'
        : 'Enable Auto-Center';
    };
    return (
      <nav id='Header' className='navbar navbar-default navbar-fixed-top'>
        <div className='navbar-header'>
          <a className='navbar-brand' href='#' onClick={toggleUI.bind(this, 350)}>
            <i className='fa fa-compass' aria-hidden='true' />TrailMaster &nbsp;
            <i className='headerhidecontrols fa fa-arrow-right' aria-hidden='true' /></a>
          <button
            type='button'
            className='navbar-toggle collapsed'
            data-toggle='collapse'
            data-target='#navbarui'
            aria-expanded='false'
            onClick={this.toggleHeader}>
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
              <a
                href='#'
                className='dropdown-toggle'
                data-toggle='dropdown'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'>Settings
                <span className='caret' /></a>
              <ul className='dropdown-menu'>
                <li>
                  <a
                    className='autocenter'
                    onClick={this.toggleAutoCenter}
                    style={{
                      cursor: 'pointer'
                    }}>{autoCenter()}</a>
                </li>
                <li>
                  <a href='#' onClick={this.setDistanceFilter}>Set Distance Filter</a>
                </li>
                <li>
                  <a href='#' onClick={this.setMockLocation}>Search Near</a>
                </li>
              </ul>
            </li>

            <li>
              <a
                onClick={this.showFAQ}
                href='#'
                style={{
                  cursor: 'pointer'
                }}>FAQ</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  userSession: PropTypes.object,
};

export default connect((state) => state)(Header);
