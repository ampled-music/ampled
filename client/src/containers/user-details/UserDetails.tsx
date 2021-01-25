import './../artist/artist.scss';
import './user-details.scss';
import '../settings/user-settings.scss';

import * as loadImage from 'blueimp-load-image';
import * as React from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from '../../redux/configure-store';
import { ReactSVG } from 'react-svg';
import Close from '../../images/icons/Icon_Close-Cancel.svg';

import { getMeAction } from '../../redux/me/get-me';
import { setUserDataAction } from '../../redux/me/set-me';
import { updateMeAction } from '../../redux/me/update-me';
import { updateCardAction } from '../../redux/me/update-card';
import { showToastAction } from '../../redux/toast/toast-modal';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';

import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  DialogActions,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import {
  faCcAmex,
  faCcDiscover,
  faCcMastercard,
  faCcVisa,
  faCcStripe,
} from '@fortawesome/free-brands-svg-icons';
import Edit from '../../images/icons/Icon_Edit.svg';
import Instagram from '../../images/icons/Icon_Instagram.svg';
import Twitter from '../../images/icons/Icon_Twitter.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { UploadFile } from '../shared/upload/UploadFile';
import { StripePaymentProvider } from '../artist/support/StripePaymentProvider';

import { UserImage } from './UserImage';
import { theme } from './theme';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & { history: any; errorCard: any };

const SingleCardDisplay = ({ brand, last4, exp_month, exp_year, is_valid }) => {
  let brandIcon = faCcStripe;
  switch (brand.toLowerCase()) {
    case 'visa':
      brandIcon = faCcVisa;
      break;
    case 'american express':
      brandIcon = faCcAmex;
      break;
    case 'mastercard':
      brandIcon = faCcMastercard;
      break;
    case 'discover':
      brandIcon = faCcDiscover;
      break;
  }
  return (
    <Card className="card single-credit-card">
      <div className="card-header">
        <FontAwesomeIcon className="card-header__icon" icon={brandIcon} />
        <span>
          {brand} ending in {last4}
        </span>
      </div>
      <CardContent>
        <div className="row">
          <div className="col-6">
            <h6>Status</h6>
            <span
              style={{
                color: is_valid ? '#28a745' : '#dc3545',
              }}
            >
              {is_valid ? 'Valid' : 'Invalid'}
            </span>
          </div>
          <div className="col-6">
            <h6>Expiration</h6>
            {exp_month}/{exp_year}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CardInfoProps {
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  is_valid: boolean;
  updateCard: Function;
  updatedCard: boolean;
  errorCard: any;
  showToast: Function;
}

class CardInfo extends React.Component<CardInfoProps> {
  state = {
    showEditForm: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.updatedCard && this.props.updatedCard) {
      this.setState({ showEditForm: false });
    }
  }

  render() {
    const { brand, updateCard, errorCard } = this.props;
    const { showEditForm } = this.state;
    if (!showEditForm) {
      return (
        <div>
          {brand ? (
            <div>
              <SingleCardDisplay {...this.props} />
              <button
                className="btn btn-link btn-edit-card"
                onClick={() => this.setState({ showEditForm: !showEditForm })}
              >
                Replace this card
              </button>
            </div>
          ) : (
            <Card className="card card-empty">
              <CardContent>
                <span
                  className="btn btn-link btn-edit-card"
                  style={{ textDecoration: 'none' }}
                >
                  No card stored
                </span>
                {/*
                <button className="btn btn-link btn-edit-card" onClick={() => this.setState({ showEditForm: !showEditForm })}>
                  Add a payment method
                </button>
                */}
              </CardContent>
            </Card>
          )}
        </div>
      );
    } else {
      return (
        <StripePaymentProvider
          formType="editcard"
          artistPageId={null}
          subscriptionLevelValue={null}
          declineStep={() => {
            this.setState({ showEditForm: false });
          }}
          createSubscription={() => null}
          updateCard={updateCard}
          errorCard={errorCard}
          showToast={this.props.showToast}
        />
      );
    }
  }
}

class UserDetailsComponent extends React.Component<Props, any> {
  state = {
    showUserPhotoModal: false,
    photoContent: undefined,
    photoBody: undefined,
    processingImage: false,
    name: '',
    last_name: '',
    email: '',
    originalEmail: '', // used for checking if the user is attempting to update their email
    city: '',
    country: '',
    twitter: '',
    instagram: '',
    bio: '',
    ship_address: '',
    ship_address2: '',
    ship_city: '',
    ship_state: '',
    ship_country: '',
    ship_zip: '',
    name_error: false,
    city_error: false,
    country_error: false,
    social_error: false,
    showEditForm: false,
    crop: { x: 0, y: 0 },
    croppedAreaPixels: { x: 0, y: 0, height: 0, width: 0 },
    zoom: 1,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    let ok = true;
    if (!this.state.name.length) {
      ok = false;
      this.setState({ name_error: true });
    } else {
      this.setState({ name_error: false });
    }
    if (!this.state.city.length) {
      ok = false;
      this.setState({ city_error: true });
    } else {
      this.setState({ city_error: false });
    }
    if (!this.state.country.length) {
      ok = false;
      this.setState({ country_error: true });
    } else {
      this.setState({ country_error: false });
    }
    if (
      /[@:/]/gi.test(this.state.twitter) ||
      /[@:/]/gi.test(this.state.instagram)
    ) {
      ok = false;
      this.setState({ social_error: true });
    } else {
      this.setState({ social_error: false });
    }
    return ok;
  };

  handleSubmit = async (e) => {
    const { showToast } = this.props;
    e.preventDefault();

    if (!this.validateForm()) {
      showToast({
        message: 'There was an error with your fields.',
        type: 'error',
      });
      return;
    }

    const submitResult = await this.props.updateMe(this.state);

    if (submitResult) {
      const hasEmailChanged = this.state.email !== this.state.originalEmail;
      const successMessage = 'Your changes have been saved.';
      const emailChangedMessage =
        'You changed the email address associated with your account. Use this new email address for future logins.';
      const message = hasEmailChanged
        ? `${successMessage} ${emailChangedMessage}`
        : successMessage;

      showToast({
        message,
        type: 'success',
      });
    } else {
      showToast({
        message: 'There was an error submitting your details.',
        type: 'error',
      });
    }
  };

  componentDidMount() {
    this.props.getMe().then((userData) => {
      userData && this.loadUserDataIntoState(userData);
    });
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

    if (this.state.showUserPhotoModal && this.props.updated) {
      this.updateUserPhoto();
    }
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ croppedAreaPixels });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  };

  renderCropper = (photoBody) => {
    return (
      <>
        <div className="cropper">
          <Cropper
            image={photoBody}
            aspect={1}
            showGrid={false}
            crop={this.state.crop}
            zoom={this.state.zoom}
            onCropChange={this.onCropChange}
            onCropComplete={this.onCropComplete}
            cropShape="round"
            onZoomChange={this.onZoomChange}
          />
        </div>
        <div className="slider">
          <Slider
            value={this.state.zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="zoom"
            onChange={(e, zoom) => this.onZoomChange(zoom)}
          />
        </div>
      </>
    );
  };

  renderAddPhotoButton = () => {
    const { userData } = this.props;
    return (
      <div className="add-photo-button-container">
        <UploadFile
          inputRefId="input-user-photo"
          uploadFile={this.loadPhotoContent}
        />
        <div
          className="image-button"
          onClick={() => document.getElementById('input-user-photo').click()}
        >
          <UserImage
            image={userData.image}
            className="user-image"
            alt={userData.name}
            width={120}
          />
        </div>
        <div className="action-buttons single-button">
          <Button
            disabled={this.props.updating}
            className="link-button"
            onClick={() => document.getElementById('input-user-photo').click()}
          >
            {this.state.photoContent || this.props.userData.image
              ? 'Change photo'
              : 'Add photo'}
          </Button>
        </div>
      </div>
    );
  };

  renderPhoto = () => {
    const { photoBody, processingImage } = this.state;
    const { userData } = this.props;

    if (processingImage && userData.image?.url) {
      return (
        <div className="processing-image">
          <CircularProgress size={80} />
        </div>
      );
    } else if (processingImage) {
      return (
        <div className="processing-image">
          <CircularProgress size={80} />
        </div>
      );
    }

    return photoBody
      ? this.renderCropper(photoBody)
      : this.renderAddPhotoButton();
  };

  renderPhotoSelector = () => {
    return (
      <div className="user-photo-selector-modal">
        {this.renderPhoto()}

        <div className="action-buttons">
          <Button
            disabled={this.props.updating}
            className="cancel-button"
            onClick={this.closeUserPhotoModal}
          >
            <ReactSVG className="icon" src={Close} />
          </Button>
          <Button
            disabled={!this.state.photoContent || this.props.updating}
            className="publish-button"
            onClick={this.saveUserPhoto}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  loadUserDataIntoState = (userData) => {
    this.setState({
      name: userData.name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      originalEmail: userData.email || '',
      city: userData.city || '',
      country: userData.country || '',
      twitter: userData.twitter || '',
      instagram: userData.instagram || '',
      bio: userData.bio || '',
      ship_address: userData.ship_address || '',
      ship_address2: userData.ship_address2 || '',
      ship_city: userData.ship_city || '',
      ship_state: userData.ship_state || '',
      ship_country: userData.ship_country || 'United States',
      ship_zip: userData.ship_zip || '',
    });
  };

  loadPhotoContent = (photoContent) => {
    this.setState({ processingImage: true });

    loadImage(
      photoContent.body,
      (canvas) => {
        if (!canvas.toDataURL) {
          this.props.showToast({
            message: 'Please select an image file.',
            type: 'error',
          });
          this.setState({
            processingImage: false,
            photoContent: undefined,
            photoBody: undefined,
          });
        } else {
          this.setState({
            processingImage: false,
            photoBody: canvas.toDataURL(),
            photoContent,
          });
        }
      },
      { orientation: true },
    );
  };

  saveUserPhoto = () => {
    const me = {
      file: this.state.photoContent.file,
      coordinates: `${this.state.croppedAreaPixels.x},${this.state.croppedAreaPixels.y},${this.state.croppedAreaPixels.width},${this.state.croppedAreaPixels.height}`,
    };
    this.props.updateMe(me);
  };

  updateUserPhoto = () => {
    this.closeUserPhotoModal();

    if (this.props.updatedData.image) {
      this.props.setMe({ image: this.props.updatedData.image });
      this.props.showToast({
        message: 'User photo updated!',
        type: 'success',
      });
      this.setState({
        crop: { x: 0, y: 0 },
        croppedAreaPixels: { x: 0, y: 0, height: 0, width: 0 },
        zoom: 1,
      });
    } else {
      this.setState({
        photoContent: undefined,
        photoBody: undefined,
        crop: { x: 0, y: 0 },
        croppedAreaPixels: { x: 0, y: 0, height: 0, width: 0 },
        zoom: 1,
      });
      this.props.showToast({
        message:
          'Something went wrong with your image upload. Please try again.',
        type: 'error',
      });
    }
  };

  showUserPhotoModal = (e) => {
    e.preventDefault();
    this.setState({ showUserPhotoModal: true });
  };
  closeUserPhotoModal = () =>
    this.setState({
      showUserPhotoModal: false,
      photoBody: undefined,
      crop: { x: 0, y: 0 },
      croppedAreaPixels: { x: 0, y: 0, height: 0, width: 0 },
      zoom: 1,
    });

  renderEmailAddress = () => {
    return (
      <div className="row no-gutters">
        <div className="col-2 col-md-3">
          <div className="user-details__subtitle">Account</div>
          <h6>Required</h6>
        </div>
        <div className="row col-10 col-md-9">
          <div className="col-md-12">
            <TextField
              type="email"
              name="email"
              label="Email"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
      </div>
    );
  };

  renderBasicInfo = () => {
    const { userData } = this.props;
    return (
      <div className="basic-info">
        <div className="row">
          <div className="col-md-2 user-details__side">
            <div className="user-details__title">Basic Info</div>
          </div>
          <div className="col-md-10">
            <div className="row no-gutters">
              <div className="col-2 col-md-3">
                <div className="user-details__subtitle">Name</div>
                <h6>Required</h6>
              </div>
              <div className="row col-10 col-md-9">
                <div className="col-md-6">
                  <TextField
                    name="name"
                    label="First name"
                    id="first-name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    name="last_name"
                    label="Last name (Optional)"
                    id="last-name"
                    value={this.state.last_name}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
            {this.renderEmailAddress()}
            <div className="row no-gutters">
              <div className="col-2 col-md-3">
                <div className="user-details__subtitle">Location</div>
                <h6>Required</h6>
              </div>
              <div className="row col-10 col-md-9">
                <div className="col-md-6">
                  <TextField
                    name="city"
                    label="City"
                    id="city"
                    value={this.state.city}
                    onChange={this.handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    name="country"
                    label="Country"
                    id="country"
                    value={this.state.country}
                    onChange={this.handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-md-3">
                <div className="user-details__subtitle">Photo</div>
                <div className="user-image-container">
                  <button
                    onClick={this.showUserPhotoModal}
                    aria-label="Edit avatar"
                  >
                    <UserImage
                      image={userData.image}
                      className="user-image"
                      alt={userData.name}
                      width={120}
                    />
                    <span className="tag">
                      <ReactSVG className="icon" src={Edit} />
                    </span>
                  </button>
                </div>
              </div>
              <div className="row col-md-9">
                <div className="col-2">
                  <div className="user-details__subtitle">Social</div>
                </div>
                <div className="col-10">
                  <TextField
                    name="twitter"
                    label="Twitter"
                    id="twitter"
                    placeholder="Twitter"
                    value={this.state.twitter}
                    onChange={this.handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReactSVG className="icon" src={Twitter} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="instagram"
                    label="Instagram"
                    id="instagram"
                    placeholder="Instagram"
                    value={this.state.instagram}
                    onChange={this.handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReactSVG className="icon" src={Instagram} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  {this.state.social_error && (
                    <span style={{ color: 'red', fontStyle: 'italic' }}>
                      Don't include @ or the full URL.
                      <br />
                      e.g. 'ampl3d' not '@ampl3d' or 'twitter.com/ampl3d'.
                      <br />
                      <br />
                    </span>
                  )}
                  <TextField
                    name="bio"
                    label="Bio"
                    id="bio"
                    value={this.state.bio}
                    onChange={this.handleChange}
                    multiline
                    rows="5"
                    fullWidth
                    variant="outlined"
                    // InputLabelProps={{ shrink: true, variant: 'standard' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderPayments = () => {
    const {
      userData: { cardInfo },
      updatedCard,
      updateCard,
      errorCard,
      showToast,
    } = this.props;

    return (
      <div className="basic-info">
        <div className="row">
          <div className="col-md-2 user-details__side">
            <div className="user-details__title">Payments</div>
          </div>
          <div className="col-md-10">
            <div className="row no-gutters">
              <div className="col-sm-8 col-md-5">
                <CardInfo
                  {...cardInfo}
                  updatedCard={updatedCard}
                  updateCard={updateCard}
                  errorCard={errorCard}
                  showToast={showToast}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderAddress = () => {
    return (
      <div className="address">
        <div className="row">
          <div className="col-md-2 user-details__side">
            <div className="user-details__title">Address</div>
            <h6>Optional</h6>
            <div className="user-details__info">
              This is only to allow the artists you support the ability to send
              you things.
            </div>
          </div>

          <div className="col-md-10">
            <div className="row no-gutters">
              <div className="col-2 col-md-3">
                <div className="user-details__subtitle">Country</div>
              </div>
              <div className="row col-10 col-md-9">
                <div className="col-12">
                  <TextField
                    name="ship_country"
                    id="ship-country"
                    label="Shipping country"
                    value={this.state.ship_country}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2 col-md-3">
                <div className="user-details__subtitle">Street</div>
              </div>
              <div className="row col-10 col-md-9">
                <div className="col-12">
                  <TextField
                    name="ship_address"
                    id="ship-address"
                    label="Shipping address"
                    placeholder="123 Fake St"
                    value={this.state.ship_address}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="ship_address2"
                    placeholder="Apt #123"
                    id="ship-address2"
                    label="Shipping address line 2"
                    value={this.state.ship_address2}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2 col-md-3">
                <div className="user-details__subtitle">City / State / Zip</div>
              </div>

              <div className="row col-10 col-md-9">
                <div className="col-md-5">
                  <TextField
                    name="ship_city"
                    placeholder="Anytown"
                    id="ship-city"
                    label="Shipping city"
                    value={this.state.ship_city}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    select
                    id="ship-state"
                    label="State"
                    name="ship_state"
                    value={this.state.ship_state}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="Alabama">Alabama</MenuItem>
                    <MenuItem value="Alaska">Alaska</MenuItem>
                    <MenuItem value="Arizona">Arizona</MenuItem>
                    <MenuItem value="Arkansas">Arkansas</MenuItem>
                    <MenuItem value="California">California</MenuItem>
                    <MenuItem value="Colorado">Colorado</MenuItem>
                    <MenuItem value="Connecticut">Connecticut</MenuItem>
                    <MenuItem value="Delaware">Delaware</MenuItem>
                    <MenuItem value="DC">District of Columbia</MenuItem>
                    <MenuItem value="Florida">Florida</MenuItem>
                    <MenuItem value="Georgia">Georgia</MenuItem>
                    <MenuItem value="Hawaii">Hawaii</MenuItem>
                    <MenuItem value="Idaho">Idaho</MenuItem>
                    <MenuItem value="Illinois">Illinois</MenuItem>
                    <MenuItem value="Indiana">Indiana</MenuItem>
                    <MenuItem value="Iowa">Iowa</MenuItem>
                    <MenuItem value="Kansas">Kansas</MenuItem>
                    <MenuItem value="Kentucky">Kentucky</MenuItem>
                    <MenuItem value="Louisiana">Louisiana</MenuItem>
                    <MenuItem value="Maine">Maine</MenuItem>
                    <MenuItem value="Maryland">Maryland</MenuItem>
                    <MenuItem value="Massachusetts">Massachusetts</MenuItem>
                    <MenuItem value="Michigan">Michigan</MenuItem>
                    <MenuItem value="Minnesota">Minnesota</MenuItem>
                    <MenuItem value="Mississippi">Mississippi</MenuItem>
                    <MenuItem value="Missouri">Missouri</MenuItem>
                    <MenuItem value="Montana">Montana</MenuItem>
                    <MenuItem value="Nebraska">Nebraska</MenuItem>
                    <MenuItem value="Nevada">Nevada</MenuItem>
                    <MenuItem value="New Hampshire">New Hampshire</MenuItem>
                    <MenuItem value="New Jersey">New Jersey</MenuItem>
                    <MenuItem value="New Mexico">New Mexico</MenuItem>
                    <MenuItem value="New York">New York</MenuItem>
                    <MenuItem value="North Carolina">North Carolina</MenuItem>
                    <MenuItem value="North Dakota">North Dakota</MenuItem>
                    <MenuItem value="Ohio">Ohio</MenuItem>
                    <MenuItem value="Oklahoma">Oklahoma</MenuItem>
                    <MenuItem value="Oregon">Oregon</MenuItem>
                    <MenuItem value="Pennsylvania">Pennsylvania</MenuItem>
                    <MenuItem value="Rhode Island">Rhode Island</MenuItem>
                    <MenuItem value="South Carolina">South Carolina</MenuItem>
                    <MenuItem value="South Dakota">South Dakota</MenuItem>
                    <MenuItem value="Tennessee">Tennessee</MenuItem>
                    <MenuItem value="Texas">Texas</MenuItem>
                    <MenuItem value="Utah">Utah</MenuItem>
                    <MenuItem value="Vermont">Vermont</MenuItem>
                    <MenuItem value="Virginia">Virginia</MenuItem>
                    <MenuItem value="Washington">Washington</MenuItem>
                    <MenuItem value="West Virginia">West Virginia</MenuItem>
                    <MenuItem value="Wisconsin">Wisconsin</MenuItem>
                    <MenuItem value="Wyoming">Wyoming</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-3">
                  <TextField
                    name="ship_zip"
                    placeholder="00000"
                    id="ship-zip"
                    label="ZIP code"
                    value={this.state.ship_zip}
                    onChange={this.handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderButtons = () => (
    <DialogActions className="action-buttons">
      <Button type="submit" className="publish-button">
        Finished
      </Button>
    </DialogActions>
  );

  renderContent = () => (
    <MuiThemeProvider theme={theme}>
      <Modal
        open={this.state.showUserPhotoModal}
        onClose={this.closeUserPhotoModal}
      >
        {this.renderPhotoSelector()}
      </Modal>
      <form onSubmit={this.handleSubmit}>
        {this.renderBasicInfo()}
        {this.renderPayments()}
        {this.renderAddress()}
        {this.renderButtons()}
      </form>
    </MuiThemeProvider>
  );

  render() {
    const { userData } = this.props;
    return (
      <div className="container user-details">
        <Loading isLoading={this.props.loadingMe} />
        {userData && this.renderContent()}
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
  updateMe: bindActionCreators(updateMeAction, dispatch),
  updateCard: bindActionCreators(updateCardAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

const UserDetails = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserDetailsComponent);

export { UserDetails, SingleCardDisplay };
