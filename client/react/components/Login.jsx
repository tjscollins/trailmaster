/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class Login extends BaseComponent {
  constructor() {
    super();
    this._bind('create', 'login');
    this.state = {
      wrongPassword: ''
    };
  }
  create() {
    var {dispatch} = this.props;
    var createAccountRequest = $.ajax({
      url: '/users',
      type: 'post',
      beforeSend: function(request) {
        request.setRequestHeader('Content-type', 'application/json');
      },
      data: JSON.stringify({email: this.refs.createEmail.value, password: this.refs.createPassword.value})
    });

    createAccountRequest.done((res, status, jqXHR) => {
      dispatch(actions.login(jqXHR.getResponseHeader('x-auth'), JSON.parse(jqXHR.responseText)._id, this.refs.createEmail.value));
    });

    createAccountRequest.fail((jqXHR, status, err) => {
      console.log(`Error creating account: ${err}`, jqXHR);
    });
  }
  forgotPassword() {
    $('#login-modal').modal('hide');
    $('#pw-recovery').modal('show');
  }
  login(e) {
    e.preventDefault();
    let {dispatch} = this.props;
    let {password, email} = this.refs;
    let loginRequest = $.ajax({
      url: '/users/login',
      type: 'post',
      beforeSend: function(request) {
        request.setRequestHeader('Content-type', 'application/json');
      },
      data: JSON.stringify({email: email.value, password: password.value})
    });

    loginRequest.done((res, status, jqXHR) => {
      dispatch(actions.login(jqXHR.getResponseHeader('x-auth'), JSON.parse(jqXHR.responseText)._id, email.value));
      this.refs.email.value = '';
      this.refs.password.value = '';
      $('#login-modal').modal('hide');
      $('.wrong-password').css('color', 'white');
    });

    loginRequest.fail((jqXHR, status, err) => {
      console.log('Login error', jqXHR);
      $('.wrong-password').css('color', 'red');
      setTimeout(() => {
        $('.wrong-password').css('color', 'white');
      }, 1500);
    });
  }
  render() {
    return (
      <div>
        <div id="login-modal" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Login</h4>
              </div>
              <div className="modal-body">
                <form ref="loginForm" onSubmit={this.login}>
                  <input className="form-control" ref="email" type="text" placeholder="Email"/>
                  <input className="form-control" ref="password" type="password" placeholder="Password"/>
                  <button type="submit" style={{
                    display: 'none'
                  }}/>
                </form>
              </div>
              <div className="modal-footer">
                <div style={{
                  float: 'left'
                }}>
                  <a onClick={this.forgotPassword} href="#">Forgot Password?</a>
                </div>
                <div className="wrong-password">
                  <p>Incorrect email or password</p>
                </div>
                <button onClick={this.login} type="submit" className="btn btn-primary">Login</button>
              </div>
            </div>
          </div>
        </div>

        <div id="account-creator" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Create Account</h4>
              </div>
              <div className="modal-body">
                <form ref="loginForm">
                  <input className="form-control" ref="createEmail" type="text" placeholder="Email"/>
                  <input className="form-control" ref="createPassword" type="password" placeholder="Password"/>
                </form>
              </div>
              <div className="modal-footer">

                <div>
                  <button onClick={this.create} type="submit" className="btn btn-primary" data-dismiss="modal">Create</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Login);
