import './home/home.scss';
import * as React from 'react';
import { apiAxios } from '../api/setup-axios';

class Stats extends React.Component {
  state = {
    counts: [],
    status: 'loading',
    message: '',
    loading: true,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    try {
      const { data } = await apiAxios({
        method: 'get',
        url: `/stats/summary.json`,
      });
      this.setState({
        loading: false,
        ...data,
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { counts, loading, status, message } = this.state;

    const body =
      status === 'error'
        ? message
        : counts.map(({ name, count }) => (
            <div key={name} className="row justify-content-center">
              <b>{name}</b>: {count}
            </div>
          ));

    return (
      <div>
        <div className="home-artists">
          <h1 className="home-artists__title">Stats</h1>
          <div className="container">{loading ? 'Loading...' : body}</div>
        </div>
      </div>
    );
  }
}

export { Stats };
