import './user-settings.scss';

import { DateTime } from 'luxon';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  getFormattedDate = (date: string) => {
    return DateTime.fromString(date.split('T')[0], 'yyyy-MM-dd').toLocaleString(DateTime.DATE_MED);
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return userData.image ? (
      <img src={userData.image} className="user-image" />
    ) : (
      <FontAwesomeIcon className="user-image" icon={faUserCircle} />
    );
  };

  renderUserInfo = () => {
    const { userData } = this.props;

    return (
      <div className="user-info-container">
        {this.renderUserImage()}
        <div className="user-content">
          <p className="user-name">{userData.name}</p>
          <p className="joined-at">Joined {this.getFormattedDate(userData.created_at)}</p>
        </div>
      </div>
    );
  };

  renderPagesTitle = (title: string) => <h1>{title}</h1>;

  renderSupportedArtists = () => (
    <div className="pages">
      {this.props.userData.subscriptions.map((subscription) => (
        <div className="artist">
          <div className="image-border">
            <img src={subscription.image} />
          </div>
          <div className="artist-info">
            <p className="artist-name">{subscription.name}</p>
            <div className="extra-info">
              <label>
                SUPPORTING AT
                <p>${subscription.amount / 100}/Month</p>
              </label>
              <label>
                LAST POST
                <p>{this.getFormattedDate(subscription.last_post_date)}</p>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  renderContent = () => (
    <div className="content">
      {this.renderUserInfo()}
      <div className="pages-container">
        {this.renderPagesTitle('SUPPORTED ARTISTS')}
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
