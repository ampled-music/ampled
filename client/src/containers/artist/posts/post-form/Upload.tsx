import axios, { AxiosRequestConfig } from 'axios';
import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { Button, IconButton } from '@material-ui/core';
import Close from '../../../../images/icons/Icon_Close-Cancel.svg';
import LinearProgress from '@material-ui/core/LinearProgress';
import AudioIcon from '../../../../images/icons/Icon_Audio.png';

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
  onRemove?: Function;
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
      this.setState({
        uploadError: undefined,
        key: response.data.key,
        fileName,
      });

      const options: AxiosRequestConfig = {
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
        this.props.onComplete(this.state.key, this.state.fileName);
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

  removeFile = () => {
    this.setState({
      progress: 0,
      complete: false,
      completedUrl: undefined,
      key: undefined,
      fileName: undefined,
      uploadError: undefined,
    });
    // TODO: remove file from S3 somehow
    this.props.onRemove && this.props.onRemove();
  };

  renderPreview(): React.ReactNode {
    const { progress } = this.state;
    return (
      <div className="progress-container">
        <div className="progress-info" data-progress={progress}>
          <div className="progress-info__name">
            <div className="progress-info__name_mp3">Mp3</div>
            <div className="progress-info__name_song">
              {this.state.fileName}
            </div>
          </div>

          <div className="file-actions" data-progress={progress}>
            <IconButton
              aria-label="Cancel audio input"
              className="cancel-button"
              title="Remove audio"
              onClick={this.removeFile}
              size="small"
            >
              <ReactSVG className="icon" src={Close} />
            </IconButton>
          </div>
        </div>

        <div className="progress-bar__upload" data-progress={progress}>
          Upload Progress
        </div>
        <div className="progress-bar__container">
          <span
            className="progress-bar__progress"
            style={{ width: `${progress}%` }}
            data-progress={progress}
          >
            <span>{progress}%</span>
          </span>
        </div>
        <LinearProgress
          className="progress-bar"
          variant="determinate"
          value={progress}
          style={{ height: 30 }}
        />
      </div>
    );
  }

  renderUploadButton(): React.ReactNode {
    return (
      <div className="uploader">
        <input
          style={{ display: 'none' }}
          id="audio-file"
          type="file"
          accept=".mp3"
          aria-label="Audio file"
          onChange={this.processFile}
        />
        <label htmlFor="audio-file">
          <Button className="btn" component="span">
            <img
              className="btn__icon"
              src={AudioIcon}
              height={25}
              width={25}
              alt="Headphones Icon"
            />
            Upload MP3 audio
          </Button>
        </label>
      </div>
    );
  }

  render() {
    const { fileName } = this.state;

    return (
      <div className="upload">
        <div className="upload-error">
          {this.state.uploadError && <h5>{this.state.uploadError}</h5>}
        </div>
        {fileName ? this.renderPreview() : this.renderUploadButton()}
      </div>
    );
  }
}

export { Upload };
