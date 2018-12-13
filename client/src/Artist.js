import React, { Component } from "react";

import Nav from "./components/Nav";
import ArtistHeader from "./components/ArtistHeader";
import ArtistInfo from "./components/ArtistInfo";
import PostsContainer from "./components/PostsContainer";

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      data: { name: "", posts: [] }
    };
  }

  componentDidMount() {
    fetch(`/artist_pages/${this.state.id}.json`)
      .then(res => res.json())
      .then(data => {
        console.log("setting state!");
        this.setState({ data: data });
      });
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <ArtistHeader
          name={this.state.data.name}
          id={this.state.id}
          accentColor={this.state.data.accent_color}
        />
        <ArtistInfo location={this.state.data.location} />
        <PostsContainer
          posts={this.state.data.posts}
          accentColor={this.state.data.accent_color}
        />
      </div>
    );
  }
}

export default Artist;
