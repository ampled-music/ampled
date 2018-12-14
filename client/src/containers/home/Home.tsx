import axios from 'axios';
import * as React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      artistPages: [],
    };
  }

  componentDidMount() {
    axios.get('/artist_pages.json').then((res) => {
      this.setState({ artistPages: res.data });
    });
  }

  render() {
    return this.state.artistPages.map((page) => {
      return (
        <div key={page.id}>
          <Link to={`/artists/${page.id}`}>{page.name}</Link>
        </div>
      );
    });
  }
}

export { Home };
