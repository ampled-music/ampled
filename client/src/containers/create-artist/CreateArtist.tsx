import './create-artist.scss';

import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';
import { TextField, Radio, RadioGroup, FormControlLabel, InputAdornment, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

import { theme } from './theme';
import tear from '../../images/full_page_tear.png';
import polaroid from '../../images/polaroid.png';

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

class CreateArtist extends React.Component<TabPanelProps, any> {
  state = {};

  renderHeader = () => {
    return (
      <div className="create-artist__header">
        <div className="container">
          <h1>Create Your Artist Page</h1>
        </div>
        <img className="create-artist__header_tear" src={tear} />
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
        <div className="basic-info">
          <div className="row">
            <div className="col-6">
              <div className="create-artist__title">About</div>
              <div className="create-artist__copy">
                Let us know a few things about who you are and how, how to address you, and how you want to present
                yourself.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">Artist or Band name</div>
              <h6>Required</h6>
            </div>
            <div className="col-8">
              <TextField
                name="name"
                label="Name"
                id="name"
                // value={this.state.name}
                // onChange={this.handleChange}
                fullWidth
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">What Sounds more Accurate?</div>
              <h6>Required</h6>
            </div>
            <div className="col-8">
              <RadioGroup
                aria-label="verb"
                name="artist_verb"
                // value={value}
                // onChange={handleChange}
              >
                <FormControlLabel value="are" control={<Radio />} label="Band are recording a new record." />
                <FormControlLabel value="is" control={<Radio />} label="Band is recording a new record." />
              </RadioGroup>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">Location</div>
            </div>
            <div className="col-8">
              <TextField
                name="location"
                label="Location"
                id="location"
                // value={this.state.location}
                // onChange={this.handleChange}
                fullWidth
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="create-artist__subtitle">Social</div>
            </div>
            <div className="col-8">
              <TextField
                name="twitter"
                label="Twitter"
                id="twitter"
                placeholder="Twitter"
                // value={this.state.twitter}
                // onChange={this.handleChange}
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
                name="instagram"
                label="Instagram"
                id="instagram"
                placeholder="Instagram"
                // value={this.state.instagram}
                // onChange={this.handleChange}
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
              <div className="create-artist__subtitle">Artist Video Message</div>
            </div>
            <div className="col-8">
              <TextField
                name="video-message"
                label="video URL"
                id="video-message"
                // value={this.state.location}
                // onChange={this.handleChange}
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
                You can have several photos for your profile, but there can be only one profile photo, which will be
                used to identify you to your supporters in certain scenarios. Select your primary photo and then up to
                two secondary photos for your profile.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <div className="image-upload__image">
                <img className="image-upload__image_polaroid" src={polaroid} />
                <Button className="btn btn-ampled">Upload Primary</Button>
              </div>
            </div>
            <div className="col-3">
              <div className="image-upload__image">
                <img className="image-upload__image_polaroid" src={polaroid} />
                <Button className="btn btn-ampled">Upload Photo #2</Button>
              </div>
            </div>
            <div className="col-3">
              <div className="image-upload__image">
                <img className="image-upload__image_polaroid" src={polaroid} />
                <Button className="btn btn-ampled">Upload Photo #3</Button>
              </div>
            </div>
            <div className="col-3">Minimum resolution: 700 X 700 Maximum size: 5mb</div>
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
      {this.renderImages()}
    </MuiThemeProvider>
  );

  render() {
    return <div className="create-artist">{this.renderContent()}</div>;
  }
}

export { CreateArtist };
