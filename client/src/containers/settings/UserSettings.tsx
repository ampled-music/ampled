import './user-settings.scss';

import * as loadImage from 'blueimp-load-image';
import { DateTime } from 'luxon';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';
import { updateMeAction } from 'src/redux/me/update-me';
import { cancelSubscriptionAction } from 'src/redux/subscriptions/cancel';

import { faHeartBroken, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Modal } from '../shared/modal/Modal';
import { showToastMessage, MessageType } from '../shared/toast/toast';
import { UploadFile } from '../shared/upload/UploadFile';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState & typeof meInitialState & Dispatchers & { history: any };

class UserSettingsComponent extends React.Component<Props, any> {
  state = {
    showCancelModal: false,
    subscription: undefined,
    showUserPhotoModal: false,
    photoContent: undefined,
    photoBody: undefined,
    processingImage: false,
  };

  componentDidMount() {
    this.props.getMe();
  }

  componentDidUpdate() {
    if (this.props.token && !this.props.error && !this.props.userData) {
      this.props.getMe();
    }

    if (this.state.showUserPhotoModal && this.props.updated) {
      this.updateUserPhoto();
    }
  }

  updateUserPhoto = () => {
    this.closeUserPhotoModal();
    this.props.getMe();
    showToastMessage('User photo updated!', MessageType.SUCCESS);
  };

  getFormattedDate = (date: string) => {
    return DateTime.fromString(date.split('T')[0], 'yyyy-MM-dd').toLocaleString(DateTime.DATE_MED);
  };

  openCancelModal = (event, subscription) => {
    event.preventDefault();

    this.setState({ showCancelModal: true, subscription });
  };

  closeCancelModal = () => this.setState({ showCancelModal: false, subscription: undefined });

  showUserPhotoModal = () => this.setState({ showUserPhotoModal: true });

  closeUserPhotoModal = () =>
    this.setState({ showUserPhotoModal: false, photoBody: undefined, photoContent: undefined });

  cancelSubscription = () => {
    this.props.cancelSubscription({ artistPageId: this.state.subscription.id });
    this.closeCancelModal();
  };

  loadPhotoContent = (photoContent) => {
    this.setState({ processingImage: true });

    loadImage(
      photoContent.body,
      (canvas) => {
        this.setState({
          processingImage: false,
          photoBody: canvas.toDataURL(),
          photoContent,
        });
      },
      { orientation: true },
    );
  };

  saveUserPhoto = () => {
    const me = {
      file: this.state.photoContent.file,
    };

    this.props.updateMe(me);
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return userData.image ? (
      <div className="user-image-container">
        <button onClick={this.showUserPhotoModal}>
          <img src={userData.image} className="user-image" />
        </button>
      </div>
    ) : (
      <div className="user-image-container">
        <button onClick={this.showUserPhotoModal}>
          <FontAwesomeIcon className="user-image" icon={faUserCircle} />
        </button>
      </div>
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

  renderOwnedPages = () => (
    <div className="pages">
      {this.props.userData.ownedPages.map((ownedPage) => (
        <div key={`artist-${ownedPage.id}`} className="artist">
          <div className="image-border">
            <img src={ownedPage.image} />
          </div>
          <div className="artist-info">
            <p className="artist-name">{ownedPage.name}</p>
            <div className="extra-info">
              <div className="owned-info">
                <div className="column">
                  <label>
                    <p className="info-title">SUPPORTERS</p>
                    <p className="supporting-at-value">1,000</p>
                  </label>
                  <label>
                    <p className="info-title">LAST POST</p>
                    <p className="info-value">MARCH 1, 2019</p>
                  </label>
                </div>
                <div className="column">
                  <label>
                    <p className="info-title">MONTHLY TOTAL</p>
                    <p className="info-value">$ 4,300</p>
                  </label>
                  <label>
                    <p className="info-title">LAST PAYOUT</p>
                    <p className="info-value">APRIL 30, 2019</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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

  renderAddPhotoButton = () => (
    <div className="add-photo-button-container">
      <UploadFile inputRefId="input-user-photo" uploadFile={this.loadPhotoContent} />
      <div className="media-button-wrapper">
        <button
          disabled={this.props.updating}
          className="btn add-media-button"
          color="purple"
          onClick={() => document.getElementById('input-user-photo').click()}
        >
          {this.state.photoContent || this.props.userData.image ? 'Change photo' : 'Add photo'}
        </button>
      </div>
    </div>
  );

  renderPhoto = () => {
    const { photoBody, processingImage } = this.state;
    const { userData } = this.props;

    if (processingImage) {
      return (
        <div className="processing-image">
          <FontAwesomeIcon className="image-preview" icon={faUserCircle} />
          <b>Processing image...</b>
        </div>
      );
    }

    const placeholderImage = userData.image ? (
      <img className="image-preview" src={userData.image} />
    ) : (
      <FontAwesomeIcon className="image-preview" icon={faUserCircle} />
    );

    return photoBody ? <img className="image-preview" src={photoBody} /> : placeholderImage;
  };

  renderPhotoSelector = () => (
    <div className="user-photo-selector-modal">
      {this.renderPhoto()}
      {this.props.updating && <b>Saving image...</b>}
      {this.renderAddPhotoButton()}
      <div className="photo-actions">
        <button disabled={this.props.updating} className="btn" onClick={this.closeUserPhotoModal}>
          CANCEL
        </button>
        <button disabled={!this.state.photoContent || this.props.updating} className="btn" onClick={this.saveUserPhoto}>
          SAVE
        </button>
      </div>
    </div>
  );

  renderContent = () => (
    <div className="content">
      <Modal open={this.state.showUserPhotoModal} onClose={!this.props.updating && this.closeUserPhotoModal}>
        {this.renderPhotoSelector()}
      </Modal>
      {this.renderUserInfo()}
      <div className="pages-container">
        {this.renderPagesTitle('MY ARTIST PAGES')}
        {this.renderOwnedPages()}
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
  updateMe: bindActionCreators(updateMeAction, dispatch),
});

const UserSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettingsComponent);

export { UserSettings };
