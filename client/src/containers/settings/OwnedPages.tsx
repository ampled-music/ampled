import * as React from 'react';
import { Link } from 'react-router-dom';
import { routePaths } from '../route-paths';

import { faStripe } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, Transformation } from 'cloudinary-react';
import { SocialImages } from './SocialImages';

import Moment from 'moment';

import tear_black from '../../images/backgrounds/background_tear_black.png';

interface Props {
  ownedPages: any;
}

export class OwnedPages extends React.Component<Props, any> {
  render() {
    const { ownedPages } = this.props;
    console.log('ownedPages', ownedPages);
    return (
      <div>
        <h1>My Pages</h1>
        <div className="pages row justify-content-center justify-content-md-start">
          {ownedPages.map((ownedPage) => (
            <div
              key={`artist-${ownedPage.artistId}`}
              className="artist col-sm-6 col-md-4"
            >
              {ownedPage.image && (
                <Image
                  publicId={ownedPage.image}
                  alt={ownedPage.name}
                  key={ownedPage.name}
                  className="artist__image"
                >
                  <Transformation
                    fetchFormat="auto"
                    quality="auto"
                    crop="fill"
                    width={250}
                    height={250}
                    responsive_placeholder="blank"
                  />
                </Image>
              )}
              <Link
                to={`/artist/${ownedPage.artistSlug}`}
                className="artist__image-border"
              />
              <img className="tear__topper" src={tear_black} alt="" />
              <div className="artist__info">
                <p className="artist__info_role">
                  {ownedPage.role
                    ? ownedPage.role.charAt(0).toUpperCase() +
                      ownedPage.role.slice(1) +
                      ' of'
                    : ''}
                </p>
                <Link
                  to={`/artist/${ownedPage.artistSlug}`}
                  className="artist__info_name"
                >
                  {ownedPage.name}
                </Link>
                <div className="details">
                  <div className="details__info">
                    <div className="row no-gutters">
                      <div className="col-6">
                        <div className="details__info_title">Supporters</div>
                        <div className="details__info_value">
                          {ownedPage.supportersCount || 0}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="details__info_title">Monthly Total</div>
                        <div className="details__info_value">
                          ${ownedPage.monthlyTotal / 100}
                        </div>
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-6">
                        <div className="details__info_title">Last Post</div>
                        <div className="details__info_value">
                          {Moment(ownedPage.lastPost).format('l')}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="details__info_title">Last Payout</div>
                        <div className="details__info_value">
                          {Moment(ownedPage.lastPayout).format('l')}
                        </div>
                      </div>
                    </div>
                  </div>
                  {ownedPage.artistApproved && (
                    <div className="details__promote">
                      <div className="row no-gutters">
                        <div className="col-12">
                          <div className="details__info_title">
                            <Link
                              to={`/artist/${ownedPage.artistSlug}/promote`}
                            >
                              Promote Your Page
                            </Link>
                          </div>
                          <div className="row no-gutters">
                            {ownedPage.promoteSquareImages && (
                              <div className="col-6">
                                <div className="details__info_title sm">
                                  Square
                                </div>
                                <SocialImages
                                  images={ownedPage.promoteSquareImages}
                                />
                              </div>
                            )}
                            {ownedPage.promoteStoryImages && (
                              <div className="col-6">
                                <div className="details__info_title sm">
                                  Stories
                                </div>
                                <SocialImages
                                  images={ownedPage.promoteStoryImages}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {ownedPage.role === 'admin' && (
                    <div className="details__stripe">
                      <div className="row no-gutters align-items-center">
                        <div className="col-4">
                          <FontAwesomeIcon
                            className="icon details__stripe_icon"
                            icon={faStripe}
                          />
                        </div>
                        <div className="col-8">
                          {ownedPage.isStripeSetup ? (
                            <a
                              href={ownedPage.stripeDashboard}
                              className="details__stripe_link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Edit Payout Details
                            </a>
                          ) : (
                            <a
                              href={ownedPage.stripeSignup}
                              className="details__stripe_link"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#d9534f' }}
                            >
                              Set Up Payouts
                            </a>
                          )}
                        </div>
                        <div className="col-12">
                          <a
                            href={routePaths.editArtist.replace(
                              ':slug',
                              ownedPage.artistSlug,
                            )}
                            className="details__edit_link"
                            rel="noopener noreferrer"
                          >
                            Edit Artist Details
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
