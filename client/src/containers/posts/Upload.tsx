import { Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import * as React from 'react';

interface UploadState {
  progress: number;
  complete: boolean;
  completedUrl: string;
  key: string;
  fileName: string;
}

interface UploadProps {
  onComplete: Function;
}

class Upload extends React.Component<UploadProps, UploadState> {
  constructor(props) {
    super(props);
    this.state = { progress: 0, complete: false, completedUrl: '', key: '', fileName: '' };
  }

  updateProgress = (e) => {
    const percentage = Math.ceil((100 * e.loaded) / e.total);
    this.setState({ progress: percentage });
  };

  processFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    this.getFileName(e);

    this.signFile(file).then((response) => {
      const putUrl = response.data.signedUrl;
      this.setState({ key: response.data.key });

      const options = {
        url: putUrl,
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: this.updateProgress,
        method: 'PUT',
        data: file,
      };

      axios.request(options).then((_) => {
        this.fetchPlayableUrl();
        this.props.onComplete(this.state.key);
      });
    });
  };

  getFileName(e) {
    const filePath = e.target.value;
    const fileName = filePath.split('\\').pop();

    this.setState({ fileName });
  }

  fetchPlayableUrl = () => {
    axios.get(`uploads/playable_url?key=${this.state.key}`).then((response) => {
      this.setState({ completedUrl: response.data.signedUrl, complete: true });
    });
  };

  signFile(file) {
    return axios.get(`/uploads/sign?contentType=${file.type}`);
  }

  render() {
    const { progress } = this.state;

    return (
      <div className="upload">
        <LinearProgress variant="determinate" value={progress} style={{ height: 25 }} />
        <div className="progress-info">
          <span>{this.state.fileName}</span>
          <span>{progress}%</span>
        </div>

        <input style={{ display: 'none' }} id="raised-button-file" type="file" onChange={this.processFile} />
        <label htmlFor="raised-button-file">
          <Button className="upload-button" variant="contained" component="span">
            Upload
          </Button>
        </label>
      </div>
    );
  }
}

export { Upload };
