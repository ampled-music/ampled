import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { deleteFileFromCloudinary } from '../../api/cloudinary/delete-image';
import { uploadFileToCloudinary } from '../../api/cloudinary/upload-image';

import { Image, Transformation } from 'cloudinary-react';
import { Button, CircularProgress } from '@material-ui/core';

import PhotoIcon from '../../images/icons/Icon_Photo.svg';

interface UploadImageProps {
  imageObject?: {
    url: string;
    public_id: string;
  };
  imageUpload: Function;
  imageIndex?: number;
  showToast: Function;
}

export class UploadImage extends React.Component<UploadImageProps> {
  state = {
    loadingImage: false,
    deleteToken: undefined,
    publicId: null,
  };

  processImage = async (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    }

    if (
      ['image/gif', 'image/jpeg', 'image/png'].indexOf(imageFile.type) === -1
    ) {
      this.props.showToast({
        message: 'Please select an image file.',
        type: 'error',
      });

      return;
    }

    this.setState({ loadingImage: true });

    if (this.state.deleteToken) {
      this.removeImage();
    }

    const cloudinaryResponse = await uploadFileToCloudinary(imageFile);

    if (cloudinaryResponse) {
      this.setState({
        deleteToken: cloudinaryResponse.delete_token,
        loadingImage: false,
        publicId: cloudinaryResponse.public_id,
      });
      this.props.imageUpload({
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      });
    } else {
      this.setState({
        loadingImage: false,
      });

      this.props.showToast({
        message:
          'Something went wrong with your image upload. Please try again.',
        type: 'error',
      });
    }
  };

  removeImage = async () => {
    deleteFileFromCloudinary(this.state.deleteToken);
    this.setState({
      imageObject: null,
      deleteToken: undefined,
      publicId: null,
    });
    this.props.imageUpload(null);
  };

  render() {
    const { imageObject, imageIndex } = this.props;
    const { loadingImage } = this.state;

    console.log('Single Image State:', this.state);

    return (
      <>
        {imageObject ? (
          <div className="image-upload__image_container">
            <Image
              className="image-upload__image_image"
              publicId={imageObject.public_id}
              alt={`image-upload-${imageIndex}`}
            >
              <Transformation
                fetchFormat="auto"
                quality="auto"
                crop="fill"
                width={130}
                height={130}
                responsive_placeholder="blank"
              />
            </Image>
            <Button
              className="btn btn-upload"
              variant="outlined"
              component="span"
              onClick={this.removeImage}
            >
              Remove
            </Button>
          </div>
        ) : loadingImage ? (
          <CircularProgress className="loading-circle" />
        ) : (
          <div className="image-upload__image_container">
            <ReactSVG className="icon icon_black icon_100" src={PhotoIcon} />
            <label
              htmlFor={`image-file-${imageIndex}`}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button variant="outlined" component="span">
                Upload "poop"
              </Button>
            </label>
          </div>
        )}
        <input
          style={{ display: 'none' }}
          id={`image-file-${imageIndex}`}
          type="file"
          aria-label="Image file"
          accept="image/*"
          onChange={this.processImage}
        />
      </>
    );
  }
}
