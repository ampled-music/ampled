import './../artist/artist.scss';
import './user-details.scss';
import '../settings/user-settings.scss';

import * as React from 'react';
import { Image, Transformation } from 'cloudinary-react';

import avatar1 from '../../images/avatars/Avatar_1.svg';
import avatar2 from '../../images/avatars/Avatar_2.svg';
import avatar3 from '../../images/avatars/Avatar_3.svg';
import avatar4 from '../../images/avatars/Avatar_4.svg';
import avatar5 from '../../images/avatars/Avatar_5.svg';
import avatar6 from '../../images/avatars/Avatar_6.svg';
import avatar7 from '../../images/avatars/Avatar_7.svg';
import avatar8 from '../../images/avatars/Avatar_8.svg';
import avatar9 from '../../images/avatars/Avatar_9.svg';

interface Props {
  image: any;
  alt: string;
  className?: string;
  width?: number;
  style?: any;
}

class UserImage extends React.Component<Props, any> {
  imageSelector(name) {
    const firstChar = name.charCodeAt(0);
    const num = Array.from(firstChar.toString())
      .map(Number)
      .reduce((n, acc) => {
        const plus = acc + n;
        const asArr = plus.toString().split('');
        if (asArr.length === 1) return plus;
        else return Number(asArr[0]);
      }, 0);
    return num;
  }

  render() {
    const { image, className, alt, width, style } = this.props;
    let coordinates;

    const avatars = [
      avatar1,
      avatar2,
      avatar3,
      avatar4,
      avatar5,
      avatar6,
      avatar7,
      avatar8,
      avatar9,
    ];
    let selectedAvatar;
    const rando = this.imageSelector(alt);
    if (rando >= 1 && rando <= 9) {
      selectedAvatar = avatars[rando];
      selectedAvatar = avatar5;
    } // just in case

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
          <img
            src={selectedAvatar}
            className={className}
            alt={alt}
            style={style}
          />
        )}
      </>
    );
  }
}

export { UserImage };
