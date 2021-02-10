import * as React from 'react';

import { Card, CardContent, IconButton } from '@material-ui/core';
import { ReactSVG } from 'react-svg';
import AddPlus from '../../images/icons/Icon_Add-Plus.svg';

import { UploadImage } from './Image';

interface ImagesProps {
  images: any;
  setImages: (images: any) => void;
  addImage: Function;
  showToast: Function;
}

export class Images extends React.Component<ImagesProps> {
  render() {
    const { images, setImages, addImage } = this.props;
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

    console.log('images', images);

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
            {images.length ? (
              images.map((image, index) => (
                <div className="col-md-4 col-sm-12">
                  <Card className="artist-image__card">
                    <CardContent>
                      <UploadImage
                        imageUpload={imageSetter(index)}
                        imageObject={image}
                        imageIndex={index}
                        showToast={this.props.showToast}
                      />
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-md-4 col-sm-12">
                <Card className="artist-image__card">
                  <IconButton
                    onClick={() => addImage()}
                    className="artist-image__card_add"
                  >
                    <ReactSVG
                      className="icon icon_black icon_sm"
                      src={AddPlus}
                    />
                  </IconButton>
                  <CardContent>
                    <UploadImage
                      imageUpload={imageSetter(0)}
                      showToast={this.props.showToast}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
