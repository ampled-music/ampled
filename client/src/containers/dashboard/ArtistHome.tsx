import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline } from '@material-ui/icons';
import Moment from 'react-moment';
import { ReactSVG } from 'react-svg';
import ArtistHandbook from '../../images/icons/Icon_Artist-Handbook.png';
import { faStripe, faTrello } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

interface ArtistHomeProps {
  userData: any;
  selectedArtist: any;
}

export const ArtistHome = ({ userData, selectedArtist }: ArtistHomeProps) => {
  const { subscriptions: supporters, artistSlug } = selectedArtist;
  console.log('selectedArtist', selectedArtist);
  console.log('userData', userData);
  console.log(!selectedArtist.length);

  const theme = createMuiTheme({
    palette: {
      primary: { main: '#1E1E1E' },
    },
    overrides: {
      MuiCard: {
        root: {
          margin: '1rem',
          padding: '1rem',
          boxShadow: 'none',
          border: '1px solid #969696',
          maxWidth: '600px',
          alignSelf: 'flex-start',
        },
      },
      MuiCardContent: {
        root: {
          padding: '0px',
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="dashboard__home">
        <Card>
          <CardContent>
            <div className="dashboard__home_card_title">Overview</div>
            <div className="dashboard__home_card_flex-row">
              <div className="dashboard__home_card_numbers">
                <div className="dashboard__home_card_total">
                  {selectedArtist.supportersCount || 0}
                </div>
                <div className="dashboard__home_card_description">
                  Supporters
                </div>
              </div>
              {selectedArtist.supportersCount > 0 && (
                <div className="dashboard__home_card_numbers">
                  <div className="dashboard__home_card_total">
                    $
                    {(
                      selectedArtist.monthlyTotal /
                      selectedArtist.supportersCount /
                      100
                    ).toFixed(2)}
                  </div>
                  <div className="dashboard__home_card_description">
                    Avg Per Supporter
                  </div>
                </div>
              )}
              <div className="dashboard__home_card_numbers">
                <div className="dashboard__home_card_total">
                  ${(selectedArtist.monthlyTotal / 100).toFixed(2)}
                </div>
                <div className="dashboard__home_card_description">/Month</div>
              </div>
            </div>
          </CardContent>
          <CardActions>
            <a className="dashboard__home_link">view more income metrics</a>
          </CardActions>
        </Card>

        <Card>
          <CardContent>
            <div className="dashboard__home_card_stripe">
              {selectedArtist.isStripeSetup ? (
                <div className="dashboard__home_card_stripe">
                  <div className="dashboard__home_card_stripe_message success">
                    <CheckCircleOutline fontSize="large" /> You’re payouts are
                    all set up!
                  </div>
                  {selectedArtist.stripeDashboard && (
                    <a
                      href={selectedArtist.stripeDashboard}
                      className="dashboard__home_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '45px' }}
                    >
                      Edit Payout Details
                    </a>
                  )}
                </div>
              ) : (
                <div className="dashboard__home_card_stripe">
                  <div className="dashboard__home_card_stripe_message warning">
                    <ErrorOutline fontSize="large" /> You still need to set up
                    payouts
                  </div>
                  {selectedArtist.stripeSignup && (
                    <a
                      href={selectedArtist.stripeSignup}
                      className="dashboard__home_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '45px' }}
                    >
                      Set Up Payouts
                    </a>
                  )}
                </div>
              )}
              <div
                className="dashboard__home_card_by"
                style={{ marginLeft: '45px' }}
              >
                Powered by
                <FontAwesomeIcon
                  className="dashboard__home_card_by_icon"
                  icon={faStripe}
                  size="3x"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedArtist?.promoteSquareImages?.length > 0 && (
          <Card>
            <CardContent>
              <div className="dashboard__home_card_title">
                Promote Your Page
              </div>
              <div className="row">
                <div className="col-12">
                  <p>
                    Post these images on Instagram to help spread the word and
                    remember to tag @ampl3d so we can repost.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <h5>Instagram Post </h5>
                </div>
              </div>
              <div className="row dashboard__home_card_promote">
                {selectedArtist.promoteSquareImages.map((promoImage) => (
                  <div className="col-4">
                    <a
                      key={promoImage.name}
                      href={promoImage.url}
                      download={promoImage.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={promoImage.url} />
                    </a>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col-12">
                  <h5>Instagram Story </h5>
                </div>
              </div>
              <div className="row dashboard__home_card_promote">
                {selectedArtist?.promoteStoryImages.map((promoImage) => (
                  <div className="col-4">
                    <a
                      key={promoImage.name}
                      href={promoImage.url}
                      download={promoImage.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={promoImage.url} />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="dashboard__home_card_roadmap">
          <CardContent>
            <div className="dashboard__home_card_title">Learn More</div>
            <div className="row">
              <div className="col-6">
                <img src={ArtistHandbook} />
              </div>
              <div className="col-6">
                <h5>Roadmap</h5>
                <p>See what Ampled contributors are working on.</p>
                <div className="dashboard__home_card_by">
                  Powered by
                  <FontAwesomeIcon
                    className="dashboard__home_card_by_icon"
                    icon={faTrello}
                    size="2x"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default ArtistHome;
