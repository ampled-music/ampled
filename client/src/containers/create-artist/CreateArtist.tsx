import './create-artist.scss';
import './../artist/posts/post/post.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Checkbox,
  IconButton,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faInstagram,
  faStripe,
} from '@fortawesome/free-brands-svg-icons';
import { ChromePicker } from 'react-color';

import { theme } from './theme';
import tear from '../../images/full_page_tear.png';
import polaroid from '../../images/polaroid.png';

import { Store } from '../../redux/configure-store';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

import { showToastMessage, MessageType } from '../shared/toast/toast';
import { deleteFileFromCloudinary } from '../../api/cloudinary/delete-image';
import { uploadFileToCloudinary } from '../../api/cloudinary/upload-image';
import { Modal } from '../shared/modal/Modal';

interface CreateArtistProps {
  me: any;
  editMode?: boolean;
  artist?: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

interface ImageUploaderProps {
  altText: string;
  imageURL?: string;
  setURL: Function;
}

class ImageUploader extends React.Component<ImageUploaderProps> {
  state = {
    loadingImage: false,
    deleteToken: undefined,
  };

  renderPhoto = (image: string, crop: number) => {
    const crop_url_path = `w_${crop},h_${crop},c_fill`;
    if (image.includes('https://res.cloudinary')) {
      return image.replace('upload/', `upload/${crop_url_path}/`);
    } else {
      return `https://res.cloudinary.com/ampled-web/image/fetch/${crop_url_path}/${image}`;
    }
  };

  processImage = async (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    }

    this.setState({ loadingImage: true });

    if (this.state.deleteToken) {
      this.removeImage();
    }

    const fileInfo = await uploadFileToCloudinary(imageFile);
    // const fileName = imageFile.name;

    this.setState({
      deleteToken: fileInfo.delete_token,
      loadingImage: false,
    });
    this.props.setURL(fileInfo.secure_url);
  };

  removeImage = async () => {
    deleteFileFromCloudinary(this.state.deleteToken);
    this.setState({ imageUrl: null, deleteToken: undefined });
    this.props.setURL(null);
  };

  render() {
    const { altText, imageURL } = this.props;
    const { loadingImage } = this.state;

    let body: {};
    if (imageURL) {
      body = (
        <>
          <img
            className="image-upload__image_polaroid"
            src={this.renderPhoto(imageURL, 200)}
            alt={altText}
          />
          {/* <span className="preview__name">{altText}</span> */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>
              <Button
                className="btn btn-upload"
                variant="outlined"
                component="span"
                onClick={this.removeImage}
              >
                Remove
              </Button>
            </label>
            <label htmlFor={`image-file-${altText}`}>
              <Button
                className="btn btn-upload"
                variant="outlined"
                component="span"
              >
                Replace
              </Button>
            </label>
          </div>
        </>
      );
    } else if (loadingImage) {
      body = <CircularProgress className="loading-circle" />;
    } else {
      body = (
        <>
          <img
            className="image-upload__image_polaroid"
            src={polaroid}
            alt={altText}
          />
          <label
            htmlFor={`image-file-${altText}`}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              className="btn btn-upload"
              variant="outlined"
              component="span"
            >
              Upload {altText}
            </Button>
          </label>
        </>
      );
    }

    return (
      <div
        className={`image-upload__image ${
          altText === 'Primary' ? 'primary' : 'secondary'
        }`}
      >
        <input
          style={{ display: 'none' }}
          id={`image-file-${altText}`}
          type="file"
          aria-label="Image file"
          accept="image/*"
          onChange={this.processImage}
        />
        {body}
      </div>
    );
  }
}

const Members = ({
  bandName,
  members,
  addMember,
  removeMember,
  handleChange,
  userData,
}) => {
  return (
    <div className="container">
      <div className="artist-members">
        <div className="row">
          <div className="col-md-6">
            <div className="create-artist__title">Add Members</div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="create-artist__copy">
              Who else is a member of{' '}
              {bandName && bandName.length ? bandName : 'your band'}? Add them
              here. Admins have the ability to add / remove members and access /
              edit payout info. After you finish filling out this form, we’ll
              send them an email invite to join the page.
              {/* This step is optional, but we encourage you to list the members of
              your project or band to further connect with your audience and
              give them insight into your own interests. The order in which they
              will appear can be altered below. */}
            </div>
          </div>
          {/* <div className="col-md-6">
            <div className="create-artist__copy">
              All members marked as admins will be notified of payouts, changes,
              and updates, unless specified otherwise.
            </div>
          </div> */}
        </div>

        <div className="row">
          {members.map((v, i) => (
            <Member
              key={i}
              handleChange={handleChange}
              removeMember={removeMember}
              index={i}
              userData={userData}
              {...v}
            />
          ))}
          <div className="col-md-6 col-sm-12" style={{ marginBottom: '8px' }}>
            <Card className="artist-members__card">
              <CardContent>
                <div className="artist-members__card_add" onClick={addMember}>
                  <FontAwesomeIcon
                    className="icon"
                    icon={faPlusCircle}
                    size="3x"
                  />
                  <span>Add a Member</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

Members.propTypes = {
  bandName: PropTypes.string,
  members: PropTypes.array,
  addMember: PropTypes.func,
  removeMember: PropTypes.func,
  handleChange: PropTypes.func,
  userData: PropTypes.object,
};

const Member = ({
  isAdmin,
  firstName,
  lastName,
  role,
  email,
  // instagram,
  // twitter,
  // photo,
  index,
  handleChange,
  removeMember,
  userData,
}) => {
  const isMe = email === userData.email;
  return (
    <div className="col-md-6 col-sm-12" style={{ marginBottom: '8px' }}>
      <Card className="artist-members__card">
        <CardContent className="container">
          <div
            style={{
              position: 'absolute',
              right: '16px',
              top: '0px',
              cursor: 'pointer',
            }}
          >
            {!isMe && (
              <IconButton
                // className="close-x"
                aria-label="close"
                color="primary"
                // style={{}}
                onClick={() => removeMember(index)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            )}
          </div>
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <div className="create-artist__title">
                {isMe ? 'You' : 'Member'}
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="artist-members__card_admin">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAdmin"
                      checked={isAdmin}
                      disabled={isMe}
                      onChange={(e) => handleChange(e, index)}
                    />
                  }
                  label="Make Admin"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-artist__subtitle">Name</div>
              <h6>Required</h6>
            </div>
            <div className="col-md-9 col-sm-12">
              <TextField
                name="firstName"
                label="First Name"
                id="first-name"
                value={firstName || ''}
                onChange={(e) => handleChange(e, index)}
                fullWidth
                disabled={isMe}
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                id="last-name"
                value={lastName || ''}
                onChange={(e) => handleChange(e, index)}
                disabled={isMe}
                fullWidth
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-artist__subtitle">Email</div>
              <h6>Required</h6>
            </div>
            <div className="col-md-9 col-sm-12">
              <TextField
                name="email"
                label="Email"
                id="email"
                value={email || ''}
                onChange={(e) => handleChange(e, index)}
                inputProps={{ maxLength: 50 }}
                disabled={isMe}
                // helperText={`${role.length - 50} characters left`}
                fullWidth
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-12">
              <div className="create-artist__subtitle">Role</div>
            </div>
            <div className="col-md-9 col-sm-12">
              <TextField
                name="role"
                label={'e.g. "singer", "drums"'}
                id="role"
                value={role || ''}
                onChange={(e) => handleChange(e, index)}
                inputProps={{ maxLength: 50 }}
                // disabled={isMe}
                // helperText={`${role.length - 50} characters left`}
                fullWidth
              />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-3">
              <div className="create-artist__subtitle">Photo</div>
            </div>
            <div className="col-9"></div>
          </div> */}
          {/* <div className="row">
            <div className="col-3">
              <div className="create-artist__subtitle">Social</div>
            </div>
            <div className="col-9">
              <TextField
                name="twitter"
                id="twitter"
                placeholder="Twitter"
                value={twitter || ''}
                onChange={handleChange}
                fullWidth
                disabled={isMe}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon className="icon" icon={faTwitter} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="instagram"
                id="instagram"
                placeholder="Instagram"
                value={instagram || ''}
                onChange={handleChange}
                fullWidth
                disabled={isMe}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon className="icon" icon={faInstagram} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div> */}
          <div className="row">
            <div className="col-12 create-artist__copy">
              <h6>
                {isMe ? 'You' : 'Members'} can edit {isMe ? 'your ' : 'their '}
                name, photo, social handles, etc. in {isMe ? 'your ' : 'their '}
                <a href="/user-details" target="_blank">
                  user details
                </a>
                {isMe ? '' : ' after they register'}.
              </h6>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

Member.propTypes = {
  isAdmin: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  role: PropTypes.string,
  email: PropTypes.string,
  index: PropTypes.number,
  handleChange: PropTypes.func,
  removeMember: PropTypes.func,
  userData: PropTypes.shape({
    email: PropTypes.string,
  }),
};

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
    artistVerb: 'are',
    artistLocation: '',
    artistMessage: '',
    artistTwitter: '',
    artistInstagram: '',
    artistVideo: '',
    artistSlug: '',
    artistStripe: '',
    members: [],
    images: [],
    loading: true,
    showConfirmRemoveMember: false,
    confirmRemoveMemberIndex: 99,
  };

  constructor(props) {
    super(props);
    const randomColor = this.randomColor();
    this.state = {
      ...this.state,
      randomColor,
      artistColor: randomColor,
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
      console.log(artist);
      const {
        accent_color,
        name,
        verb_plural,
        location,
        bio,
        twitter_handle,
        instagram_handle,
        video_url,
        slug,
        owners,
        images,
      } = artist;
      this.setState({
        randomColor: accent_color,
        artistColor: accent_color,
        artistColorAlpha: accent_color + '33',
        artistName: name,
        artistVerb: verb_plural ? 'are' : 'is',
        artistLocation: location,
        artistMessage: bio,
        artistTwitter: twitter_handle,
        artistInstagram: instagram_handle,
        artistVideo: video_url,
        artistSlug: slug,
        artistStripe: '',
        members: (owners || []).map((owner) => ({
          firstName: owner.name || '',
          instrument: owner.instrument || '',
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
        video_url,
        slug,
        owners,
        images,
      } = artist;
      this.setState({
        artistColor: accent_color,
        artistName: name,
        artistVerb: verb_plural ? 'are' : 'is',
        artistLocation: location,
        artistMessage: bio,
        artistTwitter: twitter_handle,
        artistInstagram: instagram_handle,
        artistVideo: video_url,
        artistSlug: slug,
        artistStripe: '',
        members: (owners || []).map((owner) => ({
          firstName: owner.name || '',
          instrument: owner.instrument || '',
          email: owner.email || '',
          lastName: owner.lastName || '',
          isAdmin: owner.role === 'admin',
        })),
        images: images || [],
      });
    } else if (!editMode && userData) {
      this.setState({
        loading: false,
      });
    }
  };

  handleColorChange = (color) => {
    this.setState({
      randomColor: color.hex,
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

  renderNav = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
      setValue(index);
    };

    return (
      <div className="create-artist__header">
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            Item One
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            Item Three
          </TabPanel>
        </SwipeableViews>
      </div>
    );
  };

  renderAbout = () => {
    return (
      <div className="container">
        <div className="artist-about">
          {!this.props.editMode && (
            <div className="create-artist__copy">
              <b>
                You can&#39;t change your artist/band name or your custom link
                later
              </b>
              , so make sure they&#39;re right.
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
              <div className="create-artist__subtitle">Artist or Band name</div>
              <h6>Required</h6>
            </div>
            <div className="col-md-8 col-sm-12">
              <TextField
                name="artistName"
                label="Name"
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
              <h6>Letters and dashes only</h6>
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
                What Sounds more Accurate?
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
                label="Location"
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
                This message is featured on your artist page. You can edit this
                later.
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
                Just your username, with no &quot;@&quot;.
                <br />
                Not a URL.
              </h6>
            </div>
            <div className="col-md-8 col-sm-12">
              <TextField
                name="artistTwitter"
                label="Twitter"
                id="twitter"
                placeholder="Twitter"
                value={this.state.artistTwitter || ''}
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon className="icon" icon={faTwitter} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="artistInstagram"
                label="Instagram"
                id="instagram"
                placeholder="Instagram"
                value={this.state.artistInstagram || ''}
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon className="icon" icon={faInstagram} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="create-artist__subtitle">Video Message</div>
              <h6>
                This video is featured on your artist page. You can add this
                later.
              </h6>
            </div>
            <div className="col-md-8 col-sm-12">
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
    const imageSetter = (index) => (url) => {
      const { images } = this.state;
      images[index] = url;
      this.setState({ images });
    };

    const imageTypes = ['Primary', 'Photo #2', 'Photo #3'];

    return (
      <div className="container">
        <div className="image-upload">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="create-artist__subtitle">Featured Images</div>
              <h6>Minimum resolution: 700 X 700 Maximum size: 5mb</h6>
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
                <ImageUploader
                  altText={type}
                  setURL={imageSetter(index)}
                  imageURL={images[index]}
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
          style={{ backgroundColor: this.state.randomColor }}
        >
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-6 col-sm-12">
                <div className="artist-color__info">
                  <div className="create-artist__subtitle">Accent Color</div>
                  <div className="create-artist__copy">
                    <p>
                      Select a color for your artist page.
                      {/* This color will be
                      used as accents on both your page and around the site. */}
                    </p>
                    {/* <p>
                      The lighter version (20% opacity) of the color is how it
                      will appear in certain rare instances.
                    </p> */}
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
        {/* <div
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
        </div> */}
      </div>
    );
  };

  addMember = () => {
    this.setState({
      members: [
        ...this.state.members,
        {
          isAdmin: false,
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
                    className="btn continue-button"
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

  onSubmit = async () => {
    const {
      artistName,
      artistColor,
      artistInstagram,
      artistTwitter,
      artistLocation,
      artistMessage,
      artistSlug,
      artistVerb,
      artistVideo,
      images,
      members,
    } = this.state;

    // validate fields
    if (
      !artistName ||
      !artistSlug ||
      !artistColor ||
      !/^[a-z-]+$/.test(artistSlug)
    ) {
      return showToastMessage(
        'Please check required fields.',
        MessageType.ERROR,
      );
    }

    if (/[@:/]/gi.test(artistTwitter) || /[@:/]/gi.test(artistInstagram)) {
      return showToastMessage(
        'Please check the format of your social handles.',
        MessageType.ERROR,
      );
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
      return showToastMessage(
        'Please check required fields for members.',
        MessageType.ERROR,
      );
    }

    // create page
    this.setState({
      loading: true,
    });
    if (!this.props.editMode) {
      const { data } = await apiAxios({
        method: 'post',
        url: '/artist_pages',
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
            verb_plural: artistVerb !== 'is',
          },
          images,
          members,
        },
      });

      this.setState({
        loading: false,
      });

      if (data.status && data.status === 'error') {
        showToastMessage(data.message, MessageType.ERROR);
      } else if (data.status && data.status === 'ok') {
        showToastMessage(data.message, MessageType.SUCCESS);
        window.location.href = `/artist/${artistSlug}`;
      }
    } else {
      const { data } = await apiAxios({
        method: 'put',
        url: `/artist_pages/${this.props.artist?.id}`,
        data: {
          artist_page: {
            bio: artistMessage,
            location: artistLocation,
            accent_color: artistColor,
            video_url: artistVideo,
            instagram_handle: artistInstagram,
            twitter_handle: artistTwitter,
            verb_plural: artistVerb !== 'is',
          },
          images,
          members,
        },
      });

      this.setState({
        loading: false,
      });

      if (data.status && data.status === 'error') {
        showToastMessage(data.message, MessageType.ERROR);
      } else if (data.status && data.status === 'ok') {
        showToastMessage(data.message, MessageType.SUCCESS);
        window.location.href = `/artist/${artistSlug}`;
      }
    }
  };

  render() {
    const {
      me: { userData },
    } = this.props;

    if (this.state.loading) {
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
    return (
      <div className="create-artist">
        <Modal
          open={this.state.showConfirmRemoveMember}
          onClose={() => {
            this.setState({ showConfirmRemoveMember: false });
          }}
        >
          <div className="delete-post-modal__container">
            <img className="tear tear__topper" src={tear} alt="" />
            <div className="delete-post-modal">
              <div className="delete-post-modal__title">
                <h4>Are you sure?</h4>
              </div>
              <div className="delete-post-modal__actions action-buttons">
                <button
                  className="cancel-button"
                  onClick={() => {
                    this.setState({ showConfirmRemoveMember: false });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    this.removeMember(this.state.confirmRemoveMemberIndex);
                  }}
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
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
          />
          {/* {this.renderPayment()} */}
          <div className="container">
            {!this.props.editMode && (
              <div className="row">
                <div className="col-md-3 col-sm-1"></div>
                <div className="col-md-6 col-sm-10 create-artist__copy">
                  Your page will initially only be visible to you and any other
                  members you&#39;ve added. The Ampled team does a quick spot
                  check of all pages before they become visible to the general
                  public, but this normally doesn&#39;t take us very long.
                </div>
                <div className="col-md-3 col-sm-1"></div>
              </div>
            )}
            <div className="row">
              <div className="col-md-3 col-sm-1"></div>
              <div className="col-md-6 col-sm-10">
                <button onClick={this.onSubmit} className="btn btn-ampled">
                  {this.props.editMode ? 'Save' : 'Create'} your page
                </button>
              </div>
              <div className="col-md-3 col-sm-1"></div>
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

const connectArtist = connect(mapStateToProps)(CreateArtist);

export { connectArtist as CreateArtist };
