import './../artist/artist.scss';
import './user-details.scss';

import * as loadImage from 'blueimp-load-image';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';

import { getMeAction } from 'src/redux/me/get-me';
import { setUserDataAction } from 'src/redux/me/set-me';
import { updateMeAction } from 'src/redux/me/update-me';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Button, DialogActions, MenuItem, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { faTwitter, faInstagram, faCcAmex, faCcDiscover, faCcMastercard, faCcVisa, faCcStripe } from '@fortawesome/free-brands-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { UploadFile } from '../shared/upload/UploadFile';
import { showToastMessage, MessageType } from '../shared/toast/toast';

import avatar from '../../images/ampled_avatar.svg';

import { theme } from './theme';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & { history: any; };

class UserDetailsComponent extends React.Component<Props, any> {
  state = {
    showUserPhotoModal: false,
    photoContent: undefined,
    photoBody: undefined,
    processingImage: false,
    name: '',
    last_name: '',
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
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    let ok = true;
    if ( ! this.state.name.length ){
      ok = false;
      this.setState({ name_error: true });
    } else {
      this.setState({ name_error: false });
    }
    if ( ! this.state.city.length ){
      ok = false;
      this.setState({ city_error: true });
    } else {
      this.setState({ city_error: false });
    }
    if ( ! this.state.country.length ){
      ok = false;
      this.setState({ country_error: true });
    } else {
      this.setState({ country_error: false });
    }
    if (/[@:\/]/ig.test(this.state.twitter) || /[@:\/]/ig.test(this.state.instagram)) {
      ok = false;
      this.setState({ social_error: true });
    } else {
      this.setState({ social_error: false });
    }
    return ok;
  };

  handleSubmit = async (e) => {

    e.preventDefault();

    if ( !this.validateForm() ){
      showToastMessage("There was an error with your fields.", MessageType.ERROR, {timeOut: 4000});
      return;
    }

    const submitResult = await this.props.updateMe( this.state );

    if (submitResult) {
      showToastMessage("Your changes have been saved.", MessageType.SUCCESS, {timeOut: 8000});
    }
    else {
      showToastMessage("There was an error submitting your details.", MessageType.ERROR, {timeOut: 8000});
    }
  };

  componentDidMount() {
    this.props.getMe().then( ( userData ) => { this.loadUserDataIntoState( userData ) } )
  }

  componentDidUpdate() {
    if (this.props.token && !this.props.error && !this.props.userData && !this.props.loadingMe) {
      this.props.getMe();
    }

    if (this.state.showUserPhotoModal && this.props.updated) {
      this.updateUserPhoto();
    }
  }

  renderUserImage = () => {
    const { userData } = this.props;
    return (
      <div className="user-image-container">
        <button onClick={this.showUserPhotoModal} aria-label="Edit avatar">
          {userData.image ? (
            <img src={userData.image} className="user-image" alt="Your avatar" />
          ) : (
            <img src={avatar} className="user-image" alt="Your avatar" />
          )}
          <b className="tag">
            <FontAwesomeIcon icon={faEdit} />
          </b>
        </button>
      </div>
    );
  };

  renderAddPhotoButton = () => (
    <div className="add-photo-button-container">
      <UploadFile inputRefId="input-user-photo" uploadFile={this.loadPhotoContent} />
      <div className="action-buttons single-button">
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
      <img src={userData.image} className='image-preview' />
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

  loadUserDataIntoState = userData => {
    this.setState({
      name: userData.name || '',
      last_name: userData.last_name || '',
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
  }

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

  updateUserPhoto = () => {
    this.closeUserPhotoModal();
    this.props.setMe({ image: this.props.updatedData.profileImageUrl });
    showToastMessage('User photo updated!', MessageType.SUCCESS);
  };

  showUserPhotoModal = (e) => {
    e.preventDefault();
    this.setState({ showUserPhotoModal: true });
  }
  closeUserPhotoModal = () => this.setState({ showUserPhotoModal: false });

  renderBasicInfo = () => {
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
                {this.renderUserImage()}
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
                      startAdornment:
                        (<InputAdornment position="start">
                          <FontAwesomeIcon className="icon" icon={faTwitter} />
                        </InputAdornment>)
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
                      startAdornment:
                        (<InputAdornment position="start">
                          <FontAwesomeIcon className="icon" icon={faInstagram} />
                        </InputAdornment>)
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  {this.state.social_error && (
                    <span style={{ color: 'red', fontStyle: 'italic' }}>
                      Don't include @ or the full URL.
                      <br />
                      e.g. 'ampl3d' not '@ampl3d' or 'twitter.com/ampl3d'.
                      <br /><br />
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
  }

  pickCardIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return faCcVisa;
      case 'american express':
        return faCcAmex;
      case 'mastercard':
        return faCcMastercard;
      case 'discover':
        return faCcDiscover;
      default:
        return faCcStripe;
    }
  }

  renderPayments = () => {
    const { userData: { cardInfo } } = this.props;
    return (
      <div className="basic-info">
        <div className="row">
          <div className="col-md-2 user-details__side">
            <div className="user-details__title">Payments</div>
          </div>
          <div className="col-md-10">
            <div className="row no-gutters">
              <div className="col-2 col-md-3">
                <div className="user-details__subtitle">Card</div>
              </div>
              <div className="row col-10 col-md-9">
                <div className="col-md-12">
                  {cardInfo ? (
                    <>
                      {<FontAwesomeIcon className="icon" icon={this.pickCardIcon(cardInfo.brand)} />}
                      &nbsp;ending in {cardInfo.last4}
                      <br />
                      Expires {cardInfo.exp_month}/{cardInfo.exp_year}
                      <br />
                      (Edit card)
                    </>
                  ) : (
                    'No card on file'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderAddress = () => {

    return (
      <div className="address">
        <div className="row">
          <div className="col-md-2 user-details__side">
            <div className="user-details__title">Address</div>
            <h6>Optional</h6>
            <div className="user-details__info">This is only to allow the artists you support the ability to send you things.</div>
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
      <Button
        type="submit"
        className="finished-button"
      >
        Finished
      </Button>
    </DialogActions>
  );

  renderContent = () => (
    <MuiThemeProvider theme={theme}>
      <Modal open={this.state.showUserPhotoModal} onClose={this.closeUserPhotoModal}>
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
          <Loading
            artistLoading={this.props.loadingMe}
          />
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
});

const UserDetails = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserDetailsComponent);

export { UserDetails };
