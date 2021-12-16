import "./home.css";
import axios from "axios";
import React from "react";
import { useState } from "react";
export default class Home extends React.Component {
  state = {};

  render() {
    return (
      <div id="home">
        <Header />
        <Form />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return <div id="header">Daishnary</div>;
  }
}

class Form extends React.Component {
  state = {
    status: {},
    input: "",
    data: null,
  };
  constructor(props) {
    super(props);
    this.statusElement = React.createRef();
  }
  getMeaning = () => {
    if (this.state.input.trim() == "") {
      return;
    }
    axios
      .get(
        `http://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:80/api/` +
          this.state.input +
          "/"
      )
      .then((res) => {
        console.log(res.data);
        const data_w = res.data;
        this.statusElement.current.changeContent(data_w);
      });
  };
  AddWord = () => {};
  setInput = (word) => {
    this.setState({ input: word });
  };

  render() {
    return (
      <div id="form-container">
        <input
          value={this.state.input}
          onInput={(e) => this.setInput(e.target.value)}
          type="text"
          id="word-input"
          name="word"
        />
        <div className="button-panel">
          <button onClick={this.getMeaning} className="action-button">
            Get Meaning
          </button>
          <button onClick={this.AddWord} className="action-button">
            Add Word
          </button>
        </div>
        <Status ref={this.statusElement} />
      </div>
    );
  }
}

class Status extends React.Component {
  state = {
    data: null,
  };
  changeContent = (data_w) => {
    this.setState({
      data: data_w,
    });
  };
  render() {
    return <div id="status-container">{JSON.stringify(this.state.data)}</div>;
  }
}
