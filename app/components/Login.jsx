/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';

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
  }
  login() {
    var {dispatch} = this.props;
    var sendLoginRequest = (login) => {
      var xmlHTTP = new XMLHttpRequest();
      xmlHTTP.open('POST', '/users/login', false);
      xmlHTTP.setRequestHeader('Content-type', 'application/json');
      xmlHTTP.onload = () => {
        console.log(xmlHTTP.responseText);
      };
      xmlHTTP.send(JSON.stringify(login));
      return xmlHTTP;
    };
    var response = sendLoginRequest({email: this.refs.email.value, password: this.refs.password.value});

    if (response.status === 200) {
      console.log('Successful login', response, response.getResponseHeader('x-auth'));
      dispatch(actions.login(response.getResponseHeader('x-auth')));
      // dispatch(actions.getTrails());
    } else {
      console.log('Login error');
    }
  }
  render() {
    return (
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
              <form ref="loginForm">
                <input className="form-control" ref="email" type="text" placeholder="Email"/>
                <input className="form-control" ref="password" type="password" placeholder="Password"/>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={this.login} type="submit" className="btn btn-secondary" data-dismiss="modal">Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Login);
