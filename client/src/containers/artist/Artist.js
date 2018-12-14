import React, { Component } from 'react'

import Nav from '../nav/Nav'
import ArtistHeader from './ArtistHeader'
import ArtistInfo from './ArtistInfo'
import PostsContainer from '../posts/PostsContainer'
import axios from 'axios'

class Artist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      data: { name: '', posts: [] },
    }
  }

  componentDidMount() {
    axios.get(`/artist_pages/${this.state.id}.json`).then((res) => {
      console.log('setting state!')
      this.setState({ data: res.data })
    })
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <ArtistHeader name={this.state.data.name} id={this.state.id} accentColor={this.state.data.accent_color} />
        <ArtistInfo location={this.state.data.location} />
        <PostsContainer posts={this.state.data.posts} accentColor={this.state.data.accent_color} />
      </div>
    )
  }
}

export default Artist
