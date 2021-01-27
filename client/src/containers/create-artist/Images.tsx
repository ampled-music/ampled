import * as React from 'react';

import { UploadImage } from '../shared/upload/UploadImage';

interface ImagesProps {
  images: any;
  showToast: Function;
}

export class Images extends React.Component<ImagesProps> {
  render() {
    const { images } = this.props;
    const imageSetter = (index) => (cloudinary) => {
      if (cloudinary) {
        images[index] = {
          url: cloudinary.url,
          public_id: cloudinary.public_id,
          order: index,
        };
      } else {
        images[index] = null;
      }
      this.setState({ images });
    };

    const imageTypes = ['Primary', 'Photo #2', 'Photo #3'];

    return (
      <div className="container">
        <div className="image-upload">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="create-artist__subtitle">Featured Images</div>
              <h6>
                Minimum resolution: 700 X 700
                <br />
                Maximum size: 5mb
              </h6>
              {/* <div className="create-artist__copy">
                You can have several photos for your profile, but there can be
                only one profile photo, which will be used to identify you to
                your supporters in certain scenarios. Select your primary photo
                and then up to two secondary photos for your profile.
              </div> */}
            </div>
          </div>
          <div className="row">
            {imageTypes.map((type, index) => (
              <div className="col-md-4 col-sm-12" key={index}>
                <UploadImage
                  altText={type}
                  setImage={imageSetter(index)}
                  imageObject={images[index]}
                  showToast={this.props.showToast}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
