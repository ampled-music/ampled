import './stats.scss';
import * as React from 'react';
import { apiAxios } from '../../api/setup-axios';

class Stats extends React.Component {
  state = {
    counts: {},
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
        : (<div>
            <div className="row justify-content-center">
              <b>Total Users</b>: {counts["confirmed_users"] + counts["pending_users"]}
            </div>
            <div className="row justify-content-center">
              <b>Approved Artist Pages</b>: {counts["approved_artist_pages"]}
            </div>
            <div className="row justify-content-center">
              <b>Artists Pages Under Construction</b>: {counts["pending_artist_pages"]}
            </div>
            <div className="row justify-content-center">
              <b>Total Monthly Artist Support</b>: {counts["active_subscription_revenue"]}
            </div>
            <div className="row justify-content-center">
              <b>Average Monthly Support Amount</b>: {counts["avg_subscription_amount"]}
            </div>
        </div>
        );

    return (
      <div>
        <div className="stats">
          <h1>Our Metrics</h1>
          <p>
            This is a snapshot of Ampled's current usage and financial metrics.
          </p>
          <p>
            As of this moment, we have:
            </p>
          <div className="container">{loading ? 'Loading...' : body}</div>
        </div>
      </div>
    );
  }
}

export { Stats };
