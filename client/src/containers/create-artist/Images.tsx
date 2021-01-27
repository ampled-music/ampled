import * as React from 'react';

import { Card, CardContent } from '@material-ui/core';

import { UploadImage } from './Image';

interface ImagesProps {
  images: any;
  setImages: (images: any) => void;
  showToast: Function;
}

export class Images extends React.Component<ImagesProps> {
  render() {
    const { images, setImages } = this.props;
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
      setImages(images);
    };

    return (
      <div className="container">
        <div className="artist-members">
          <div className="row">
            <div className="col-md-6">
              <div className="create-artist__title">Add Images</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="create-artist__copy">
                <h6>
                  Minimum resolution: 700 X 700
                  <br />
                  Maximum size: 5mb
                </h6>
                <p>
                  You can have several photos for your profile, but there can be
                  only one profile photo, which will be used to identify you to
                  your supporters in certain scenarios. Select your primary
                  photo and then up to two secondary photos for your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {images.map((image, index) => (
              <div className="col-md-4 col-sm-12">
                <Card className="artist-image__card">
                  <CardContent>
                    <UploadImage
                      imageUpload={imageSetter(index)}
                      imageObject={image[index]}
                      showToast={this.props.showToast}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
            <div className="col-md-4 col-sm-12">
              <Card className="artist-image__card">
                <CardContent></CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
