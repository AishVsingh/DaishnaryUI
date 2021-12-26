import "./home.css";
import axios from "axios";
import React from "react";
export default class Home extends React.Component {
  state = {};

  render() {
    return (
      <div id="home">
        <Header />
        <MetaData />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return <div id="header">Daishnary</div>;
  }
}

class MetaData extends React.Component {
  state = {
    count: 0,
  };
  constructor(props) {
    super(props);

    this.handler = this.handler.bind(this);
  }

  handler() {
    try {
      axios
        .get(
          `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/metadata/count`
        )
        .then((res) => {
          console.log(res.data);
          const count_w = res.data["word-count"];
          this.setState({ count: count_w });
        })
        .catch((err) => {
          window.alert(err);
        });
    } catch (err) {
      window.alert(err.message);
    }
  }
  componentDidMount() {
    try {
      axios
        .get(
          `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/metadata/count`
        )
        .then((res) => {
          console.log(res.data);
          const count_w = res.data["word-count"];
          this.setState({ count: count_w });
        })
        .catch((err) => {
          window.alert(err);
        });
    } catch (err) {
      window.alert(err.message);
    }
  }
  render() {
    return (
      <div id="top-container">
        <div id="meta-data">
          <div id="meta-data-count"> Count : {this.state.count}</div>
        </div>
        <Form handler={this.handler} />
      </div>
    );
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
  getBaseUrl = () => {
    return (
      `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/words/` +
      this.state.input.toLowerCase().trim() +
      "/"
    );
  };
  getMeaning = () => {
    if (this.state.input.trim() === "") {
      return;
    }
    axios
      .get(this.getBaseUrl())
      .then((res) => {
        const data_w = res.data;
        this.statusElement.current.changeContent(data_w);
      })
      .catch((err) => {
        window.alert(err);
      });
  };
  AddWord = () => {
    if (this.state.input.trim() === "") {
      return;
    }
    axios
      .post(this.getBaseUrl())
      .then((res) => {
        console.log(res.data);
        const data_w = res.data;
        this.props.handler();
        this.statusElement.current.changeContent(data_w);
      })
      .catch((err) => {
        window.alert(err);
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
          <button
            onTouchStart={this.getMeaning}
            onClick={this.getMeaning}
            className="action-button"
          >
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
