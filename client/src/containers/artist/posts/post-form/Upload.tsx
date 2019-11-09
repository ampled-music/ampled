import axios from 'axios';
import * as React from 'react';

import { Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

interface UploadState {
  progress: number;
  complete: boolean;
  completedUrl: string;
  key: string;
  fileName: string;
  uploadError: string;
}

interface UploadProps {
  onComplete: Function;
}

class Upload extends React.Component<UploadProps, UploadState> {
  state = {
    progress: 0,
    complete: false,
    completedUrl: undefined,
    key: undefined,
    fileName: undefined,
    uploadError: undefined,
  };

  updateProgress = (e) => {
    const percentage = Math.ceil((100 * e.loaded) / e.total);
    this.setState({ progress: percentage });
  };

  processFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const fileExtension =
      file.name &&
      file.name
        .split('.')
        .pop()
        .toLowerCase();

    if (fileExtension !== 'mp3') {
      this.setState({ uploadError: 'Upload only accepts mp3 files.' });

      return;
    }

    const fileName = this.getFileName(e);

    this.signFile(file).then((response) => {
      const putUrl = response.data.signedUrl;
      this.setState({ uploadError: undefined, key: response.data.key, fileName });

      const options = {
        url: putUrl,
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: this.updateProgress,
        method: 'PUT',
        data: file,
      };

      axios.request(options).then(() => {
        this.fetchPlayableUrl();
        this.props.onComplete(this.state.key);
      });
    });
  };

  getFileName(e) {
    const filePath = e.target.value;

    return filePath.split('\\').pop();
  }

  fetchPlayableUrl = () => {
    axios.get(`uploads/playable_url?key=${this.state.key}`).then((response) => {
      this.setState({ completedUrl: response.data.signedUrl, complete: true });
    });
  };

  signFile(file) {
    return axios.get(`/uploads/sign?contentType=${file.type}`);
  }

  removeFile = () =>
    this.setState({
      progress: 0,
      complete: false,
      completedUrl: undefined,
      key: undefined,
      fileName: undefined,
      uploadError: undefined,
    });

  renderPreview(): React.ReactNode {
    const { progress } = this.state;
    return (
      <div className="progress-container">
        <div className="progress-info" data-progress={progress}>
          <div className="progress-info__name">
            <div className="progress-info__name_mp3">Mp3</div>
            <div className="progress-info__name_song">{this.state.fileName}</div>
          </div>

          <div className="file-actions" data-progress={progress}>
            <span className="remove-button" title="Remove audio" onClick={this.removeFile}>
              Remove
            </span>
            <label htmlFor="raised-button-file">
              <span className="replace-button" title="Change audio">
                Replace
              </span>
            </label>
          </div>
        </div>

        <div className="progress-bar__upload" data-progress={progress}>
          Upload Progress
        </div>
        <div className="progress-bar__container">
          <span className="progress-bar__progress" style={{ width: `${progress}%` }} data-progress={progress}>
            <span>{progress}%</span>
          </span>
        </div>
        <LinearProgress className="progress-bar" variant="determinate" value={progress} style={{ height: 30 }} />
      </div>
    );
  }

  renderUploadButton(): React.ReactNode {
    return (
      <label htmlFor="raised-button-file">
        <Button className="btn btn-ampled audio-button" component="span">
          Add MP3 audio
        </Button>
      </label>
    );
  }

  render() {
    const { fileName } = this.state;

    return (
      <div className="upload">
        <div className="upload-error">{this.state.uploadError && <h5>{this.state.uploadError}</h5>}</div>

        <input
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          accept=".mp3"
          onChange={this.processFile}
        />
        <div className="uploader">{fileName ? this.renderPreview() : this.renderUploadButton()}</div>
      </div>
    );
  }
}

export { Upload };
