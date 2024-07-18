import axios from "axios";
import React from "react";
import "./loginHome.css";

export default class LoginHome extends React.Component {
  state = {};

  render() {
    return (
      <div id="home-mobile">
        <HeaderHome />
        <FormHome Redirecthandler={this.props.handler} />
      </div>
    );
  }
}

class HeaderHome extends React.Component {
  render() {
    return (
      <div>
        <div id="header">Daishnary</div>
        <div id="sub-header">Login</div>
      </div>
    );
  }
}

class FormHome extends React.Component {
  state = {
    status: "Welcome!",
    username: "",
    shake: false,
  };

  getBaseUrl = () => {
    return `https://api.aishvsingh.com/api/auth/`;
  };

  getCreds = () => {
    return {
      username: document.getElementById("username-login-input").value,
      password: document.getElementById("password-login-input").value,
    };
  };

  Shake = () => {
    this.setState({ shake: !this.state.shake });
  };

  setStatus = (msg) => {
    if (msg.trim() !== "") this.setState({ status: msg });
  };

  redirect = (token) => {
    if (token !== null)
      this.props.Redirecthandler({
        auth: true,
        token: token,
        username: document.getElementById("username-login-input").value.trim(),
      });
  };

  logIn = () => {
    try {
      axios
        .post(this.getBaseUrl(), this.getCreds())
        .then((res) => {
          if (res.status === 200) {
            this.setStatus("Login successful !");
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
            this.Shake();
            setTimeout(() => this.Shake(), 500);
          }
        });
    } catch (error) {
      console.log(error)
    }
  };

  render() {
    return (
      <div>
        <div id="form-container">
          <div
            class={this.state.shake ? "shake" : null}
            id="login-status-box-home"
          >
            {this.state.status}
          </div>
          <input
            type="text"
            id="username-login-input"
            className="login-input"
            name="username"
          />
          <input
            type="password"
            id="password-login-input"
            className="login-input"
            name="password"
          />
          <div className="button-panel">
            <button
              onClick={this.logIn}
              id="login-button"
              className="action-button"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }
}
