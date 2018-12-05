import React, { Component } from "react";
import "./App.css";

import Counter      from "./components/Counter";
import Nav          from "./components/Nav";
import ArtistHeader from "./components/Artist_Header";
import ArtistInfo   from "./components/Artist_Info";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class Artist extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className="App">
        <Nav />
        <ArtistHeader id={this.props.match.params.id}/>
        <ArtistInfo />
      </div>
    );
  }
}

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      artistPages: []
    }
  }
  componentDidMount(){
    fetch(`/artist_pages.json`)
      .then(res => res.json())
      .then(data => {
        this.setState({artistPages: data})
      })
  }
  render() {
    return (
      this.state.artistPages.map((page) => {
        return (<div>
          <Link to={`/artists/${page.id}`}>{page.name}</Link>
          </div>)
      })
    )
  }
}

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
