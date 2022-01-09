import "./mobile.css";
import axios from "axios";
import React from "react";
import Loading from "./static/loading.gif";
import Delete from "./static/minus.png";
import Add from "./static/plus.png";
export default class Mobile extends React.Component {
  state = {};

  render() {
    return (
      <div id="home-mobile">
        <HeaderMobile />
        <MetaDataMobile user={this.props.data} />
      </div>
    );
  }
}

class HeaderMobile extends React.Component {
  render() {
    return <div id="header-mobile">Daishnary</div>;
  }
}
class MetaDataMobile extends React.Component {
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
          `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/${this.props.user.username}/metadata/`,
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
        <div id="meta-data-mobile">
          <div className="word-band-mobile">
            {this.state.userData.words == null ? (
              <div></div>
            ) : (
              this.state.userData.words.map((word) => (
                <button
                  onClick={(word) => this.getBandWord(word)}
                  className="word-band-word-mobile"
                  word={word}
                >
                  {word}
                </button>
              ))
            )}
          </div>
          <div id="meta-data-mobile-count">
            Count : {this.state.userData.count}
          </div>
          <div id="meta-data-mobile-count">
            <button
              className="todayWord-mobile"
              href="#"
              onClick={this.getTodayWord}
            >
              Today's word : {this.state.userData.todayWord}
            </button>
          </div>
        </div>
        <FormMobile
          data={this.props.user}
          ref={this.formElement}
          handler={this.handler}
        />
      </div>
    );
  }
}
class FormMobile extends React.Component {
  state = {
    status: {},
    input: "",
    data: null,
    test: "",
  };
  constructor(props) {
    super(props);
    this.statusElement = React.createRef();
  }

  getBaseUrl = () => {
    return (
      `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/${this.props.data.username}/words/` +
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
    if (this.state.input.trim() === "") {
      return;
    }
    this.statusElement.current.toggleLoading();
    axios
      .post(
        `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/${this.props.data.username}/words/` +
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
  setInput = (word) => {
    this.setState({ input: word });
  };

  DeleteWord = (word) => {
    this.statusElement.current.toggleLoading();
    axios
      .post(
        `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/${this.props.data.username}/words/` +
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

  render() {
    return (
      <div>
        <div id="form-container-mobile">
          <input
            value={this.state.input}
            onInput={(e) => this.setInput(e.target.value)}
            type="text"
            id="word-input-mobile"
            name="word"
          />
          <div className="button-panel-mobile">
            <button onClick={this.getMeaning} className="action-button-mobile">
              Get Meaning
            </button>
          </div>
        </div>
        <StatusMobile
          addword={this.AddWord}
          delete={this.DeleteWord}
          ref={this.statusElement}
        />
      </div>
    );
  }
}

class StatusMobile extends React.Component {
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
  render() {
    return this.state.loading ? (
      <img id="loading-gif-mobile" alt="Loading.." src={Loading}></img>
    ) : this.state.data != null ? (
      this.state.data.Success == null ? (
        <div id="status-container">
          <button id="internal-action-button-mobile" title="Delete this word">
            <img
              id="internal-action-img-mobile"
              alt="Action"
              onClick={this.state.actionFunction}
              src={this.state.action}
            ></img>
          </button>
          <div className="word-heading-mobile">
            {this.state.data == null ? <div></div> : this.state.data.word}
          </div>
          <div className="meaning-set">
            {this.state.data == null ? (
              <div></div>
            ) : (
              this.state.data.meanings.map((meaning) => (
                <div className="meaning-container">
                  <div className="pos-mobile">{meaning.partOfSpeech}</div>
                  {meaning.definitions.map((def) => (
                    <div className="def-container-mobile">
                      <div className="def-mobile">{def.definition}</div>
                      {def.example != null ? (
                        <div className="exp-mobile">
                          {" "}
                          <span>Example:</span>"{def.example}"
                        </div>
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
        <div id="message-container-mobile">
          <div className="Message">{this.state.data.Message}</div>
        </div>
      )
    ) : (
      <div></div>
    );
  }
}
