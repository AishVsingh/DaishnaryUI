import "./home.css";
import axios from "axios";
import React from "react";
import Loading from "./static/loading.gif";
import Delete from "./static/minus.png";
import Add from "./static/plus.png";
import Mic from "./static/mic.png";

export default class Home extends React.Component {
  state = {};

  render() {
    return (
      <div id="home">
        <Header />
        <MetaData user={this.props.data} />
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
    userData: {},
  };
  constructor(props) {
    super(props);
    this.formElement = React.createRef();
    this.handler = this.handler.bind(this);
  }

  componentDidMount() {
    this.handler();
  }

  handler() {
    try {
      axios
        .get(
          `https://api.aishvsingh.com/api/${this.props.user.username}/metadata/`,
          {
            headers: { Authorization: `Token ${this.props.user.token}` },
          }
        )
        .then((res) => {
          const res_data = res.data;
          this.setState({ userData: res_data });
        })
        .catch((err) => {
          window.alert(err);
        });
    } catch (err) {
      window.alert(err.message);
    }
  }

  getTodayWord = () => {
    if (this.state.userData.todayWord != null) {
      this.formElement.current.setState({
        input: this.state.userData.todayWord,
      });
      this.formElement.current.state.input = this.state.userData.todayWord;
      this.formElement.current.getMeaning();
    }
  };
  getBandWord = (e) => {
    if (e.target.innerText != null) {
      this.formElement.current.setState({
        input: e.target.innerText,
      });
      this.formElement.current.state.input = e.target.innerText;
      this.formElement.current.getMeaning();
    }
  };

  render() {
    return (
      <div id="top-container">
        <div id="meta-data">
          <div className="word-band">
            {this.state.userData.words == null ? (
              <div></div>
            ) : (
              this.state.userData.words.map((word) => (
                <button
                  onClick={(word) => this.getBandWord(word)}
                  className="word-band-word"
                  word={word}
                >
                  {word}
                </button>
              ))
            )}
          </div>
          <div className="meta-data-item" id="meta-data-item-count">
            Count : {this.state.userData.count}
          </div>
        </div>
        <div id="meta-data-item-todayWord" className="meta-data-item">
          <button className="todayWord" href="#" onClick={this.getTodayWord}>
            Today's word : {this.state.userData.todayWord}
          </button>
        </div>
        <Form
          data={this.props.user}
          ref={this.formElement}
          handler={this.handler}
        />
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
      `https://api.aishvsingh.com/api/${this.props.data.username}/words/` +
      this.state.input.toLowerCase().trim() +
      "/"
    );
  };

  getMeaning = () => {
    if (this.state.input.trim() === "") {
      return;
    }
    this.statusElement.current.toggleLoading();
    axios
      .get(this.getBaseUrl(), {
        headers: { Authorization: `Token ${this.props.data.token}` },
      })
      .then((res) => {
        const data_w = res.data;
        this.statusElement.current.changeContent(data_w);
      })
      .catch((err) => {
        window.alert(err);
      });
  };
  AddWord = (word) => {
    this.statusElement.current.toggleLoading();
    axios
      .post(
        `https://api.aishvsingh.com/api/${this.props.data.username}/words/` +
          word +
          "/",
        {},
        {
          headers: { Authorization: `Token ${this.props.data.token}` },
        }
      )
      .then((res) => {
        const data_w = res.data;
        this.props.handler();
        this.statusElement.current.changeContent(data_w);
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  DeleteWord = (word) => {
    this.statusElement.current.toggleLoading();
    axios
      .post(
        `https://api.aishvsingh.com/api/${this.props.data.username}/words/` +
          word +
          "/",
        { action: "delete" },
        {
          headers: { Authorization: `Token ${this.props.data.token}` },
        }
      )
      .then((res) => {
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
          <button onClick={this.getMeaning} className="action-button">
            Get Meaning
          </button>
        </div>
        <Status
          addword={this.AddWord}
          delete={this.DeleteWord}
          ref={this.statusElement}
        />
      </div>
    );
  }
}

class Status extends React.Component {
  state = {
    data: null,
    msgcode: 0,
    loading: false,
    action: null,
    actionFunction: null,
  };

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };
  changeContent = (data_w) => {
    this.toggleLoading();
    data_w.isAdded
      ? this.setState({
          action: Delete,
          actionFunction: this.delete,
        })
      : this.setState({
          action: Add,
          actionFunction: this.add,
        });
    this.setState({
      data: data_w,
    });
  };
  delete = () => {
    if (this.state.data.word === null) return;
    this.props.delete(this.state.data.word);
  };

  add = () => {
    if (this.state.data.word === null) return;
    this.props.addword(this.state.data.word);
  };

  play_pronunciation = () => {
    if (this.state.data.audio === null) {
      return;
    }

    var audio = document.getElementById("audio-pronunciation");
    audio.play();
  };

  render() {
    return this.state.loading ? (
      <img id="loading-gif" alt="Loading.." src={Loading}></img>
    ) : this.state.data != null ? (
      this.state.data.Success == null ? (
        <div id="status-container">
          <button id="internal-action-button" title="Delete this word">
            <img
              id="internal-action-img"
              alt="Action"
              onClick={this.state.actionFunction}
              src={this.state.action}
            ></img>
          </button>
          <div className="word-heading">
            <button id="play-pronunciation" onClick={this.play_pronunciation}>
              <img id="mic-img" alt="Pronunciation" src={Mic}></img>
              <audio
                id="audio-pronunciation"
                src={this.state.data.audio}
              ></audio>
            </button>

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
