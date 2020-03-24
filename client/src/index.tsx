import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { App } from './containers/app/App';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { setupAxios } from './api/setup-axios';
import { configureStore } from './redux/configure-store';

Sentry.init({ dsn: process.env.REACT_APP_RAVEN_DSN });

setupAxios();

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement,
);
