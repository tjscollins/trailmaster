/*----------Modules----------*/
import React from 'react';
import {connect} from 'react-redux';
import validator from 'validator';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

/*----------Redux----------*/
import * as actions from 'actions';

export class PasswordRecovery extends BaseComponent {
  constructor() {
    super();
  }
  resetPassword() {
    var {email} = this.refs;
    if (validator.isEmail(email.value)) {
      console.log('Sending Password Reset Email');
      var resetPasswordRequest = new XMLHttpRequest();
      resetPasswordRequest.open('POST', '/users/reset', true);
      resetPasswordRequest.setRequestHeader('Content-type', 'application/json');
      resetPasswordRequest.send(JSON.stringify({email: email.value}));
      resetPasswordRequest.onload = () => {
        console.log(resetPasswordRequest);
      };
      this.refs.email.value = '';
    }
  }
  render() {
    return (
      <div>
        <div id="pw-recovery" className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Password Recovery</h4>
              </div>
              <div className="modal-body">
                <form ref="loginForm">
                  <input className="form-control" ref="email" type="text" placeholder="Email"/>
                </form>
              </div>
              <div className="modal-footer">
                <p style={{
                  float: 'left',
                  fontSize: '12px',
                  paddingTop: '10px'
                }}>
                Submitting will send a link to reset your password to your email</p>
                <button onClick={this
                  .resetPassword
                  .bind(this)} type="submit" className="btn btn-warning" data-dismiss="modal">Request Password Reset Link</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordRecovery;
