import * as React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      artistPages: [],
    }
  }
  componentDidMount() {
    axios.get('/artist_pages.json').then((res) => {
      this.setState({ artistPages: res.data })
    })
  }
  render() {
    return this.state.artistPages.map((page) => {
      return (
        <div key={page.id}>
          <Link to={`/artists/${page.id}`}>{page.name}</Link>
        </div>
      )
    })
  }
}

export default Home
