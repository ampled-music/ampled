import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import Counter from "./components/Counter";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App__header">
          <Counter />
          <img src={logo} className="App__logo" alt="logo" />
          <p>
            Edit <code className="App__code">src/App.js</code> and save to
            reload.
          </p>
          <a
            className="App__link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
