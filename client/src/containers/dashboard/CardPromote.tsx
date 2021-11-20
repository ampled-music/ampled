import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';

interface CardPromoteProps {
  selectedArtist: any;
}

export const CardPromote = ({ selectedArtist }: CardPromoteProps) => {
  const { promoteSquareImages, promoteStoryImages } = selectedArtist;

  return (
    selectedArtist?.promoteSquareImages?.length > 0 && (
      <Card>
        <CardContent>
          <div className="dashboard__home_card_title">Promote Your Page</div>
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
              <h5>Instagram post</h5>
            </div>
          </div>
          <div className="row dashboard__home_card_promote">
            {promoteSquareImages.map((promoImage) => (
              <div className="col-4" key={promoImage.name}>
                <a
                  href={promoImage.url}
                  download={promoImage.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={promoImage.url} alt={promoImage.name} />
                </a>
              </div>
            ))}
          </div>
          <div className="row">
            <div className="col-12">
              <h5>Instagram story</h5>
            </div>
          </div>
          <div className="row dashboard__home_card_promote">
            {promoteStoryImages.map((promoImage) => (
              <div className="col-4" key={promoImage.name}>
                <a
                  href={promoImage.url}
                  download={promoImage.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={promoImage.url} alt={promoImage.name} />
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default CardPromote;
