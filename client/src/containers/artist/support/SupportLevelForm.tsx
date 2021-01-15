import './stripe-payment-provider.scss';

import * as React from 'react';

import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';

interface Props {
  artistName: string;
  supportLevelValue: any;
  isAmpled?: boolean;
  supportClick: Function;
  supportChange: (e: any) => void;
}

export class SupportLevelForm extends React.Component<Props, any> {
  calculateSupportTotal = (supportLevel) =>
    (Math.round((supportLevel * 100 + 30) / 0.971) / 100).toFixed(2);

  render() {
    return (
      <>
        <div className="row justify-content-center" key={this.props.artistName}>
          <div className="col-md-5">
            <Card>
              <CardContent>
                <Typography variant="h5" component="h5">
                  Support What You Want
                </Typography>
                <TextField
                  aria-label="Support level"
                  type="number"
                  onChange={this.props.supportChange}
                  value={this.props.supportLevelValue || ''}
                  placeholder="3 min"
                />
                {this.props.supportLevelValue &&
                this.props.supportLevelValue >= 3 ? (
                  <Typography
                    component="p"
                    className="support__value-description"
                  >
                    Your total charge will be{' '}
                    <strong>
                      $
                      {this.calculateSupportTotal(this.props.supportLevelValue)}
                    </strong>
                    .
                    <br />
                    <br />
                    This is due to our payment processor's service fee. More
                    details can be found{' '}
                    <a
                      href="https://docs.ampled.com/finances/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    .
                  </Typography>
                ) : (
                  <Typography
                    component="p"
                    className="support__value-description"
                  >
                    {this.props.isAmpled
                      ? 'Join the co-op as a Community Member to help Ampled stay independent and accountable to members.'
                      : `Support ${this.props.artistName} directly for $3 (or more) per month to unlock
                  access to all of their posts and get notifications when they post
                  anything new.`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-5">
            <Button
              disabled={
                !this.props.supportLevelValue ||
                this.props.supportLevelValue < 3
              }
              onClick={() => this.props.supportClick()}
              variant="contained"
              color="primary"
            >
              {true
                ? this.props.isAmpled
                  ? 'Become a member'
                  : `Support ${this.props.artistName}`
                : 'Signup or login to support'}
            </Button>
          </div>
        </div>
      </>
    );
  }
}
