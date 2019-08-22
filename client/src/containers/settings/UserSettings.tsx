import './user-settings.scss';

import * as loadImage from 'blueimp-load-image';
import { DateTime } from 'luxon';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';
import { setUserDataAction } from 'src/redux/me/set-me';
import { updateMeAction } from 'src/redux/me/update-me';
import { cancelSubscriptionAction } from 'src/redux/subscriptions/cancel';

import { faEdit, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import avatar from '../../images/ampled_avatar.svg';
import { CircularProgress } from '@material-ui/core';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
import { routePaths } from '../route-paths';
import { Modal } from '../shared/modal/Modal';
import { showToastMessage, MessageType } from '../shared/toast/toast';
import { UploadFile } from '../shared/upload/UploadFile';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & { history: any; subscriptions: typeof subscriptionsInitialState };

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
    if (this.props.token && !this.props.error && !this.props.userData && !this.props.loadingMe) {
      this.props.getMe();
    }

    if (this.state.showUserPhotoModal && this.props.updated) {
      this.updateUserPhoto();
    }

    if (this.props.subscriptions.cancelled && !this.props.loadingMe) {
      this.showCancelledSuccessMessage();
      this.props.getMe();
    }
  }

  showCancelledSuccessMessage = () => {
    const artistPageLink = routePaths.support.replace(':id', this.props.subscriptions.artistPageId.toString());

    showToastMessage(
      `We are sad to see you leaving. Remember that you can always support <a href="${artistPageLink}">${
        this.props.subscriptions.artistName
      }</a> with a different value!`,
      MessageType.SUCCESS,
    );
  };

  updateUserPhoto = () => {
    this.closeUserPhotoModal();
    this.props.setMe({ image: this.props.updatedData.profileImageUrl });
    showToastMessage('User photo updated!', MessageType.SUCCESS);
  };

  getFormattedDate = (date: string) => {
    if (!date) {
      return '-';
    }

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
    this.props.cancelSubscription({
      subscriptionId: this.state.subscription.subscriptionId,
      artistPageId: this.state.subscription.artistPageId,
      artistName: this.state.subscription.name,
    });
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

  formatMoney = (value) => {
    if (isNaN(value)) {
      return 0;
    }

    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  calculateSupportTotal = (supportLevel) =>
    this.calculateSupportTotalNumber(supportLevel).toFixed(2)

  calculateSupportTotalNumber = (supportLevel) => (Math.round((supportLevel * 100 + 30) / .971) / 100);

  
  redirectToArtistPage = (pageId) => {
    this.props.history.push(routePaths.artists.replace(':id', pageId));
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return (
      <div className="user-image-container">
        <button onClick={this.showUserPhotoModal}>
          {userData.image ? (
            <img src={userData.image} className="user-image" />
          ) : (
            <img src={avatar} className="user-image" />
          )}
          <b className="tag">
            <FontAwesomeIcon icon={faEdit} />
          </b>
        </button>
      </div>
    );
  };

  renderUserInfo = () => {
    const { userData } = this.props;
    // const { subscriptions } = userData;
    // let monthlyTotal = 0;
    // if (subscriptions && subscriptions.length) {
    //   for (const sub of subscriptions) {
    //     monthlyTotal += this.calculateSupportTotalNumber(sub.amount / 100);
    //   }
    // }
    return (
      <div className="user-info-container col-md-3">
        {this.renderUserImage()}
        <div className="user-content">
          <p className="user-name">{userData.name}</p>
          <p className="joined-at">Joined {this.getFormattedDate(userData.created_at)}</p>
          {/*
            monthlyTotal > 0 ?
              (<p className="user-name">${monthlyTotal.toFixed(2)}/Month</p>) :
              ''
          */}
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
            <button className="btn btn-ampled" onClick={this.cancelSubscription}>
              Yes
            </button>
            <button className="btn btn-ampled" onClick={this.closeCancelModal}>
              OF COURSE NOT!
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  renderOwnedPages = () => (
    <div>
      {this.renderPagesTitle('MY ARTIST PAGES')}
      <div className="pages row no-gutters justify-content-center justify-content-md-start">
        {this.props.userData.ownedPages.map((ownedPage) => (
          <div key={`artist-${ownedPage.id}`} className="artist col-sm-6">
              <img className="artist-image" src={ownedPage.image} />
              <div className="image-border" onClick={() => this.redirectToArtistPage(ownedPage.artistId)}></div>
            <div className="artist-info">
              <p className="artist-name" onClick={() => this.redirectToArtistPage(ownedPage.artistId)}>{ownedPage.name}</p>
              <div className="extra-info">
                <div className="owned-info">
                  <div className="column">
                    <label>
                      <p className="info-title">SUPPORTERS</p>
                      <p className="supporting-at-value">{ownedPage.supportersCount || 0}</p>
                    </label>
                    <label>
                      <p className="info-title">LAST POST</p>
                      <p className="info-value">{this.getFormattedDate(ownedPage.lastPost)}</p>
                    </label>
                  </div>
                  <div className="column">
                    <label>
                      <p className="info-title">MONTHLY TOTAL</p>
                      <p className="info-value">$ {this.formatMoney(ownedPage.monthlyTotal / 100)}</p>
                    </label>
                    <label>
                      <p className="info-title">LAST PAYOUT</p>
                      <p className="info-value">{this.getFormattedDate(ownedPage.lastPayout)}</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  renderSupportedArtists = () => (
    <div>
      {this.renderPagesTitle('SUPPORTED ARTISTS')}
      <div className="pages row no-gutters justify-content-center justify-content-md-start">
        {this.props.userData.subscriptions.map((subscription) => (
          <div key={`artist-${subscription.artistPageId}`} className="artist col-sm-6">
            <img className="artist-image" src={subscription.image} />
            <div className="image-border" onClick={() => this.redirectToArtistPage(subscription.artistPageId)}></div>
            <div className="artist-info">
              <p className="artist-name" onClick={() => this.redirectToArtistPage(subscription.artistPageId)}>{subscription.name}</p>
              <div className="extra-info">
                <div className="support-info">
                  <div className="supporting-at">
                    <label>
                      <p className="info-title">SUPPORTING AT</p>
                      <p className="supporting-at-value">${subscription.amount / 100}/Month</p>
                      <p className="info-title">${this.calculateSupportTotal(subscription.amount / 100)} incl. fees</p>
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
    </div>
  );

  renderEmptyArtists = () => (
    <div>
      {this.renderPagesTitle('SUPPORTED ARTISTS')}
      <div className="pages row no-gutters justify-content-center justify-content-md-start">
        <div className="center col-md-8">You currently don't support any artists.</div>
      </div>
    </div>
  );

  renderAddPhotoButton = () => (
    <div className="add-photo-button-container">
      <UploadFile inputRefId="input-user-photo" uploadFile={this.loadPhotoContent} />
      <div className="media-button-wrapper action-buttons">
        <button
          disabled={this.props.updating}
          className="add-media"
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

    if (processingImage && userData.image) {
      return (
        <div className="processing-image">
          <CircularProgress size={80} />
          <img src={userData.image} className='image-preview loading-image' />
        </div>
      );
    } else if (processingImage) {
      return (
        <div className="processing-image">
          <CircularProgress size={80} />
          <img src={avatar} className='image-preview loading-image' />
        </div>
      );
    }

    const placeholderImage = userData.image ? (
      <img src={userData.image} className='image-preview'/>
    ) : (
      <img src={avatar} className="image-preview" />
    );

    return photoBody ? <img src={photoBody} className="image-preview" /> : placeholderImage;
  };

  renderPhotoSelector = () => {

    return (
      <div className="user-photo-selector-modal">
        {this.renderPhoto()}
        {this.renderAddPhotoButton()}
        <div className="action-buttons">
          <button disabled={this.props.updating} className="cancel-button" onClick={this.closeUserPhotoModal}>
            Cancel
          </button>
          <button disabled={!this.state.photoContent || this.props.updating} className="continue-button" onClick={this.saveUserPhoto}>
            Save
          </button>
        </div>
      </div>
    );
  };

  renderContent = () => (
    <div className="row content">
      <Modal open={this.state.showUserPhotoModal} onClose={!this.props.updating && this.closeUserPhotoModal}>
        {this.renderPhotoSelector()}
      </Modal>
      {this.renderUserInfo()}
      <div className="pages-container col-md-9">
        { this.props.userData.ownedPages.length > 0 ?
          this.renderOwnedPages() : '' }
        { this.props.userData.subscriptions.length > 0 ?
          this.renderSupportedArtists() : this.renderEmptyArtists() }
      </div>
    </div>
  );


  render() {
    const { userData } = this.props;

    return (
      <div className="container user-settings-container">
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
  subscriptions: state.subscriptions,
});

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  setMe: bindActionCreators(setUserDataAction, dispatch),
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
