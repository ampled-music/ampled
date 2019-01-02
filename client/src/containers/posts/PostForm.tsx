import cx from 'classnames';
import * as React from 'react';
import { Upload } from './Upload';

import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';
import './post-form.scss';

interface Props {
  artistId: number;
  close: React.MouseEventHandler;
}

class PostForm extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      caption: '',
      audioUrl: '',
      imageUrl: undefined,
      artist_page_id: this.props.artistId,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    alert(`Form submitted: ${this.state}`);
  };

  updateAudioUrl = (audioUrl) => {
    this.setState({ audioUrl });
  };

  processImage = (e) => {
    console.log('Send image to cloudionary and get the url to render it', e.target.files[0]);
    this.setState({
      imageUrl: 'https://www.fairfaxband.org/wp-content/uploads/2018/07/ChristmasInFairfax2-e1542820289569.png',
    });
  };

  renderUploader(): React.ReactNode {
    return <div className="uploader">{this.renderUploadButton()}</div>;
  }

  renderPreview(): React.ReactNode {
    return (
      <div className="post-image">
        <img className="preview" src={this.state.imageUrl} />
        {this.renderUploadButton()}
      </div>
    );
  }

  renderUploadButton(): React.ReactNode {
    return (
      <label htmlFor="image-file">
        <Button className="image-button" variant="contained" component="span">
          Update Image
        </Button>
      </label>
    );
  }

  render() {
    return (
      <div className="post-form">
        <DialogContent>
          <h1>AUDIO POST</h1>
          <form onSubmit={this.handleSubmit}>
            <Upload onComplete={this.updateAudioUrl} />

            <div className="instructions">
              <p>
                Upload as FLAC, WAV, ALAC or AIFF audio file to provide the best audio quality. Learn more{' '}
                <a href="">here</a>.
              </p>
              <p>
                By uploading, you confirm that your sounds comply with our <a href="">Terms of Use</a> and you don't
                infringe anyone else's rights.
              </p>
            </div>

            <div className="post-info">
              <input style={{ display: 'none' }} id="image-file" type="file" onChange={this.processImage} />

              {this.state.imageUrl ? this.renderPreview() : this.renderUploader()}

              <div className="post-description">
                <TextField
                  autoFocus
                  name="title"
                  label="Post Title"
                  type="text"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.title}
                  onChange={this.handleChange}
                />
                <TextField
                  name="caption"
                  label="Caption"
                  type="text"
                  helperText="300 character limit"
                  fullWidth
                  multiline
                  rows="3"
                  variant="outlined"
                  inputProps={{
                    maxLength: 300,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginTop: 20 }}
                  value={this.state.caption}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <DialogActions className="action-buttons">
              <Button className="cancel-button" onClick={this.props.close}>
                Cancel
              </Button>
              <Button
                type="Submit"
                className={cx('post-button', { disabled: this.state.audioUrl.length === 0 })}
                disabled={this.state.audioUrl.length === 0}
                onClick={this.props.close}
              >
                Post Audio
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </div>
    );
  }
}

export { PostForm };
