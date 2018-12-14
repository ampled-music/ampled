import * as React from 'react';
import '../../styles/App.css';

import { AuthenticationGateway } from '../AuthenticationGateway';
import { ProtectedRoutes } from '../ProtectedRoutes';

const App = () => <AuthenticationGateway component={ProtectedRoutes} path="/" />;

export { App };
