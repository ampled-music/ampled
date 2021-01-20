import * as React from 'react';
import { ReactSVG } from 'react-svg';

import {
  TextField,
  Input,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from '@material-ui/core';
import Instagram from '../../images/icons/Icon_Instagram.svg';
import Twitter from '../../images/icons/Icon_Twitter.svg';
import Bandcamp from '../../images/icons/Icon_Bandcamp.svg';
import Youtube from '../../images/icons/Icon_Youtube.svg';
import Link1 from '../../images/icons/Icon_Link_1.svg';

interface InfoProps {
  state: any;
  handleChange: Function;
  editMode?: boolean;
}

export class Info extends React.Component<InfoProps> {
  render() {
    const { state, editMode } = this.props;
    const displayName = state.artistName || 'Band';
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
                value={state.artistName || ''}
                onChange={() => this.props.handleChange}
                fullWidth
                disabled={!!editMode}
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
                value={state.artistSlug || ''}
                onChange={() => this.props.handleChange}
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
                value={state.artistVerb || ''}
                onChange={() => this.props.handleChange}
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
                value={state.artistLocation || ''}
                onChange={() => this.props.handleChange}
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
                value={state.artistMessage || ''}
                onChange={() => this.props.handleChange}
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
                  value={state.artistTwitter || ''}
                  onChange={() => this.props.handleChange}
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
                  value={state.artistInstagram || ''}
                  onChange={() => this.props.handleChange}
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
                  value={state.artistBandcamp || ''}
                  onChange={() => this.props.handleChange}
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
                  value={state.artistYoutube || ''}
                  onChange={() => this.props.handleChange}
                  fullWidth
                />
              </div>
              <div className="url-input">
                <ReactSVG className="icon icon_black icon_sm" src={Link1} />
                <TextField
                  name="artistExternal"
                  id="external"
                  placeholder="https://yoursite.com"
                  value={state.artistExternal || ''}
                  onChange={() => this.props.handleChange}
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
                value={state.artistVideo || ''}
                onChange={() => this.props.handleChange}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
