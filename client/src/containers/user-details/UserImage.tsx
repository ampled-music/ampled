import './../artist/artist.scss';
import './user-details.scss';
import '../settings/user-settings.scss';

import * as React from 'react';
import { Image, Transformation } from 'cloudinary-react';

import avatar from '../../images/avatars/Avatar_Blank.svg';

interface Props {
  image: any;
}

class UserImage extends React.Component<Props, any> {
  render() {
    const { image } = this.props;
    let coordinates;
    if (image?.coordinates) {
      coordinates = image?.coordinates.split(',');
    }
    console.log('image: ', image);
    return (
      <>
        {image?.public_id ? (
          <Image className="user-image" alt="Avatar" publicId={image.public_id}>
            <Transformation
              fetchFormat="auto"
              crop={coordinates ? 'crop' : 'fill'}
              x={coordinates ? coordinates[0] : ''}
              y={coordinates ? coordinates[1] : ''}
              width="300"
              height="300"
              responsive_placeholder="blank"
            />
          </Image>
        ) : (
          <img src={avatar} className="user-image" alt="Your avatar" />
        )}
      </>
    );
  }
}

export { UserImage };
