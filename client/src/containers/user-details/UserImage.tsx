import './../artist/artist.scss';
import './user-details.scss';
import '../settings/user-settings.scss';

import * as React from 'react';
import { Image, Transformation } from 'cloudinary-react';

import avatar from '../../images/avatars/Avatar_Blank.svg';

interface Props {
  image: any;
  className?: string;
  alt?: string;
  width?: number;
  style?: any;
}

class UserImage extends React.Component<Props, any> {
  render() {
    const { image, className, alt, width, style } = this.props;
    let coordinates;

    if (image?.coordinates) {
      coordinates = image?.coordinates.split(',');
    }

    return (
      <>
        {image?.public_id ? (
          <Image
            className={className}
            alt={alt}
            publicId={image.public_id}
            style={style}
          >
            <Transformation
              fetchFormat="auto"
              crop={coordinates ? 'crop' : 'fill'}
              x={coordinates ? coordinates[0] : ''}
              y={coordinates ? coordinates[1] : ''}
              width={coordinates ? coordinates[2] : width}
              height={coordinates ? coordinates[3] : width}
              responsive_placeholder="blank"
            />
          </Image>
        ) : (
          <img src={avatar} className={className} alt={alt} style={style} />
        )}
      </>
    );
  }
}

export { UserImage };
