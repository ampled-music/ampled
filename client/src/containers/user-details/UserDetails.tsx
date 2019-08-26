import './user-details.scss';

import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Button, DialogActions, Select, MenuItem, Input, TextField, InputAdornment } from '@material-ui/core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { theme } from './theme';

class UserDetails extends React.Component<any, any> {
  state = {
  };
  

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
                    </div>
                    <div className="row col-md-9">
                        <div className="col-2">
                            <div className="user-details__subtitle">Social</div>
                        </div>
                        <div className="col-10">
                            <Input
                                placeholder="twitter"
                                fullWidth
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon className="icon" icon={faTwitter} />
                                    </InputAdornment>
                                }
                            />
                            <Input
                                placeholder="instagram"
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



  render() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="container user-details">
                {this.renderBasicInfo()}
                {this.renderAddress()}
                {this.renderButtons()}
            </div>
        </MuiThemeProvider>
    );
  }
}

export { UserDetails };
