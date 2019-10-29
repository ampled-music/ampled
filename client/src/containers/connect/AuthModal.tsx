import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'src/redux/configure-store';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';

interface AuthModalProps {
  history: any;
}

type Props = typeof loginInitialState & AuthModalProps;

class AuthModalComponent extends React.Component<Props, any> {
  render() {
    if (this.props.modalPage === 'login') {
      return <Login history={this.props.history} />;
    } else if (this.props.modalPage === 'forgotPassword') {
      return <ForgotPassword />
    }

    return <Signup />;
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
});

const AuthModal = connect(mapStateToProps)(AuthModalComponent);

export { AuthModal };
