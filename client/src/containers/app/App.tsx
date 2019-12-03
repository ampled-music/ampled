import '../../styles/App.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from '../../redux/configure-store';
import { getMeAction } from '../../redux/me/get-me';

import { closeAuthModalAction } from '../../redux/authentication/authentication-modal';
import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Routes } from '../Routes';
import { AuthModal } from '../connect/AuthModal';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { Helmet } from 'react-helmet';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState & typeof meInitialState & Dispatchers & { history: any };

class AppComponent extends React.Component<Props, any> {
  componentDidMount() {
    this.props.getMe();
  }

  componentDidUpdate() {
    if (this.props.token && !this.props.error && !this.props.userData && !this.props.loadingMe) {
      this.props.getMe();
    }
  }

  render() {
    return (
      <div className="page">
        <Helmet>
          <title>Ampled | Direct Community Support For Music Artists</title>
          {
            process.env.NODE_ENV === 'development' &&
            (<meta name="robots" content="noindex, nofollow"/>)
          }
        </Helmet>
        <React.Suspense fallback={<Loading artistLoading={true}/>}>
          <Routes />
          <Modal open={this.props.authModalOpen} onClose={this.props.closeAuthModal}>
            <AuthModal history={this.props.history} />
          </Modal>
        </React.Suspense>
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
