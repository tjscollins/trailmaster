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
      $('#Header').css('height', '51px');
      setTimeout(() => {
        $('.headerhidecontrols').css('display', 'inline-block');
      }, 350);
    } else {
      //show UI
      $('div.controls').removeClass('hide-left');
      $('.hidecontrols').removeClass('fa-arrow-right');
      $('.hidecontrols').addClass('fa-arrow-left');
      $('#Header').removeClass('minified-header');
      setTimeout(() => {
        $('#Header').css('height', 'auto');
        $('.headerhidecontrols').css('display', 'none');
      }, 350);
    }
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
          <a className='navbar-brand' href='#' onClick={this.hide}>
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
              <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Settings <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li>
                  <a className='autocenter' onClick={this.toggleAutoCenter} style={{
                    cursor: 'pointer'
                  }}>{autoCenter()}</a>
                </li>
                <li><a href='#'>Set Distance Filter</a></li>
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
        {/* <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
          <ul className='nav navbar-nav'>
            <li className='active'><a href='#'>Link <span className='sr-only'>(current)</span></a></li>
            <li><a href='#'>Link</a></li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Dropdown <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><a href='#'>Action</a></li>
                <li><a href='#'>Another action</a></li>
                <li><a href='#'>Something else here</a></li>
                <li role='separator' className='divider'></li>
                <li><a href='#'>Separated link</a></li>
                <li role='separator' className='divider'></li>
                <li><a href='#'>One more separated link</a></li>
              </ul>
            </li>
          </ul>
          <form className='navbar-form navbar-left'>
            <div className='form-group'>
              <input type='text' className='form-control' placeholder='Search' />
            </div>
            <button type='submit' className='btn btn-default'>Submit</button>
          </form>
          <ul className='nav navbar-nav navbar-right'>
            <li><a href='#'>Link</a></li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Dropdown <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><a href='#'>Action</a></li>
                <li><a href='#'>Another action</a></li>
                <li><a href='#'>Something else here</a></li>
                <li role='separator' className='divider'></li>
                <li><a href='#'>Separated link</a></li>
              </ul>
            </li>
          </ul>
        </div> */}
      </nav>
    );
  }
}

export default connect((state) => state)(Header);
