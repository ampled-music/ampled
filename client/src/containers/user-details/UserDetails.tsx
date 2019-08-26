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
import { Button, DialogActions, Select, MenuItem, Input, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
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
  }

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

  showUserPhotoModal = () => this.setState({ showUserPhotoModal: true });
  closeUserPhotoModal = () => this.setState({ showUserPhotoModal: false });

  renderBasicInfo = () => (
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
                <Input
                  placeholder="First name"
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Input
                  placeholder="Last name (Optional)"
                  fullWidth
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
                <Input
                  placeholder="City"
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Input
                  placeholder="Country"
                  fullWidth
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
                <Input
                  placeholder="Twitter"
                  fullWidth
                  startAdornment={
                    <InputAdornment position="start">
                      <FontAwesomeIcon className="icon" icon={faTwitter} />
                    </InputAdornment>
                  }
                />
                <Input
                  placeholder="Instagram"
                  fullWidth
                  startAdornment={
                    <InputAdornment position="start">
                      <FontAwesomeIcon className="icon" icon={faInstagram} />
                    </InputAdornment>
                  }
                />
                <TextField
                  multiline
                  rows="5"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  renderAddress = () => (
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
                <Input
                  defaultValue="United States"
                  fullWidth
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
                <Input
                  placeholder="123 Fake St"
                  fullWidth
                />
                <Input
                  placeholder="Apt #123"
                  fullWidth
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
                <Input
                  placeholder="Anytown"
                  fullWidth
                />
              </div>
              <div className="col-md-4">
                <Select
                  fullWidth
                >
                  <MenuItem value="State"><em>State</em></MenuItem>
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
                </Select>
              </div>
              <div className="col-md-3">
                <Input
                  placeholder="Zip code"
                  fullWidth
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  renderButtons = () => (
    <DialogActions className="action-buttons">
      <Button className="cancel-button">
        Back
      </Button>
      <Button
        type="submit"
        className="finished-button"
        disabled
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
      {this.renderBasicInfo()}
      {this.renderAddress()}
      {this.renderButtons()}
    </MuiThemeProvider>
  );

  render() {
    const { userData } = this.props;
    return (
      <div className="container user-details">
        {console.log(userData)}
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
