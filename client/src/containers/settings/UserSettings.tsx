import './../artist/artist.scss';
import './user-settings.scss';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../../redux/authentication/authentication-modal';
import { Store } from '../../redux/configure-store';
import { getMeAction } from '../../redux/me/get-me';
import { setUserDataAction } from '../../redux/me/set-me';
import { updateMeAction } from '../../redux/me/update-me';
import { showToastAction } from '../../redux/toast/toast-modal';
import { cancelSubscriptionAction } from '../../redux/subscriptions/cancel';
import { Image, Transformation } from 'cloudinary-react';
import multiDownload from 'multi-download';

import {
  faEdit,
  faMapMarkerAlt,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faInstagram,
  faStripe,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tear from '../../images/background_tear.png';
import tear_black from '../../images/background_tear_black.png';

import avatar from '../../images/ampled_avatar.svg';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
import { routePaths } from '../route-paths';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  setMe: bindActionCreators(setUserDataAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  cancelSubscription: bindActionCreators(cancelSubscriptionAction, dispatch),
  updateMe: bindActionCreators(updateMeAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & {
    history: any;
    location: any;
    subscriptions: typeof subscriptionsInitialState;
  };

class UserSettingsComponent extends React.Component<Props, any> {
  state = {
    showCancelModal: false,
    subscription: undefined,
  };

  componentDidMount() {
    this.props.getMe();
    const {
      location: { search },
    } = this.props;

    if (/stripesuccess=true/gi.test(search)) {
      this.props.showToast({
        message: "Great! You're all set up for payments.",
        type: 'success',
      });
    }
  }

  componentDidUpdate() {
    if (
      this.props.token &&
      !this.props.error &&
      !this.props.userData &&
      !this.props.loadingMe
    ) {
      this.props.getMe();
    }

    if (this.props.subscriptions.cancelled && !this.props.loadingMe) {
      this.showCancelledSuccessMessage();
      this.props.getMe();
    }
  }

  showCancelledSuccessMessage = () => {
    const { artistSlug, artistPageId, artistName } = this.props.subscriptions;
    const artistPageLink = routePaths.support.replace(
      ':id',
      artistSlug && artistSlug.length ? artistSlug : artistPageId.toString(),
    );

    this.props.showToast({
      message: (
        <>
          We are sad to see you leaving. Remember that you can always support{' '}
          <a href={artistPageLink}>{artistName}</a> with a different value!
        </>
      ),
      type: 'success',
    });
  };

  getFormattedDate = (date: string) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  openCancelModal = (event, subscription) => {
    event.preventDefault();

    this.setState({ showCancelModal: true, subscription });
  };

  closeCancelModal = () =>
    this.setState({ showCancelModal: false, subscription: undefined });

  cancelSubscription = () => {
    this.props.cancelSubscription({
      subscriptionId: this.state.subscription.subscriptionId,
      artistPageId: this.state.subscription.artistPageId,
      artistSlug: this.state.subscription.artistSlug,
      artistName: this.state.subscription.name,
    });
    this.closeCancelModal();
  };

  formatMoney = (value) => {
    if (isNaN(value)) {
      return 0;
    }

    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  calculateSupportTotal = (supportLevel) =>
    this.calculateSupportTotalNumber(supportLevel).toFixed(2);

  calculateSupportTotalNumber = (supportLevel) =>
    Math.round((supportLevel * 100 + 30) / 0.971) / 100;

  redirectToArtistPage = (artist) => {
    if (artist.artistSlug && artist.artistSlug.length > 0) {
      this.props.history.push(
        routePaths.slugs.replace(':slug', artist.artistSlug),
      );
    } else if (artist.artistId) {
      this.props.history.push(
        routePaths.artists.replace(':id', artist.artistId),
      );
    } else if (artist.artistPageId) {
      this.props.history.push(
        routePaths.artists.replace(':id', artist.artistPageId),
      );
    }
  };

  handlePublicID = (image: string) => {
    const url = image.split('/');
    const part_1 = url[url.length - 2];
    const part_2 = url[url.length - 1];
    return part_1 + '/' + part_2;
  };

  buildBrokenName = (artistname: string) => {
    const broken_name = artistname.split(' ');
    const name_array = [];
    let name_string = '';

    for (let index = 0; index < broken_name.length; index++) {
      if (broken_name[index].length >= 7) {
        // Words longer than 6 get their own line
        if (name_string) {
          // If there is a string being built, push that before the next Word
          name_array.push(name_string.trim());
          name_string = '';
        }
        name_array.push(broken_name[index]);
      } else if (broken_name[index].length < 7) {
        // Build string of small words
        name_string += broken_name[index] + ' ';
        if (name_string.length > 10) {
          // If its a small word continue loop
          if (broken_name[index].length < 3) {
            continue;
          }
          // Push built string of small word once its over 10
          name_array.push(name_string.trim());
          name_string = '';
        } else if (index === broken_name.length - 1) {
          // If its the last word push whats left in the string
          name_array.push(name_string.trim());
          name_string = '';
        }
      } else {
        if (name_string) {
          // If there is a string being built, push that before the next Word
          name_array.push(name_string.trim());
          name_string = '';
        }
        name_array.push(broken_name[index]);
      }
    }
    return name_array;
  };

  handleBrokenName = (
    fullname: string,
    position: string,
    x: number,
    y: number,
    distance: number,
    font_size: number,
    color: string,
    bg: string,
  ) => {
    const broken_name = this.buildBrokenName(fullname);
    let y_index = y;
    let name_part = '';
    let new_font_size = font_size;
    let new_distance = distance;

    if (broken_name.length < 5) {
      // Font size for long names
      if (broken_name.length >= 4) {
        new_font_size = font_size / 1.2;
        new_distance = distance / 1.2;
      }
      // Instagram 2
      if (position === 'center' && x === 0 && y === -90) {
        for (let index = 0; index < broken_name.length; index++) {
          y_index = index === 0 ? y_index : y_index - distance / 2;
        }
      }
      // Social 2
      if (position === 'north' && x === 0 && y === 560) {
        for (let index = 0; index < broken_name.length; index++) {
          y_index = index === 0 ? y_index : y_index - 60;
        }
      }
      // Cycle through and build text plate
      for (let index = 0; index < broken_name.length; index++) {
        // prettier-ignore
        name_part += `l_text:Arial_${new_font_size}_bold:%20${encodeURI( broken_name[index] )}%20,co_rgb:${ color },b_rgb:${ bg },g_${ position },x_${ x },y_${ y_index }/`;
        y_index += Math.round(new_distance);
      }
      return name_part;
    } else {
      return '';
    }
  };

  renderSocialImages = (artist) => {
    const BASE_UPLOAD_URL =
      'https://res.cloudinary.com/ampled-web/image/upload';
    let color = artist.artistColor;
    color = color.replace('#', '');
    const cleanArtistName = artist.name
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const promoteImages = [];
    let n = 0;

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_800,w_800/bo_3px_solid_rgb:202020,c_scale,h_700,l_social:blank.png,w_700/c_scale,g_south,l_social:AmpledLogo.png,w_200,y_20/`,
        this.handleBrokenName(
          artist.name,
          'north',
          0,
          30,
          40,
          35,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color +
          '33'},c_scale,h_800,w_800/bo_4px_solid_rgb:202020,c_scale,h_700,l_social:blank.png,w_700/c_scale,l_social:AmpledLogo.png,w_300,y_90/`,
        this.handleBrokenName(
          artist.name,
          'center',
          0,
          -90,
          50,
          45,
          '202020',
          null,
        ),
        `/l_social:line.png/v1584999718/social/blank.jpg`,
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_800,w_800/bo_3px_solid_rgb:${color},c_scale,h_600,l_social:blank.png,w_600/c_scale,g_south_east,l_social:AmpledLogo.png,w_200,x_120,y_120/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          120,
          70,
          65,
          55,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_1921,w_1081/l_social:SocialRaw_1/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          160,
          150,
          80,
          65,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/`,
        this.handleBrokenName(
          artist.name,
          'north',
          0,
          560,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/v1585784142/social/SocialRaw_2.jpg`,
      ].join(''),
      name: `${cleanArtistName}_ promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/v1585784142/social/SocialRaw_4.jpg`,
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/v1585784142/social/SocialRaw_5.jpg`,
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/v1585784142/social/SocialRaw_6.jpg`,
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    promoteImages.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/v1585784142/social/SocialRaw_7.jpg`,
      ].join(''),
      name: `${cleanArtistName}_promote_${n++}.jpg`,
      description: '',
    });

    return (
      <div>
        <div className="details__info_title">Promote Your Page</div>
        <div className="details__promote_container">
          {promoteImages.map((promoImage) => (
            <a
              key={promoImage.name}
              className="details__promote_link"
              href={promoImage.url}
              download={promoImage.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faImage} title={promoImage.name} />
            </a>
          ))}
        </div>
      </div>
    );
  };

  handlePromoteImages = (promoteImages) => {
    // Attempt at a single download button
    // This requires cross browser to be enabled for cloudinary.com, which it currently is not.
    const fileUrls = promoteImages.map((image) => image.url);
    multiDownload(fileUrls);
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return (
      <div className="user-image-container">
        <Link to="/user-details">
          {userData.image ? (
            <Image
              publicId={this.handlePublicID(userData.image)}
              alt={userData.name}
              className="user-image"
            >
              <Transformation
                crop="fill"
                width={120}
                height={120}
                responsive_placeholder="blank"
              />
            </Image>
          ) : (
            <img src={avatar} className="user-image" alt="Your avatar" />
          )}
        </Link>
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
        <img className="tear__topper" src={tear} alt="" />
        <div className="user-content">
          {this.renderUserImage()}
          <div className="user-content__name">{userData.name}</div>
          <div className="user-content__joined-at">
            Joined {this.getFormattedDate(userData.created_at)}
          </div>
          {userData.city && (
            <div className="user-content__city">
              <FontAwesomeIcon className="icon" icon={faMapMarkerAlt} />{' '}
              {userData.city}
            </div>
          )}
          {userData.bio && (
            <div>
              <div className="user-content__hr"></div>
              <div className="user-content__bio">{userData.bio}</div>
              <div className="user-content__hr"></div>
            </div>
          )}
          {userData.twitter && (
            <div className="user-content__social">
              <FontAwesomeIcon className="icon" icon={faTwitter} />{' '}
              {userData.twitter}
            </div>
          )}
          {userData.instagram && (
            <div className="user-content__social">
              <FontAwesomeIcon className="icon" icon={faInstagram} />{' '}
              {userData.instagram}
            </div>
          )}
          {/*
            monthlyTotal > 0 ?
              (<p className="user-name">${monthlyTotal.toFixed(2)}/Month</p>) :
              ''
          */}

          <Link to="/user-details" className="user-content__edit-profile">
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </Link>
          {userData.admin && (
            <div>
              <strong>Ampled Admin</strong>
            </div>
          )}
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
          <p>
            Are you sure you want to stop supporting{' '}
            {this.state.subscription.name}?
          </p>
          <div className="action-buttons">
            <button className="cancel-button" onClick={this.closeCancelModal}>
              Of Course Not!
            </button>
            <button
              className="delete-button"
              onClick={this.cancelSubscription}
              style={{ marginLeft: 0 }}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  renderOwnedPages = () => (
    <div>
      {this.renderPagesTitle('MY ARTIST PAGES')}
      <div className="pages row justify-content-center justify-content-md-start">
        {this.props.userData.ownedPages.map((ownedPage) => (
          <div key={`artist-${ownedPage.artistId}`} className="artist col-sm-4">
            {ownedPage.image && (
              <Image
                publicId={this.handlePublicID(ownedPage.image)}
                alt={ownedPage.name}
                key={ownedPage.name}
                className="artist__image"
              >
                <Transformation
                  crop="fill"
                  width={250}
                  height={250}
                  responsive_placeholder="blank"
                />
              </Image>
            )}
            <div
              className="artist__image-border"
              onClick={() => this.redirectToArtistPage(ownedPage)}
            ></div>
            <img className="tear__topper" src={tear_black} alt="" />
            <div className="artist__info">
              <p className="artist__info_role">
                {ownedPage.role
                  ? ownedPage.role.charAt(0).toUpperCase() +
                    ownedPage.role.slice(1) +
                    ' of'
                  : ''}
              </p>
              <p
                className="artist__info_name"
                onClick={() => this.redirectToArtistPage(ownedPage)}
              >
                {ownedPage.name}
              </p>
              <div className="details">
                <div className="details__info">
                  <div className="row no-gutter">
                    <div className="col-6">
                      <div className="details__info_title">Supporters</div>
                      <div className="details__info_value">
                        {ownedPage.supportersCount || 0}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="details__info_title">Monthly Total</div>
                      <div className="details__info_value">
                        $ {this.formatMoney(ownedPage.monthlyTotal / 100)}
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutter">
                    <div className="col-6">
                      <div className="details__info_title">Last Post</div>
                      <div className="details__info_value">
                        {this.getFormattedDate(ownedPage.lastPost)}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="details__info_title">Last Payout</div>
                      <div className="details__info_value">
                        {this.getFormattedDate(ownedPage.lastPayout)}
                      </div>
                    </div>
                  </div>
                </div>
                {ownedPage.approved && (
                  <div className="details__promote">
                    <div className="row no-gutter">
                      <div className="col-12">
                        {this.renderSocialImages(ownedPage)}
                      </div>
                    </div>
                  </div>
                )}
                {ownedPage.role === 'admin' && (
                  <div className="details__stripe">
                    <div className="row no-gutter align-items-center">
                      <div className="col-4">
                        <FontAwesomeIcon
                          className="icon details__stripe_icon"
                          icon={faStripe}
                        />
                      </div>
                      <div className="col-8">
                        {ownedPage.isStripeSetup ? (
                          <a
                            href={ownedPage.stripeDashboard}
                            className="details__stripe_link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Edit Payout Details
                          </a>
                        ) : (
                          <a
                            href={ownedPage.stripeSignup}
                            className="details__stripe_link"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#d9534f' }}
                          >
                            Set Up Payouts
                          </a>
                        )}
                      </div>
                      <div className="col-12">
                        <a
                          href={routePaths.editArtist.replace(
                            ':slug',
                            ownedPage.artistSlug,
                          )}
                          className="details__edit_link"
                          rel="noopener noreferrer"
                        >
                          Edit Artist Details
                        </a>
                      </div>
                    </div>
                  </div>
                )}
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
      <div className="pages row justify-content-center justify-content-md-start">
        {this.props.userData.subscriptions.map((subscription) => (
          <div
            key={`artist-${subscription.artistPageId}`}
            className="artist col-sm-4"
          >
            <Image
              publicId={this.handlePublicID(subscription.image)}
              alt={subscription.name}
              key={subscription.name}
              className="artist__image"
            >
              <Transformation
                crop="fill"
                width={250}
                height={250}
                responsive_placeholder="blank"
              />
            </Image>

            <div
              className="artist__image-border"
              onClick={() => this.redirectToArtistPage(subscription)}
            ></div>
            <img className="tear__topper" src={tear_black} alt="" />
            <div className="artist__info">
              <p
                className="artist__info_name"
                onClick={() => this.redirectToArtistPage(subscription)}
              >
                {subscription.name}
              </p>
              <div className="details">
                <div className="details__info">
                  <div className="row no-gutter">
                    <div className="col-8">
                      <div className="details__info_title">Supporting At</div>
                      <div className="details__info_value details__info_value_large">
                        ${subscription.amount / 100}/Month
                      </div>
                      <div className="details__info_value details__info_value_small">
                        ${this.calculateSupportTotal(subscription.amount / 100)}{' '}
                        incl. fees
                      </div>
                    </div>
                    <div className="col-4">
                      <button
                        className="link details__info_value details__info_value_cancel"
                        onClick={(event) =>
                          this.openCancelModal(event, subscription)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="row no-gutter">
                    <div className="col-6">
                      <div className="details__info_title">Support Date</div>
                      <div className="details__info_value">
                        {this.getFormattedDate(subscription.support_date)}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="details__info_title">Last Post</div>
                      <div className="details__info_value">
                        {this.getFormattedDate(subscription.last_post_date)}
                      </div>
                    </div>
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
      <div className="pages row justify-content-center justify-content-md-start">
        <div className="center col-md-8">
          You currently don&apos;t support any artists.
        </div>
      </div>
    </div>
  );

  renderContent = () => (
    <div className="row content">
      {this.renderUserInfo()}
      <div className="pages-container col-md-9">
        {this.props.userData.ownedPages.length > 0 && this.renderOwnedPages()}
        {this.props.userData.subscriptions.length > 0
          ? this.renderSupportedArtists()
          : this.renderEmptyArtists()}
      </div>
    </div>
  );

  render() {
    const { userData } = this.props;

    return (
      <div className="container user-settings-container">
        <Loading artistLoading={this.props.loadingMe && !this.props.userData} />
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

const UserSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettingsComponent);

export { UserSettings };
