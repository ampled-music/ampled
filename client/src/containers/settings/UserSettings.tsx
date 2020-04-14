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
import { ResetPassword } from '../connect/ResetPassword';
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
    showPasswordModal: false,
    subscription: undefined,
  };

  componentDidMount() {
    this.props.getMe();
    const {
      location: { search },
    } = this.props;

    if (!this.props.loadingMe && this.props.userData) {
      if (/stripesuccess=true/gi.test(search)) {
        this.props.showToast({
          message: "Great! You're all set up for payments.",
          type: 'success',
        });
      } else if (/stripesuccess=duplicate/gi.test(search)) {
        this.props.showToast({
          message:
            'This Stripe account is already used by an artist page. Please create a new Stripe account for each artist you wish to receive payouts for.',
          type: 'error',
        });
      }
      this.props.history.replace(this.props.location.pathname);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search },
    } = this.props;

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

    if (!this.props.loadingMe && this.props.userData && prevProps.loadingMe) {
      if (/stripesuccess=true/gi.test(search)) {
        this.props.showToast({
          message: "Great! You're all set up for payments.",
          type: 'success',
        });
      } else if (/stripesuccess=duplicate/gi.test(search)) {
        this.props.showToast({
          message:
            'This Stripe account is already used by an artist page. Please create a new Stripe account for each artist you wish to receive payouts for.',
          type: 'error',
        });
      }
      this.props.history.replace(this.props.location.pathname);
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
      // Grid 2
      if (position === 'center' && x === 0 && y === -180) {
        for (let index = 0; index < broken_name.length; index++) {
          y_index = index === 0 ? y_index : y_index - distance / 2;
        }
      }
      // Story 2
      if (position === 'center' && x === 0 && y === -400) {
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
    const promoteSquare = [];
    const promoteStory = [];
    const promoteFacebook = [];

    // Facebook
    promoteFacebook.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_630,w_1200/c_scale,g_south_east,l_social:AmpledLogo,w_200,x_50,y_50/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          50,
          50,
          60,
          45,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Facebook.jpg`,
      description: '',
    });
    if (promoteFacebook.length > 0) {
      console.log(promoteFacebook);
    }

    // Square
    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_1500,w_1500/l_social:Grid:Grid1/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          160,
          80,
          65,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Grid1.jpg`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/`,
        this.handleBrokenName(
          artist.name,
          'center',
          0,
          -180,
          100,
          75,
          'ffffff',
          '202020',
        ),
        `social/Grid/Grid2.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid2.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/social/Grid/Grid3.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid3.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/social/Grid/Grid4.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid4.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/social/Grid/Grid5.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid5.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/l_text:Arial_55_bold:%20${encodeURI(
          'ampled.com%2Fartist%2F' + artist.artistSlug,
        )}%20,co_rgb:ffffff,b_rgb:202020,g_south,y_380/`,
        `/b_rgb:${color + '33'}/social/Grid/Grid6.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid6.png`,
      description: '',
    });

    // Story
    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_2666,w_1500/l_social:Story:StoryBlank/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          160,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_StoryBlank.jpg`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_2666,w_1500/l_social:Story:Story1/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          210,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Story1.jpg`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/`,
        this.handleBrokenName(
          artist.name,
          'center',
          0,
          -400,
          120,
          85,
          'ffffff',
          '202020',
        ),
        `social/Story/Story2.png`,
      ].join(''),
      name: `${cleanArtistName}_Story2.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/social/Story/Story3.png`,
      ].join(''),
      name: `${cleanArtistName}_Story3.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/social/Story/Story4.png`,
      ].join(''),
      name: `${cleanArtistName}_Story4.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${color + '33'}/social/Story/Story5.png`,
      ].join(''),
      name: `${cleanArtistName}_Story5.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/l_text:Arial_60_bold:%20${encodeURI(
          'ampled.com%2Fartist%2F' + artist.artistSlug,
        )}%20,co_rgb:ffffff,b_rgb:202020,g_center,y_100/`,
        `/b_rgb:${color + '33'}/social/Story/Story6.png`,
      ].join(''),
      name: `${cleanArtistName}_Story6.png`,
      description: '',
    });

    return (
      <div>
        <div className="details__info_title">Promote Your Page</div>
        <div className="row">
          <div className="col-6">
            <div className="details__info_title sm">Square</div>
            <div className="details__promote_container">
              {promoteSquare.map((promoImage) => (
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
          <div className="col-6">
            <div className="details__info_title sm">Stories</div>
            <div className="details__promote_container">
              {promoteStory.map((promoImage) => (
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
        </div>
      </div>
    );
  };

  renderSupporterShareImages = (artist) => {
    const BASE_UPLOAD_URL =
      'https://res.cloudinary.com/ampled-web/image/upload';
    let color = artist.artistColor;
    color = color.replace('#', '');
    const cleanArtistName = artist.name
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const supportShare = [];

    // Square
    supportShare.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_1500,w_1500/l_social:Supporter:Grid/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          160,
          80,
          65,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Grid.jpg`,
      description: '',
    });

    // Story
    supportShare.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_2666,w_1500/l_social:Supporter:Story/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          270,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Story.jpg`,
      description: '',
    });

    return (
      <div>
        <div className="details__info_title">Promote This Page</div>
        <div className="row">
          <div className="col-12">
            <div className="details__promote_container">
              {supportShare.map((promoImage) => (
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
        </div>
      </div>
    );
  };

  handlePromoteImages = (promoteImages) => {
    // Attempt at a single download button
    // This requires cross browser to be enabled for cloudinary.com, which it currently is not.
    // const fileUrls = promoteImages.map((image) => image.url);
    // multiDownload(fileUrls);
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
          <button
            onClick={() => this.setState({ showPasswordModal: true })}
            className="user-content__change-password"
          >
            Change Password
          </button>
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
                  {subscription.artistApproved && (
                    <div className="details__promote">
                      <div className="row no-gutter">
                        <div className="col-12">
                          {this.renderSupporterShareImages(subscription)}
                        </div>
                      </div>
                    </div>
                  )}
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
        {this.state.showPasswordModal && (
          <Modal
            open={this.state.showPasswordModal}
            onClose={() => this.setState({ showPasswordModal: false })}
          >
            <ResetPassword type="change" />
          </Modal>
        )}
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
