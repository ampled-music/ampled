import * as React from 'react';

import axios from 'axios';
import { Nav } from '../nav/Nav';
import { PostsContainer } from '../posts/PostsContainer';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';

class Artist extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      data: { name: '', posts: [] },
    };
  }

  componentDidMount() {
    axios.get(`/artist_pages/${this.state.id}.json`).then((res) => {
      this.setState({ data: res.data });
    });
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <ArtistHeader name={this.state.data.name} id={this.state.id} accentColor={this.state.data.accent_color} />
        <ArtistInfo location={this.state.data.location} />
        <PostsContainer posts={this.state.data.posts} accentColor={this.state.data.accent_color} />
      </div>
    );
  }
}

export { Artist };
