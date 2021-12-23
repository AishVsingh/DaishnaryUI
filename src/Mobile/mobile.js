import "./mobile.css";
import axios from "axios";
import React from "react";
export default class Mobile extends React.Component {
  state = {};

  render() {
    return (
      <div id="home-mobile">
        <HeaderMobile />
        <FormMobile />
      </div>
    );
  }
}

class HeaderMobile extends React.Component {
  render() {
    return <div id="header-mobile">Daishnary</div>;
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
      `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/` +
      this.state.input.toLowerCase() +
      "/"
    );
  };

  getMeaning = () => {
    if (this.state.input.trim() === "") {
      return;
    }
    var test = document.getElementById("test-text");
    test.innerHTML += this.state.input;
    var axiosInstance = axios.create({
      baseURL: this.getBaseUrl(),
      timeout: 5000,
      headers: {},
    });
    axiosInstance.interceptors.request.use((request) => {
      console.log("Starting Request");
      var test = document.getElementById("test-text");
      test.innerHTML += JSON.stringify(request, null, 2);
      return request;
    });
    axiosInstance
      .get()
      .then((res) => {
        console.log(res.data);
        const data_w = res.data;
        var test = document.getElementById("test-text");
        test.innerHTML += data_w;
        this.statusElement.current.changeContent(data_w);
      })
      .catch((error) => {
        var test = document.getElementById("test-text");
        if (error.response) {
          // Request made and server responded
          test.innerHTML += error.response.data;
          test.innerHTML += error.response.status;
          test.innerHTML += error.response.headers;
        } else if (error.request) {
          // The request was made but no response was received
          test.innerHTML += error.request;
        } else {
          // Something happened in setting up the request that triggered an Error
          test.innerHTML += ("Error", error.message);
        }
      });
  };
  AddWord = () => {
    try {
      if (this.state.input.trim() === "") {
        return;
      }
      axios
        .post(
          `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/` +
            this.state.input.toLowerCase() +
            "/"
        )
        .then((res) => {
          console.log(res.data);
          const data_w = res.data;
          this.statusElement.current.changeContent(data_w);
        })
        .catch((err) => {
          window.alert(err);
        });
    } catch (err) {
      window.alert(err.message);
    }
  };
  setInput = (word) => {
    this.setState({ input: word });
  };

  test = () => {
    axios
      .get(
        `https://ec2-3-11-13-145.eu-west-2.compute.amazonaws.com:443/api/` +
          this.state.input.toLowerCase() +
          "/"
      )
      .then((res) => {
        console.log(res.data);
        const data_w = res.data;
        var test = document.getElementById("test-text");
        test.innerHTML += data_w;
        this.statusElement.current.changeContent(data_w);
      });
    window.alert("Test");
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
        <button id="test" onClick={this.test} className="test">
          TEST
        </button>
        <div id="test-text"></div>
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
