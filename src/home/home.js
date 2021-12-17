import "./home.css";
import axios from "axios";
import React from "react";
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
    if (this.state.input.trim() === "") {
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
  AddWord = () => {
    if (this.state.input.trim() === "") {
      return;
    }
    axios
      .post(
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
    msgcode: 0,
  };
  changeContent = (data_w) => {
    this.setState({
      data: data_w,
    });
  };

  render() {
    return this.state.data != null ? (
      this.state.data.Success == null ? (
        <div id="status-container">
          <div className="word-heading">
            {this.state.data == null ? <div></div> : this.state.data.word}
          </div>
          <div className="meaning-set">
            {this.state.data == null ? (
              <div></div>
            ) : (
              this.state.data.meanings.map((meaning) => (
                <div className="meaning-container">
                  <div className="pos">{meaning.partOfSpeech}</div>
                  {meaning.definitions.map((def) => (
                    <div className="def-container">
                      <div className="def">{def.definition}</div>
                      {def.example != null ? (
                        <div className="exp"> Example: "{def.example}"</div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div id="message-container">
          <div className="Message">{this.state.data.Message}</div>
        </div>
      )
    ) : (
      <div></div>
    );
  }
}
