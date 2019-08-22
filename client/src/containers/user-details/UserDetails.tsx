import './user-details.scss';

import * as React from 'react';

import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


class UserDetails extends React.Component<any, any> {
  state = {
  };
  

  renderBasicInfo = () => (
    <div>
        <div>
            <h3>Basic Info</h3>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-2">
                    <h4>Name</h4>
                    <h6>Required</h6>
                </div>
                <div className="col-md-5">
                    <Input
                        placeholder="First name"
                        fullWidth
                    />
                </div>
                <div className="col-md-5">
                    <Input
                        placeholder="Last name (Optional)"
                        fullWidth
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-2">
                    <h4>Location</h4>
                    <h6>Required</h6>
                </div>
                <div className="col-md-5">
                    <Input
                        placeholder="City"
                        fullWidth
                    />
                </div>
                <div className="col-md-5">
                    <Input
                        placeholder="Country"
                        fullWidth
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-2">
                    <h5>Photo</h5>
                </div>
                <div className="col-1">
                    <h5>Social</h5>
                </div>
                <div className="col-9">
                    <Input
                        placeholder="twitter"
                        fullWidth
                    />
                    <Input
                        placeholder="instagram"
                        fullWidth
                    />
                    <Input
                        multiline
                        fullWidth
                    />
                </div>
            </div>
        </div>
    </div>
  );

  renderAddress = () => (
    <div>
      <div>
            <h3>Address</h3>
            <h6>Optional</h6>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-2">
                    <h4>Country</h4>
                </div>
                <div className="col-md-10">
                    <Input
                        defaultValue="United States"
                        fullWidth
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-2">
                    <h4>Street</h4>
                </div>
                <div className="col-md-10">
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
            <div className="row">
                <div className="col-2">
                    <h5>City State Zip</h5>
                </div>
                <div className="col-4">
                    <Input
                        placeholder="Anytown"
                        fullWidth
                    />
                </div>
                <div className="col-4">
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
                <div className="col-2">
                    <Input
                        placeholder="Zip code"
                        fullWidth
                    />
                </div>
            </div>
        </div>
    </div>
  );



  render() {
    return (
      <div className="container user-details">
          {this.renderBasicInfo()}
          {this.renderAddress()}
      </div>
    );
  }
}

export { UserDetails };
