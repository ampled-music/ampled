import React, { Component } from "react";
import { Link } from "react-router-dom";

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
        return (<div key={page.id}>
          <Link to={`/artists/${page.id}`}>{page.name}</Link>
          </div>)
      })
    )
  }
}

export default Home;