import * as React from 'react';
import { Upload } from './Upload';

import { Button, DialogContent, TextField } from '@material-ui/core';
import './post-form.scss';

interface Props {
  artistId: number;
}

class PostForm extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      caption: '',
      audioUrl: '',
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

  addAudioUrl(audioUrl) {
    this.setState({ audioUrl });
  }

  render() {
    return (
      <div className="post-form">
        <DialogContent>
          <h1>AUDIO POST</h1>
          <form onSubmit={this.handleSubmit}>
            <Upload onComplete={this.addAudioUrl.bind(this)} />

            <div className="instructions">
              <p>Upload as FLAC, WAV, ALAC or AIFF audio file to provide the best audio quality. Learn more here.</p>
              <p>
                By uploading, you confirm that your sounds comply with our Terms of Use and you don't infringe anyone
                else's rights.
              </p>
            </div>

            <div className="post-info">
              <div className="post-image">
                <Button className="image-button">Update Image</Button>
              </div>
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
                  helperText="300 character limit"
                  fullWidth
                  multiline
                  rows="3"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginTop: 20 }}
                  value={this.state.caption}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <input type="hidden" value={this.state.audioUrl} name="audioUrl" />
            {/* <input type="submit" value="Submit" /> */}
          </form>
        </DialogContent>
      </div>
    );
  }
}

export { PostForm };
