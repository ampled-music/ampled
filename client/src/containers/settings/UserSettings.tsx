import './user-settings.scss';

import { DateTime } from 'luxon';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';

import { faHeartBroken, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { cancelSubscriptionAction } from 'src/redux/subscriptions/cancel';
import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Modal } from '../shared/modal/Modal';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState & typeof meInitialState & Dispatchers & { history: any };

class UserSettingsComponent extends React.Component<Props, any> {
  state = {
    showCancelModal: false,
    subscription: undefined,
  };

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

  openCancelModal = (event, subscription) => {
    event.preventDefault();

    this.setState({ showCancelModal: true, subscription });
  };

  closeCancelModal = () => this.setState({ showCancelModal: false, subscription: undefined });

  cancelSubscription = () => {
    this.props.cancelSubscription({ artistPageId: this.state.subscription.id });
    this.closeCancelModal();
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

  renderCancelSubscriptionModal = () => {
    if (!this.state.subscription) {
      return null;
    }

    return (
      <Modal open={this.state.showCancelModal} onClose={this.closeCancelModal}>
        <div className="user-settings-cancel-modal">
          <p>Are you sure you want to stop supporting {this.state.subscription.name}?</p>
          <div className="actions">
            <button className="btn" onClick={this.cancelSubscription}>
              yes
            </button>
            <button className="btn" onClick={this.closeCancelModal}>
              OF COURSE NOT!
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  renderSupportedArtists = () => (
    <div className="pages">
      {this.props.userData.subscriptions.map((subscription) => (
        <div key={`artist-${subscription.name}`} className="artist">
          <div className="image-border">
            <img src={subscription.image} />
          </div>
          <div className="artist-info">
            <p className="artist-name">{subscription.name}</p>
            <div className="extra-info">
              <div className="support-info">
                <div className="supporting-at">
                  <label>
                    <p className="info-title">SUPPORTING AT</p>
                    <p className="supporting-at-value">${subscription.amount / 100}/Month</p>
                  </label>
                  <button onClick={(event) => this.openCancelModal(event, subscription)}>
                    <FontAwesomeIcon icon={faHeartBroken} />
                    CANCEL
                  </button>
                </div>
                <div>
                  <label>
                    <p className="info-title">LAST POST</p>
                    <p className="info-value">{this.getFormattedDate(subscription.last_post_date)}</p>
                  </label>
                  <label>
                    <p className="info-title">SUPPORT DATE</p>
                    <p className="info-value">{this.getFormattedDate(subscription.support_date)}</p>
                  </label>
                </div>
              </div>
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
        {this.renderCancelSubscriptionModal()}
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
  cancelSubscription: bindActionCreators(cancelSubscriptionAction, dispatch),
});

const UserSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettingsComponent);

export { UserSettings };
