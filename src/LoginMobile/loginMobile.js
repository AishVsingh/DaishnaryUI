import axios from "axios";
import React from "react";
import "./loginMobile.css";
export default class Login extends React.Component {
  state = {};

  render() {
    return (
      <div id="home-mobile">
        <HeaderMobile />
        <FormMobile Redirecthandler={this.props.handler} />
      </div>
    );
  }
}

class HeaderMobile extends React.Component {
  render() {
    return (
      <div>
        <div id="header-mobile-login">Daishnary</div>
        <div id="sub-header-mobile">Login</div>
      </div>
    );
  }
}

class FormMobile extends React.Component {
  state = {
    status: "Welcome!",
    username: "",
  };

  getBaseUrl = () => {
    return `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/auth/`;
  };

  getCreds = () => {
    return {
      username: document.getElementById("username-login-input-mobile").value,
      password: document.getElementById("password-login-input-mobile").value,
    };
  };

  setStatus = (msg) => {
    if (msg.trim() != "") this.setState({ status: msg });
  };

  redirect = (token) => {
    if (token !== null)
      this.props.Redirecthandler({
        auth: true,
        token: token,
        username: document
          .getElementById("username-login-input-mobile")
          .value.trim(),
      });
  };

  logIn = () => {
    try {
      axios
        .post(this.getBaseUrl(), this.getCreds())
        .then((res) => {
          if (res.status === 200) {
            this.setStatus("Login sucessful !");
            this.redirect(res.data.token);
          }
        })
        .catch((err) => {
          if (err.response) {
            switch (err.response.status) {
              case 400:
                this.setStatus("Bad credentials.\n\nTry again!");
                break;
              case 401:
                this.setStatus("You are not authorized!");
                break;
              case 403:
                this.setStatus("Permission Denied !");
                break;
              default:
                this.setStatus("login Failed.\n\nUnknown error!");
                break;
            }
          }
        });
    } catch (error) {}
  };

  render() {
    return (
      <div>
        <div id="form-container-mobile">
          <div id="login-status-box">{this.state.status}</div>
          <input
            type="text"
            id="username-login-input-mobile"
            className="login-input-mobile"
            name="username"
          />
          <input
            type="password"
            id="password-login-input-mobile"
            className="login-input-mobile"
            name="password"
          />
          <div className="button-panel-mobile">
            <button onClick={this.logIn} className="action-button-mobile">
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }
}
