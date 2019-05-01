import '../../styles/App.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';

import { closeAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Routes } from '../Routes';
import { AuthModal } from '../connect/AuthModal';
import { Modal } from '../shared/modal/Modal';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState & typeof meInitialState & Dispatchers & { history: any };

class AppComponent extends React.Component<Props, any> {
  componentDidMount() {
    this.props.getMe();
  }

  componentDidUpdate() {
    if (this.props.token && !this.props.error && !this.props.userData) {
      this.props.getMe();
    }
  }

  render() {
    return (
      <div className="page">
        <Routes />
        <Modal open={this.props.authModalOpen}>
          <AuthModal history={this.props.history} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
});

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);

export { App };
