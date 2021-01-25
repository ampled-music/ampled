import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

interface Props {
  // images: {
  //   description: string;
  //   name: string;
  //   url: string;
  // };
  images: any;
}

export class SocialImages extends React.Component<Props, any> {
  render() {
    const { images } = this.props;
    return (
      <div className="details__promote_container">
        {images.map((promoImage) => (
          <a
            key={promoImage.name}
            className="details__promote_link"
            href={promoImage.url}
            download={promoImage.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faImage} title={promoImage.name} />
          </a>
        ))}
      </div>
    );
  }
}
