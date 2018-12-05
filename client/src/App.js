import React, { Component } from "react";
import "./App.css";

import Counter      from "./components/Counter";
import Nav          from "./components/Nav";
import ArtistHeader from "./components/Artist_Header";
import ArtistInfo   from "./components/Artist_Info";


class App extends Component {

  render() {
    return (
      <div className="App">
          <Nav />
          <ArtistHeader />
          <ArtistInfo />
      </div>
    );
  }
}

export default App;
