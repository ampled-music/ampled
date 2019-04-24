import './user-settings.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';

import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Modal } from '../shared/modal/Modal';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState & typeof meInitialState & Dispatchers & { history: any };

class UserSettingsComponent extends React.Component<Props, any> {
  componentDidMount() {
    this.props.getMe();
  }

  componentDidUpdate() {
    if (this.props.token && !this.props.error && !this.props.userData) {
      this.props.getMe();
    }
  }

  renderUserInfo = () => (
    <div className="user-info-container">
      <p>{this.props.userData.name}</p>
    </div>
  );

  renderPagesTitle = (title: string) => <h1>{title}</h1>;

  renderOwnedPages = () => <div className="pages">{this.renderPagesTitle('MY ARTIST PAGES')}</div>;

  renderSupportedArtists = () => <div className="pages">{this.renderPagesTitle('SUPPORTED ARTISTS')}</div>;

  renderContent = () => (
    <div className="content">
      {this.renderUserInfo()}
      <div className="pages-container">
        {this.renderOwnedPages()}
        {this.renderSupportedArtists()}
      </div>
    </div>
  );

  render() {
    const { userData } = this.props;

    return (
      <div className="user-settings-container">
        <Modal open={!userData}>
          <div className="user-settings-loading-modal">
            <h1>LOADING...</h1>
          </div>
        </Modal>
        {userData && this.renderContent()}
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
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
});

const UserSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettingsComponent);

export { UserSettings };
