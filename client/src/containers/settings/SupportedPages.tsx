import * as React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { Image, Transformation } from 'cloudinary-react';
import { SocialImages } from './SocialImages';
import { routePaths } from '../route-paths';
import tear_black from '../../images/backgrounds/background_tear_black.png';

interface Props {
  supportedPages: any;
  openModal?: Function;
}

export class SupportedPages extends React.Component<Props, any> {
  render() {
    const { supportedPages } = this.props;
    console.log('supportedPages', supportedPages);
    return (
      <div>
        <h1>Supporting</h1>
        <div className="pages row justify-content-center justify-content-md-start">
          {supportedPages.map((subscription) => (
            <div
              key={`artist-${subscription.artistPageId}`}
              className="artist col-sm-6 col-md-4"
            >
              <Image
                publicId={subscription.image}
                alt={subscription.name}
                key={subscription.name}
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
              <Link
                to={`artist/${subscription.slug}`}
                className="artist__image-border"
              />
              <img className="tear__topper" src={tear_black} alt="" />
              <div className="artist__info">
                <Link
                  to={`artist/${subscription.slug}`}
                  className="artist__info_name"
                >
                  {subscription.name}
                </Link>
                <div className="details">
                  <div className="details__info">
                    <div className="row no-gutters">
                      <div className="col-8">
                        <div className="details__info_title">Supporting At</div>
                        <div className="details__info_value details__info_value_large">
                          ${subscription.amount / 100}
                          <span>/Month</span>
                        </div>
                        <div className="details__info_value details__info_value_small">
                          ${subscription.amountFees / 100} incl. fees
                        </div>
                      </div>
                      <div className="col-4">
                        <a
                          className="link details__info_value details__info_value_change"
                          rel="noopener noreferrer"
                          href={routePaths.editSupport.replace(
                            ':slug',
                            subscription.artistSlug,
                          )}
                        >
                          Change Amount
                        </a>
                        <button
                          className="link details__info_value details__info_value_cancel"
                          name="Cancel"
                          onClick={(event) =>
                            this.props.openModal(event, subscription)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-6">
                        <div className="details__info_title">Support Date</div>
                        <div className="details__info_value">
                          {Moment(subscription.support_date).format('l')}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="details__info_title">Last Post</div>
                        <div className="details__info_value">
                          {subscription.last_post_date
                            ? Moment(subscription.last_post_date).format('l')
                            : 'No posts yet'}
                        </div>
                      </div>
                    </div>
                    {subscription.artistApproved && (
                      <div className="details__promote">
                        <div className="row no-gutters">
                          <div className="col-12">
                            <div className="details__info_title">
                              Promote This Page
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <SocialImages
                                  images={subscription.supporterImages}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
