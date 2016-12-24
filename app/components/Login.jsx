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
    //this._bind(...local methods) from BaseComponent
    this.login = this
      .login
      .bind(this);
    this.create = this
      .create
      .bind(this);
    this.state = {
      wrongPassword: ''
    };
  }
  create() {
    var {dispatch} = this.props;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('POST', '/users', false);
    xmlHTTP.setRequestHeader('Content-type', 'application/json');
    xmlHTTP.send(JSON.stringify({email: this.refs.createEmail.value, password: this.refs.createPassword.value}));

    if (xmlHTTP.status === 200) {
      // console.log('Successful account creation');
      dispatch(actions.login(xmlHTTP.getResponseHeader('x-auth'), JSON.parse(xmlHTTP.responseText)._id, this.createEmail.value));
    } else {
      console.log('Error creating account', xmlHTTP);
    }
  }
  forgotPassword() {
    $('#login-modal').modal('hide');
    $('#pw-recovery').modal('show');
  }
  login() {
    var {dispatch} = this.props;
    var {password, email} = this.refs;
    var sendLoginRequest = (login) => {
      var xmlHTTP = new XMLHttpRequest();
      xmlHTTP.open('POST', '/users/login', false);
      xmlHTTP.setRequestHeader('Content-type', 'application/json');
      xmlHTTP.send(JSON.stringify(login));
      return xmlHTTP;
    };
    var response = sendLoginRequest({email: email.value, password: password.value});

    if (response.status === 200) {
      console.log('Successful login', response, response.getResponseHeader('x-auth'));
      dispatch(actions.login(response.getResponseHeader('x-auth'), JSON.parse(response.responseText)._id, email.value));
      this.refs.email.value = '';
      this.refs.password.value = '';
      $('#login-modal').modal('hide');
      $('.wrong-password').css('color', 'white');
    } else {
      console.log('Login error', response);
      $('.wrong-password').css('color', 'red');
      setTimeout(() => {
        $('.wrong-password').css('color', 'white');
      }, 1500);
    }
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
