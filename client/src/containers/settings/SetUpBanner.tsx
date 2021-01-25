import * as React from 'react';

import { Sticky } from '../shared/sticky/Sticky';

interface Props {
  userData: any;
  requestApproval: Function;
}

export class SetUpBanner extends React.Component<Props, any> {
  render() {
    const { ownedPages } = this.props.userData;
    const noStripe = ownedPages.filter((ownedPage) => !ownedPage.isStripeSetup);
    const notApproved = ownedPages
      .filter((ownedPage) => ownedPage.isStripeSetup)
      .filter((ownedPage) => !ownedPage.approved);

    return (
      <>
        {noStripe.length > 0 && (
          <Sticky>
            <div className="artistAlertHeader__container">
              The Ampled team does a quick spot check of all pages before they
              become visible to the general public. Set up payout for{' '}
              {noStripe.map((page, index) => {
                if (noStripe.length > 1 && noStripe.length === index + 1) {
                  return (
                    <span key={`stripe-${index}`}>
                      {' '}
                      and <a href={page.stripeSignup}>{page.name}</a>
                    </span>
                  );
                } else if (
                  noStripe.length > 2 &&
                  noStripe.length !== index + 1
                ) {
                  return (
                    <span key={`stripe-${index}`}>
                      <a href={page.stripeSignup}>{page.name}</a>,{' '}
                    </span>
                  );
                } else {
                  return (
                    <a key={`stripe-${index}`} href={page.stripeSignup}>
                      {page.name}
                    </a>
                  );
                }
              })}{' '}
              to help us approve your page faster.
            </div>
          </Sticky>
        )}
        {notApproved.length > 0 && (
          <Sticky>
            <div className="artistAlertHeader__container">
              Congrats! Your page is now eligible for approval. When you’re
              ready for us to take a look, request approval for{' '}
              {notApproved.map((page, index) => {
                if (
                  notApproved.length > 1 &&
                  notApproved.length === index + 1
                ) {
                  return (
                    <span key={`request-${index}`}>
                      {' '}
                      and{' '}
                      <button
                        className="link link__banner"
                        onClick={() =>
                          this.props.requestApproval(page.artistSlug)
                        }
                      >
                        {page.name}
                      </button>
                    </span>
                  );
                } else if (
                  notApproved.length > 2 &&
                  notApproved.length !== index + 1
                ) {
                  return (
                    <span key={`request-${index}`}>
                      <button
                        className="link link__banner"
                        onClick={() =>
                          this.props.requestApproval(page.artistSlug)
                        }
                      >
                        {page.name}
                      </button>
                      ,{' '}
                    </span>
                  );
                } else {
                  return (
                    <button
                      key={`request-${index}`}
                      className="link link__banner"
                      onClick={() =>
                        this.props.requestApproval(page.artistSlug)
                      }
                    >
                      {page.name}
                    </button>
                  );
                }
              })}{' '}
              to submit your page.
            </div>
          </Sticky>
        )}
      </>
    );
  }
}
