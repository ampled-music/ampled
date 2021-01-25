import * as React from 'react';
import { ReactSVG } from 'react-svg';

import {
  TextField,
  FormControlLabel,
  Card,
  CardContent,
  Checkbox,
  IconButton,
} from '@material-ui/core';

import Close from '../../images/icons/Icon_Close-Cancel.svg';

interface MemberProps {
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  index: number;
  handleChange: Function;
  removeMember: Function;
  userData: any;
}

export class Member extends React.Component<MemberProps> {
  render() {
    const {
      isAdmin,
      firstName,
      lastName,
      role,
      email,
      index,
      handleChange,
      removeMember,
      userData,
    } = this.props;

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
                  aria-label="close"
                  color="primary"
                  onClick={() => removeMember(index)}
                >
                  <ReactSVG className="icon" src={Close} />
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
                  placeholder="Email"
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
                  placeholder={'e.g. "singer", "drums"'}
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
                        <ReactSVG className="icon" src={Twitter} />
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
                        <ReactSVG className="icon" src={Instagram} />
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
                  {isMe ? 'You' : 'Members'} can edit{' '}
                  {isMe ? 'your ' : 'their '}
                  name, photo, social handles, etc. in{' '}
                  {isMe ? 'your ' : 'their '}
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
  }
}
