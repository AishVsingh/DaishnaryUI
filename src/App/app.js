// import axios from "axios";
import React from "react";
import Mobile from "../Mobile/mobile";
import Home from "../home/home";
import Login from "../LoginMobile/loginMobile";
import LoginHome from "../LoginHome/loginHome";

function getHome(user) {
  if (window.innerWidth > 600) {
    return <Home data={user} />;
  } else {
    return <Mobile data={user} />;
  }
}

function getLogin(handler) {
  if (window.innerWidth > 600) {
    return <LoginHome handler={handler} />;
  } else {
    return <Login handler={handler} />;
  }
}
export default class App extends React.Component {
  state = {
    current: <Login />,
    auth: false,
    token: "",
    username: "",
  };
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
  }
  handler = (data) => {
    if (data.auth && data.token != null) {
      this.setState(data);
    }
  };

  render() {
    return (
      <div id="world-container">
        {this.state.auth === false
          ? getLogin(this.handler)
          : getHome({ token: this.state.token, username: this.state.username })}
      </div>
    );
  }
}
