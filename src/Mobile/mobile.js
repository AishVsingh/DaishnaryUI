import "./mobile.css";
import axios from "axios";
import React from "react";
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

  render() {
    return (
      <div id="top-container">
        <div id="meta-data-mobile">
          <div id="meta-data-mobile-count">
            Count : {this.state.userData.count}
          </div>
          <div id="meta-data-mobile-count">
            <a href="#" onClick={this.getTodayWord}>
              Today's word : {this.state.userData.todayWord}
            </a>
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
  AddWord = () => {
    if (this.state.input.trim() === "") {
      return;
    }

    axios
      .post(
        this.getBaseUrl(),
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
            <button onClick={this.AddWord} className="action-button-mobile">
              Add Word
            </button>
          </div>
        </div>
        <StatusMobile ref={this.statusElement} />
      </div>
    );
  }
}

class StatusMobile extends React.Component {
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
