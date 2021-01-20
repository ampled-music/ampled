import './create-artist.scss';
import './../artist/posts/post/post.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  TextField,
  Input,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Button,
  Checkbox,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Instagram from '../../images/icons/Icon_Instagram.svg';
import Twitter from '../../images/icons/Icon_Twitter.svg';
import Bandcamp from '../../images/icons/Icon_Bandcamp.svg';
import Youtube from '../../images/icons/Icon_Youtube.svg';
import Link1 from '../../images/icons/Icon_Link_1.svg';

import { faStripe } from '@fortawesome/free-brands-svg-icons';
import ChromePicker from 'react-color/lib/Chrome';

import { theme } from './theme';
import tear from '../../images/full_page_tear.png';
import Close from '../../images/icons/Icon_Close-Cancel.svg';

import { Store } from '../../redux/configure-store';

import { showToastAction } from '../../redux/toast/toast-modal';
import { deleteArtistAction } from '../../redux/artists/delete';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';
import { UploadImage } from '../shared/upload/UploadImage';

import { Modal } from '../shared/modal/Modal';

import { Members } from './Members';

interface CreateArtistProps {
  me: any;
  editMode?: boolean;
  artist?: any;
  showToast: Function;
  deleteArtist: Function;
}

class CreateArtist extends React.Component<CreateArtistProps, any> {
  randomColor = () => {
    const bgColor = ['#e9c7c6', '#eddfbd', '#baddac', '#cae4e7'];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  };

  state = {
    randomColor: '',
    artistColor: '',
    artistColorAlpha: '',
    artistName: '',
    artistVerb: '',
    artistLocation: '',
    artistMessage: '',
    artistTwitter: '',
    artistInstagram: '',
    artistBandcamp: '',
    artistYoutube: '',
    artistExternal: '',
    artistVideo: '',
    artistSlug: '',
    artistStripe: '',
    hideMembers: false,
    members: [],
    images: [],
    loading: true,
    showConfirmRemoveMember: false,
    confirmRemoveMemberIndex: 99,
    showDeleteModal: false,
    isDeletedPage: false,
    subscribeToNewsletter: true,
  };

  constructor(props) {
    super(props);
    const randomColor = this.randomColor();
    this.state = {
      ...this.state,
      randomColor,
      artistColor: randomColor,
      artistColorAlpha: randomColor + '33',
    };
  }

  componentDidUpdate = (prevProps) => {
    const {
      me: { userData },
      artist,
      editMode,
    } = this.props;

    const { loading } = this.state;
    if (userData && !prevProps?.me?.userData) {
      const { name, last_name, instagram, twitter, image, email } = userData;
      if (!editMode) {
        this.setState({
          members: [
            {
              isAdmin: true,
              firstName: name,
              lastName: last_name,
              email,
              role: '',
              instagram,
              twitter,
              photo: image,
            },
          ],
        });
      }
    }
    if (editMode && artist && !prevProps?.artist?.name && artist.name) {
      // console.log(artist);
      const {
        accent_color,
        name,
        verb_plural,
        location,
        bio,
        twitter_handle,
        instagram_handle,
        youtube_handle,
        bandcamp_handle,
        external,
        video_url,
        hide_members,
        subscribe_to_newsletter,
        slug,
        owners,
        images,
      } = artist;
      this.setState({
        artistColor: accent_color,
        artistColorAlpha: accent_color + '33',
        artistName: name,
        artistVerb: verb_plural ? 'are' : 'is',
        artistLocation: location,
        artistMessage: bio,
        artistTwitter: twitter_handle,
        artistInstagram: instagram_handle,
        artistYoutube: youtube_handle,
        artistBandcamp: bandcamp_handle,
        artistExternal: external,
        artistVideo: video_url,
        artistSlug: slug,
        artistStripe: '',
        hideMembers: hide_members,
        subscribeToNewsletter: subscribe_to_newsletter,
        members: (owners || []).map((owner) => ({
          firstName: owner.name || '',
          role: owner.instrument || '',
          email: owner.email || '',
          lastName: owner.lastName || '',
          isAdmin: owner.role === 'admin',
        })),
        images: images || [],
      });
    }
    if (userData && (artist || !editMode) && loading) {
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount = () => {
    const {
      artist,
      editMode,
      me: { userData },
    } = this.props;
    if (editMode && artist && artist.name) {
      const {
        accent_color,
        name,
        verb_plural,
        location,
        bio,
        twitter_handle,
        instagram_handle,
        youtube_handle,
        bandcamp_handle,
        external,
        video_url,
        slug,
        owners,
        images,
        hide_members,
      } = artist;
      this.setState({
        artistColor: accent_color,
        artistName: name,
        artistVerb: verb_plural ? 'are' : 'is',
        artistLocation: location,
        artistMessage: bio,
        artistTwitter: twitter_handle,
        artistInstagram: instagram_handle,
        artistYoutube: youtube_handle,
        artistBandcamp: bandcamp_handle,
        artistExternal: external,
        artistVideo: video_url,
        artistSlug: slug,
        artistStripe: '',
        hideMembers: hide_members,
        members: (owners || []).map((owner) => ({
          firstName: owner.name || '',
          role: owner.instrument || '',
          email: owner.email || '',
          lastName: owner.lastName || '',
          isAdmin: owner.role === 'admin',
        })),
        images: images || [],
      });
    } else if (!editMode && userData) {
      // nothing commit
      this.setState({
        loading: false,
      });

      if (this.state.members.length === 0) {
        const { name, last_name, instagram, twitter, image, email } = userData;
        this.setState({
          members: [
            {
              isAdmin: true,
              firstName: name,
              lastName: last_name,
              email,
              role: '',
              instagram,
              twitter,
              photo: image,
            },
          ],
        });
      }
    }
  };

  isShowDeleteBtn = () => {
    if (this.props.artist?.owners && this.props.me?.userData) {
      const isPageAdmin = this.props.artist.owners.some((owner) => {
        return owner.id === this.props.me.userData.id;
      });

      return isPageAdmin && this.props.editMode;
    }

    return false;
  };

  deleteArtistPage = async () => {
    const response = await this.props.deleteArtist(this.props.artist.id);

    if (response && response.data) {
      if (response.status === 200 && response.data?.status !== 'error') {
        this.props.showToast({
          message: response.data.message,
          type: 'success',
        });

        this.setState({ isDeletedPage: true });
        // window.location.href = '/';
      } else {
        this.props.showToast({
          message: response.data.message,
          type: 'error',
        });
      }
    } else {
      this.props.showToast({
        message: 'There was an error deleting your artist page.',
        type: 'error',
      });
    }
  };

  handleColorChange = (color) => {
    this.setState({
      artistColor: color.hex,
      artistColorAlpha: color.hex + '33',
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'artistSlug') {
      this.setState({ [name]: value.toLowerCase() });
    } else if (name === 'artistInstagram' || name === 'artistTwitter') {
      this.setState({ [name]: value.replace(/^#|@/, '') });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  renderHeader = () => {
    return (
      <div
        className="create-artist__header"
        style={{ backgroundColor: this.state.randomColor }}
      >
        <div className="container">
          <h2>{this.props.editMode ? 'Edit' : 'Create'} Your Artist Page</h2>
        </div>
        <img className="create-artist__header_tear" src={tear} alt="" />
      </div>
    );
  };

  renderAbout = () => {
    return (
      <div className="container">
        <div className="artist-about">
          {this.props.editMode ? (
            <div className="create-artist__copy">
              <p>
                Click Save Your Page at the bottom of this form to save your
                work.
              </p>
            </div>
          ) : (
            <div className="create-artist__copy">
              <p>
                <b>Double-check your artist/band name and custom link</b>, as
                you can&#39;t change them later. (You can edit everything else.)
              </p>
              <p>
                Click Preview Your Page at the bottom of this form to save your
                work.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  renderInfo = () => {
    const { artistName } = this.state;
    const displayName = artistName || 'Band';
    return (
      <div className="container">
        <div className="artist-custom">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Artist or Band Name</div>
              <h6>Required</h6>
            </div>
            <div className="col-md-8 col-sm-12">
              <TextField
                name="artistName"
                placeholder="Name"
                id="name"
                value={this.state.artistName || ''}
                onChange={this.handleChange}
                fullWidth
                disabled={!!this.props.editMode}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Your Custom Link</div>
              <h6>Required</h6>
              <h6>Letters and dashes only.</h6>
            </div>
            <div className="col-md-8 col-sm-12">
              <TextField
                name="artistSlug"
                id="artistSlug"
                value={this.state.artistSlug || ''}
                onChange={this.handleChange}
                fullWidth
                required
                disabled={!!this.props.editMode}
                InputProps={{
                  autoComplete: 'off',
                  inputProps: { autoCapitalize: 'off', autoCorrect: 'off' },
                  startAdornment: (
                    <InputAdornment position="start">
                      ampled.com/artist/
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">
                What Sounds More Accurate?
              </div>
              <h6>Required</h6>
            </div>
            <div className="col-md-8 col-sm-12">
              <RadioGroup
                aria-label="artistVerb"
                name="artistVerb"
                value={this.state.artistVerb || ''}
                onChange={this.handleChange}
              >
                <FormControlLabel
                  value="are"
                  control={<Radio />}
                  label={`${displayName} are recording a new record.`}
                />
                <FormControlLabel
                  value="is"
                  control={<Radio />}
                  label={`${displayName} is recording a new record.`}
                />
              </RadioGroup>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Location</div>
            </div>
            <div className="col-md-8 col-sm-12">
              <TextField
                name="artistLocation"
                placeholder="Location"
                id="location"
                value={this.state.artistLocation || ''}
                onChange={this.handleChange}
                fullWidth
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Written Message</div>
              <h6>Required</h6>
              <h6>
                This message is featured on your artist page.
                <br />
                You can edit this later.
              </h6>
            </div>
            <div className="col-md-8 col-sm-12">
              <TextField
                name="artistMessage"
                label="Who are you? Why should people support you?"
                id="message"
                value={this.state.artistMessage || ''}
                onChange={this.handleChange}
                multiline
                rows="5"
                fullWidth
                variant="outlined"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Social</div>
              <h6>
                For Bandcamp, Twitter, and Instagram just enter your username,
                with no &quot;@&quot;.
                <br />
                For Youtube and External URL enter the full URL.
              </h6>
            </div>
            <div className="col-md-5 col-sm-12">
              <div className="social-input">
                <ReactSVG className="icon icon_black icon_sm" src={Twitter} />
                <TextField
                  name="artistTwitter"
                  id="twitter"
                  value={this.state.artistTwitter || ''}
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        twitter.com/
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="social-input">
                <ReactSVG className="icon icon_black icon_sm" src={Instagram} />
                <TextField
                  name="artistInstagram"
                  id="instagram"
                  value={this.state.artistInstagram || ''}
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        instagram.com/
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="social-input">
                <ReactSVG className="icon icon_black icon_sm" src={Bandcamp} />
                <Input
                  name="artistBandcamp"
                  id="bandcamp"
                  value={this.state.artistBandcamp || ''}
                  onChange={this.handleChange}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      .bandcamp.com
                    </InputAdornment>
                  }
                />
              </div>
              <div className="url-input">
                <ReactSVG className="icon icon_black icon_sm" src={Youtube} />
                <TextField
                  name="artistYoutube"
                  id="youtube"
                  placeholder="https://youtube.com/your-url"
                  value={this.state.artistYoutube || ''}
                  onChange={this.handleChange}
                  fullWidth
                />
              </div>
              <div className="url-input">
                <ReactSVG className="icon icon_black icon_sm" src={Link1} />
                <TextField
                  name="artistExternal"
                  id="external"
                  placeholder="https://yoursite.com"
                  value={this.state.artistExternal || ''}
                  onChange={this.handleChange}
                  fullWidth
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Video Message</div>
              <h6>
                This video is featured on your artist page.
                <br />
                You can add this later.
              </h6>
            </div>
            <div className="col-md-5 col-sm-12">
              <TextField
                name="artistVideo"
                label="Video URL (Vimeo or YouTube)"
                id="video-message"
                value={this.state.artistVideo || ''}
                onChange={this.handleChange}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderImages = () => {
    const { images } = this.state;
    const imageSetter = (index) => (cloudinary) => {
      if (cloudinary) {
        images[index] = {
          url: cloudinary.url,
          public_id: cloudinary.public_id,
          order: index,
        };
      } else {
        images[index] = null;
      }
      this.setState({ images });
    };

    const imageTypes = ['Primary', 'Photo #2', 'Photo #3'];

    return (
      <div className="container">
        <div className="image-upload">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="create-artist__subtitle">Featured Images</div>
              <h6>
                Minimum resolution: 700 X 700
                <br />
                Maximum size: 5mb
              </h6>
              {/* <div className="create-artist__copy">
                You can have several photos for your profile, but there can be
                only one profile photo, which will be used to identify you to
                your supporters in certain scenarios. Select your primary photo
                and then up to two secondary photos for your profile.
              </div> */}
            </div>
          </div>
          <div className="row">
            {imageTypes.map((type, index) => (
              <div className="col-md-4 col-sm-12" key={index}>
                <UploadImage
                  altText={type}
                  setImage={imageSetter(index)}
                  imageObject={images[index]}
                  showToast={this.props.showToast}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  renderColor = () => {
    return (
      <div className="artist-color">
        <div
          className="primary-color"
          style={{ backgroundColor: this.state.artistColor }}
        >
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-6 col-sm-12">
                <div className="artist-color__info">
                  <div className="create-artist__subtitle">Accent Color</div>
                  <div className="create-artist__copy">
                    <p>
                      Select a color for your artist page. This color will be
                      used as accents on both your page and around the site.
                    </p>
                    <p>
                      The lighter version (20% opacity) of the color is how it
                      will appear in certain rare instances.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="artist-color__picker">
                  <ChromePicker
                    color={
                      this.state.artistColor
                        ? this.state.artistColor
                        : this.state.randomColor
                    }
                    onChangeComplete={this.handleColorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="secondary-color"
          style={{ backgroundColor: this.state.artistColorAlpha }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="artist-color__opacity">20% Opacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  addMember = () => {
    this.setState({
      members: [
        ...this.state.members,
        {
          isAdmin: true,
          email: '',
          firstName: '',
          lastName: '',
          role: '',
          instagram: '',
          twitter: '',
          photo: '',
        },
      ],
    });
  };

  removeMemberConfirm = (index) => {
    this.setState({
      showConfirmRemoveMember: true,
      confirmRemoveMemberIndex: index,
    });
  };

  removeMember = (index) => {
    this.setState({
      members: [
        ...this.state.members.slice(0, index),
        ...this.state.members.slice(index + 1),
      ],
      showConfirmRemoveMember: false,
    });
  };

  renderPayment = () => {
    return (
      <div className="container">
        <div className="artist-payment">
          <div className="row justify-content-between">
            <div className="col-6">
              <div className="create-artist__title">Payments</div>
              <div className="create-artist__copy">
                All of Ampled payments are handled through Stripe. Create an
                account and agree to our terms of use to get started.
              </div>
            </div>
            <div className="col-3">
              <div className="center">
                <FontAwesomeIcon
                  className="artist-payment__stripe_icon"
                  icon={faStripe}
                />
                <a
                  href="https://stripe.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn link"
                >
                  Learn more about Stripe
                </a>
              </div>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-6">
              <FormControlLabel
                control={
                  <Checkbox name="StripeTerms" onChange={this.handleChange} />
                }
                label="I agree to the Terms of Use."
              />
            </div>
            <div className="col-3">
              <div className="center">
                <div className="action-buttons">
                  <Button
                    href="https://stripe.com/about"
                    target="_blank"
                    className="publish-button"
                  >
                    Create your account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  updateMemberDetails = (e, index) => {
    const { members } = this.state;
    const { name, value, type, checked } = e.target;

    this.setState({
      members: [
        ...members.slice(0, index),
        {
          ...members[index],
          [name]: type === 'checkbox' ? checked : value,
        },
        ...members.slice(index + 1),
      ],
    });
  };

  onDeleteBtnClicked = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  onSubmit = async () => {
    const {
      artistName,
      artistColor,
      artistInstagram,
      artistTwitter,
      artistBandcamp,
      artistYoutube,
      artistExternal,
      artistLocation,
      artistMessage,
      artistSlug,
      artistVerb,
      artistVideo,
      hideMembers,
      images,
      members,
    } = this.state;

    // validate fields
    if (
      !artistName ||
      !artistSlug ||
      !artistColor ||
      !/^[a-z-0-9]*[a-z]+[a-z-0-9]*$/.test(artistSlug)
    ) {
      return this.props.showToast({
        message: 'Please check required fields.',
        type: 'error',
      });
    }

    const videoRegex = /(youtube.com\/watch\?|youtu.be\/|vimeo.com\/\d+)/gi;

    if (
      artistVideo &&
      artistVideo.length > 0 &&
      !videoRegex.test(artistVideo)
    ) {
      return this.props.showToast({
        message:
          'Your video message should be a link to a single Youtube or Vimeo video.',
        type: 'error',
      });
    }

    if (
      images.filter((image) => image !== null && typeof image !== 'undefined')
        .length === 0
    ) {
      return this.props.showToast({
        message: 'Please add at least one image.',
        type: 'error',
      });
    }

    // Make sure Bandcamp is just the username not the url
    if (artistBandcamp && !/^[0-9a-z-]+$/gi.test(artistBandcamp)) {
      return this.props.showToast({
        message:
          'Please check the format of your Bandcamp username. For example, if your url is bandname.bandcamp.com then your username is bandname )',
        type: 'error',
      });
    }

    // Make sure @ symbol isn't apart of Instagram or Twitter
    if (/[@:/]/gi.test(artistTwitter) || /[@:/]/gi.test(artistInstagram)) {
      return this.props.showToast({
        message: 'Please check the format of your social handles.',
        type: 'error',
      });
    }

    // Make sure Youtube has youtube.com in the URL
    if (artistYoutube && !/(youtube.com)/gi.test(artistYoutube)) {
      return this.props.showToast({
        message:
          'Please check that your YouTube URL is pointing to youtube.com',
        type: 'error',
      });
    }

    if (
      members.filter(
        (member) =>
          member.email &&
          member.email.length &&
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            member.email,
          ) &&
          member.firstName &&
          member.firstName.length,
      ).length !== members.length
    ) {
      return this.props.showToast({
        message: 'Please check required fields for members.',
        type: 'error',
      });
    }

    // hotfix accidental image deletion while we find better solution
    const fixImages = images
      .filter((image) => image !== null && typeof image !== 'undefined')
      .map(({ public_id, url, order }) => ({ public_id, url, order }));

    // create page
    this.setState({
      loading: true,
    });
    if (!this.props.editMode) {
      const { data } = await apiAxios({
        method: 'post',
        url: '/artist_pages.json',
        data: {
          artist_page: {
            name: artistName,
            bio: artistMessage,
            location: artistLocation,
            accent_color: artistColor,
            slug: artistSlug.toLowerCase(),
            video_url: artistVideo,
            instagram_handle: artistInstagram,
            twitter_handle: artistTwitter,
            youtube_handle: artistYoutube,
            bandcamp_handle: artistBandcamp,
            external: artistExternal,
            verb_plural: artistVerb !== 'is',
            hide_members: hideMembers,
            images: fixImages,
          },
          members,
        },
      });

      this.setState({
        loading: false,
      });

      if (data.status && data.status === 'error') {
        this.props.showToast({
          message: data.message,
          type: 'error',
        });
      } else if (data.status && data.status === 'ok') {
        this.props.showToast({
          message: data.message,
          type: 'success',
        });
        window.location.href = `/artist/${artistSlug}`;
      }
    } else {
      const { data } = await apiAxios({
        method: 'put',
        url: `/artist_pages/${this.props.artist?.id}.json`,
        data: {
          artist_page: {
            bio: artistMessage,
            location: artistLocation,
            accent_color: artistColor,
            video_url: artistVideo,
            instagram_handle: artistInstagram,
            twitter_handle: artistTwitter,
            youtube_handle: artistYoutube,
            bandcamp_handle: artistBandcamp,
            external: artistExternal,
            verb_plural: artistVerb !== 'is',
            hide_members: hideMembers,
            images: fixImages,
          },
          members,
        },
      });

      this.setState({
        loading: false,
      });

      if (data.status && data.status === 'error') {
        this.props.showToast({
          message: data.message,
          type: 'error',
        });
      } else if (data.status && data.status === 'ok') {
        this.props.showToast({
          message: data.message,
          type: 'success',
        });
        window.location.href = `/artist/${artistSlug}`;
      }
    }
  };

  renderSupporterCount = () => {
    const hasSupporters = this.props.artist?.supporters?.length > 0;
    if (!hasSupporters) {
      return;
    }

    return (
      <p>
        You have {this.props.artist.supporters.length} supporter(s) currently.
        When you delete your page, subscriptions to your page will also be
        deleted.
      </p>
    );
  };

  renderDeleteModal = () => {
    return (
      <Modal
        open={this.state.showDeleteModal}
        onClose={() =>
          this.setState({ showDeleteModal: !this.state.showDeleteModal })
        }
      >
        <div className="delete-post-modal__container">
          <img className="tear tear__topper" src={tear} alt="" />
          <div className="delete-post-modal">
            <div className="delete-post-modal__title">
              <h4>Are you sure?</h4>
            </div>
            <p>
              Deleting your page is permanent, and any content posted will be
              deleted permanently as well.
            </p>
            {this.renderSupporterCount()}
            <div className="delete-post-modal__actions action-buttons">
              <Button
                className="cancel-button"
                onClick={() => this.setState({ showDeleteModal: false })}
              >
                Cancel
              </Button>
              <Button
                className="publish-button"
                onClick={this.deleteArtistPage}
              >
                Delete Artist Page
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  renderDeleteBtn() {
    if (!this.isShowDeleteBtn()) {
      return;
    }
    return (
      <div className="col-md-6 col-sm-12">
        <Button
          onClick={this.onDeleteBtnClicked}
          className="btn btn-ampled btn-delete"
        >
          Delete your page
        </Button>
      </div>
    );
  }

  render() {
    const {
      me: { userData },
    } = this.props;

    if (this.state.isDeletedPage) {
      return <Redirect to="/" />;
    } else if (this.state.loading) {
      return <Loading artistLoading={true} />;
    } else if (userData && !userData.email_confirmed) {
      return (
        <div
          style={{
            textAlign: 'center',
            margin: '100px auto',
          }}
        >
          Please confirm your email first by clicking the link in your welcome
          email.
        </div>
      );
    }

    const showDeleteBtn = this.isShowDeleteBtn();
    const saveBtnClasses = classnames('col-sm-12', {
      'col-md-6': showDeleteBtn,
      'col-md-12': !showDeleteBtn,
    });

    return (
      <div className="create-artist">
        {this.renderDeleteModal()}
        <Modal
          open={this.state.showConfirmRemoveMember}
          onClose={() => {
            this.setState({ showConfirmRemoveMember: false });
          }}
        >
          <Card className="artist-members__card">
            <CardContent>
              <h4>Are you sure?</h4>
            </CardContent>
            <CardActions className="action-buttons">
              <Button
                className="cancel-button"
                onClick={() => {
                  this.setState({ showConfirmRemoveMember: false });
                }}
              >
                <ReactSVG className="icon" src={Close} />
              </Button>
              <Button
                className="publish-button"
                onClick={() => {
                  this.removeMember(this.state.confirmRemoveMemberIndex);
                }}
              >
                Remove Member
              </Button>
            </CardActions>
          </Card>
        </Modal>
        <MuiThemeProvider theme={theme}>
          {this.renderHeader()}
          {/* {this.renderNav()} */}
          {this.renderAbout()}
          {this.renderInfo()}
          {this.renderImages()}
          {this.renderColor()}
          <Members
            bandName={this.state.artistName}
            members={this.state.members}
            handleChange={this.updateMemberDetails}
            addMember={this.addMember}
            removeMember={this.removeMemberConfirm}
            userData={this.props.me?.userData}
            hideMembers={this.state.hideMembers}
            setHideMembers={(val) => this.setState({ hideMembers: val })}
          />
          {/* {this.renderPayment()} */}
          <div className="container">
            {!this.props.editMode && (
              <div className="row justify-content-center">
                <div className="col-md-6 col-sm-10 create-artist__bottomcopy">
                  <p>
                    Your page should initially only be visible to you and any
                    other members you may add.
                  </p>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.subscribeToNewsletter}
                        onChange={this.handleCheckBoxChange}
                        name="subscribeToNewsletter"
                      />
                    }
                    label="Receive email updates from Ampled."
                  />
                </div>
              </div>
            )}
            <div className="row action-buttons">
              {/* {this.renderDeleteBtn()} */}
              <div className={`col-sm-6 center ${saveBtnClasses}`}>
                <Button onClick={this.onSubmit} className="publish-button">
                  {this.props.editMode ? 'Update your page' : 'Save your page'}
                </Button>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showToast: bindActionCreators(showToastAction, dispatch),
  deleteArtist: bindActionCreators(deleteArtistAction, dispatch),
});

const connectArtist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateArtist);

export { connectArtist as CreateArtist };
