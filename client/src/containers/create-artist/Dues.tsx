import { Card, CardContent } from '@material-ui/core';
import React, { FC } from 'react';

type DuesProps = {
  setPercent: (e: Number) => void;
  percent: Number;
};

export const Dues: FC<DuesProps> = ({ setPercent, percent }) => (
  <div className="container">
    <div className="artist-pwf">
      <div className="row">
        <div className="col-md-6">
          <div className="create-artist__title">Membership Dues</div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="create-artist__copy">
            Membership dues is the percent of each support transaction that is
            paid as dues to the coop for paying contributors, growth, and
            generally keeping the lights on. We are committed to making our
            membership dues fair for the artist and for the coop itself. Select
            the options that seems fair for your Ampled page. This can be
            changed at any time. Read more about our Hardship policy.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 col-sm-12" style={{ marginBottom: '8px' }}>
          <Card
            className={`artist-pwf__card dues-card${
              percent === 7 ? '-selected' : ''
            }`}
          >
            <CardContent>
              <div
                className="artist-pwf__card_add"
                onClick={() => setPercent(7)}
              >
                <div className="dues-amount">
                  7<span className="dues-pct">%</span>
                </div>
                <div className="dues-copy">
                  No problem, pay what you can; but if everyone chooses this
                  amount it will be difficult to sustain ourselves.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-md-3 col-sm-12" style={{ marginBottom: '8px' }}>
          <Card
            className={`artist-pwf__card dues-card${
              percent === 10 ? '-selected' : ''
            }`}
          >
            <CardContent>
              <div
                className="artist-pwf__card_add"
                onClick={() => setPercent(10)}
              >
                <div className="dues-amount">
                  10<span className="dues-pct">%</span>
                </div>
                <div className="dues-copy">
                  Thanks! This amount helps us continue to sustain ourselves and
                  grow at an organic pace.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-md-3 col-sm-12" style={{ marginBottom: '8px' }}>
          <Card
            className={`artist-pwf__card dues-card${
              percent === 13 ? ' dues-card-selected' : ''
            }`}
          >
            <CardContent>
              <div
                className="artist-pwf__card_add"
                onClick={() => setPercent(13)}
              >
                <div className="dues-amount">
                  13<span className="dues-pct">%</span>
                </div>
                <div className="dues-copy">
                  Thank you! This amount helps the team more quickly build
                  features that help all artists supporters on Ampled.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export default Dues;
