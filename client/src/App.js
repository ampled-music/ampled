import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";
import Home from './Home'
import Artist from './Artist'


class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/artists/:id" component={Artist} />
        </div>
      </Router>
    )
  }
}

export default App;
