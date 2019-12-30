import './create-artist.scss';

import * as React from 'react';
import { connect } from 'react-redux';

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
  Checkbox,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faInstagram,
  faStripe,
} from '@fortawesome/free-brands-svg-icons';
import { ChromePicker } from 'react-color';
import { isMobile } from 'react-device-detect';

import { theme } from './theme';
import tear from '../../images/full_page_tear.png';
import polaroid from '../../images/polaroid.png';

import { Store } from '../../redux/configure-store';

interface CreateArtistProps {
  me: any;
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

class CreateArtist extends React.Component<CreateArtistProps, any> {
  state = {
    artistColor: '#baddac',
    artistColorAlpha: '#baddac33',
    artistName: '',
    artistVerb: 'are',
    artistLocation: '',
    artistMessage: '',
    artistTwitter: '',
    artistInstagram: '',
    artistVideo: '',
    artistSlug: '',
    artistStripe: '',
    members: {
      me: {
        isAdmin: true,
        firstName: '',
        lastName: '',
        role: '',
        instagram: '',
        twitter: '',
        photo: '',
      },
    },
  };

  handleColorChange = (color) => {
    this.setState({ artistColor: color.hex });
    this.setState({ artistColorAlpha: color.hex + '33' });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  renderHeader = () => {
    return (
      <div className="create-artist__header">
        {isMobile && (
          <div style={{ margin: '0 20px' }}>
            We recommend completing this form on a non-mobile device.
          </div>
        )}
        <div className="container">
          <h1>Create Your Artist Page</h1>
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
          <div className="row">
            <div className="col-6">
              <div className="create-artist__title">About</div>
              <div className="create-artist__copy">
                Let us know a few things about who you are and how, how to
                address you, and how you want to present yourself.
              </div>
            </div>
          </div>
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
            <div className="col-4">
              <div className="create-artist__subtitle">Artist or Band name</div>
              <h6>Required</h6>
            </div>
            <div className="col-8">
              <TextField
                name="artistName"
                label="Name"
                id="name"
                value={this.state.artistName}
                onChange={this.handleChange}
                fullWidth
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">
                What Sounds more Accurate?
              </div>
              <h6>Required</h6>
            </div>
            <div className="col-8">
              <RadioGroup
                aria-label="artistVerb"
                name="artistVerb"
                value={this.state.artistVerb}
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
            <div className="col-4">
              <div className="create-artist__subtitle">Location</div>
            </div>
            <div className="col-8">
              <TextField
                name="artistLocation"
                label="Location"
                id="location"
                value={this.state.artistLocation}
                onChange={this.handleChange}
                fullWidth
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">Message</div>
            </div>
            <div className="col-8">
              <TextField
                name="artistMessage"
                label="Message from the artist"
                id="message"
                value={this.state.artistMessage}
                onChange={this.handleChange}
                multiline
                rows="5"
                fullWidth
                variant="outlined"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">Social</div>
            </div>
            <div className="col-8">
              <TextField
                name="artistTwitter"
                label="Twitter"
                id="twitter"
                placeholder="Twitter"
                value={this.state.artistTwitter}
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
                value={this.state.artistInstagram}
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
            <div className="col-4">
              <div className="create-artist__subtitle">
                Artist Video Message
              </div>
            </div>
            <div className="col-8">
              <TextField
                name="artistVideo"
                label="Video URL"
                id="video-message"
                value={this.state.artistVideo}
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
    return (
      <div className="container">
        <div className="image-upload">
          <div className="row">
            <div className="col-6">
              <div className="create-artist__subtitle">Artist Images</div>
              <div className="create-artist__copy">
                You can have several photos for your profile, but there can be
                only one profile photo, which will be used to identify you to
                your supporters in certain scenarios. Select your primary photo
                and then up to two secondary photos for your profile.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <div className="image-upload__image primary">
                <img
                  className="image-upload__image_polaroid"
                  src={polaroid}
                  alt="Primary"
                />
                <Button className="btn btn-upload" variant="outlined">
                  Upload Primary
                </Button>
              </div>
            </div>
            <div className="col-3">
              <div className="image-upload__image secondary">
                <img
                  className="image-upload__image_polaroid"
                  src={polaroid}
                  alt="Secondary"
                />
                <Button className="btn btn-upload" variant="outlined">
                  Upload Photo #2
                </Button>
              </div>
            </div>
            <div className="col-3">
              <div className="image-upload__image secondary">
                <img
                  className="image-upload__image_polaroid"
                  src={polaroid}
                  alt="Tertiary"
                />
                <Button className="btn btn-upload" variant="outlined">
                  Upload Photo #3
                </Button>
              </div>
            </div>
            <div className="col-3">
              <div className="create-artist__copy">
                Minimum resolution: 700 X 700 Maximum size: 5mb
              </div>
            </div>
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
              <div className="col-6">
                <div className="artist-color__info">
                  <div className="create-artist__subtitle">Artist Color</div>
                  <div className="create-artist__copy">
                    <p>
                      Select a color for your artist page. This color will be
                      used as accents on both your page and around the site.
                    </p>
                    <p>
                      The lighter version (20% opacity) of the color is how the
                      will appear in certain rare instances.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="artist-color__picker">
                  <ChromePicker
                    color={this.state.artistColor}
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
              <div className="col-6">
                <div className="artist-color__opacity">20% Opacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderMembers = () => {
    return (
      <div className="container">
        <div className="artist-members">
          <div className="row">
            <div className="col-md-6">
              <div className="create-artist__title">Members</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="create-artist__copy">
                This step is optional, but we encourage you to list the members
                of your project or band to further connect with your audience
                and give them insight into your own interests. The order in
                which they will appear can be alterered below.
              </div>
            </div>
            <div className="col-md-6">
              <div className="create-artist__copy">
                All members marked as admins will be notified of payouts,
                changes, and updates, unless specified otherwise.
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Card className="artist-members__card">
                <CardContent className="container">
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <div className="create-artist__title">Member</div>
                    </div>
                    <div className="col-auto">
                      <div className="artist-members__card_admin">
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="isAdmin"
                              value={this.state.members.me.isAdmin}
                              onChange={this.handleChange}
                            />
                          }
                          label="Make Admin"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <div className="create-artist__subtitle">Name</div>
                      <h6>Required</h6>
                    </div>
                    <div className="col-9">
                      <TextField
                        name="firstName"
                        label="First Name"
                        id="first-name"
                        value={this.state.members.me.firstName}
                        onChange={this.handleChange}
                        fullWidth
                        required
                      />
                      <TextField
                        name="lastName"
                        label="Last Name"
                        id="last-name"
                        value={this.state.members.me.lastName}
                        onChange={this.handleChange}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <div className="create-artist__subtitle">Role(s)</div>
                    </div>
                    <div className="col-9">
                      <TextField
                        name="role"
                        label="Role"
                        id="role"
                        value={this.state.members.me.role}
                        onChange={this.handleChange}
                        inputProps={{ maxLength: 50 }}
                        // helperText={`${this.state.members.me.role.length - 50} characters left`}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <div className="create-artist__subtitle">Photo</div>
                    </div>
                    <div className="col-9"></div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <div className="create-artist__subtitle">Social</div>
                    </div>
                    <div className="col-9">
                      <TextField
                        name="twitter"
                        id="twitter"
                        placeholder="Twitter"
                        value={this.state.members.me.twitter}
                        onChange={this.handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesomeIcon
                                className="icon"
                                icon={faTwitter}
                              />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="instagram"
                        id="instagram"
                        placeholder="Instagram"
                        value={this.state.members.me.instagram}
                        onChange={this.handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesomeIcon
                                className="icon"
                                icon={faInstagram}
                              />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="artist-members__card">
                <CardContent>
                  <div className="artist-members__card_add">
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

  renderPaymemt = () => {
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

  renderInvite = () => {
    return (
      <div className="container">
        <div className="artist-invite">
          <div className="row">
            <div className="col-6">
              <div className="create-artist__title">Invite</div>
              <div className="create-artist__copy">
                Let’s get your fans involved. Share the custom link below with
                your fans through your email list or social accounts. They’ll
                then be prompted to sign up and start directly supporting you!
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">Your Custom Link</div>
              <h6>Required</h6>
            </div>
            <div className="col-8">
              <TextField
                name="artistSlug"
                id="artistSlug"
                value={this.state.artistSlug}
                onChange={this.handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ampled.com/artist/
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderContent = () => (
    <MuiThemeProvider theme={theme}>
      {this.renderHeader()}
      {/* {this.renderNav()} */}
      {this.renderAbout()}
      {this.renderInfo()}
      {this.renderImages()}
      {this.renderColor()}
      {this.renderMembers()}
      {this.renderPaymemt()}
      {this.renderInvite()}
    </MuiThemeProvider>
  );

  render() {
    return <div className="create-artist">{this.renderContent()}</div>;
  }
}

const mapStateToProps = (state: Store) => {
  return {
    me: state.me,
  };
};

const connectArtist = connect(mapStateToProps)(CreateArtist);

export { connectArtist as CreateArtist };
