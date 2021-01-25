import * as React from 'react';
import { ReactSVG } from 'react-svg';

import {
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Checkbox,
} from '@material-ui/core';

import AddPlus from '../../images/icons/Icon_Add-Plus.svg';

import { Member } from './Member';

interface MembersProps {
  bandName: string;
  members: any;
  addMember: Function;
  removeMember: Function;
  handleChange: Function;
  userData: Object;
  hideMembers: boolean;
  setHideMembers: Function;
}

export class Members extends React.Component<MembersProps> {
  render() {
    const {
      bandName,
      members,
      addMember,
      removeMember,
      handleChange,
      userData,
      hideMembers,
      setHideMembers,
    } = this.props;

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
                here. Admins have the ability to add / remove members and access
                / edit payout info. After you finish filling out this form,
                we’ll send them an email invite to join the page.
              </div>
            </div>
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
            <div className="col-md-6 col-sm-12">
              <Card className="artist-members__card">
                <CardContent>
                  <Button
                    variant="outlined"
                    size="large"
                    className="artist-members__card_add"
                    onClick={() => addMember()}
                    startIcon={
                      <ReactSVG className="icon icon_black" src={AddPlus} />
                    }
                  >
                    Add a Member
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <FormControlLabel
                control={
                  <Checkbox
                    name="hideMembers"
                    checked={hideMembers}
                    onChange={(e) => {
                      setHideMembers(e.target.checked);
                    }}
                  />
                }
                label="Hide member avatars &amp; names on page &amp; posts"
              />
              <br />
              <span
                className="create-artist__copy"
                style={{ fontSize: '0.8rem' }}
              >
                Your name and avatar will still appear when posting or replying
                to comments.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
