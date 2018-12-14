import axios from 'axios';
import * as React from 'react';
import { ProgressBar } from './ProgressBar';

interface UploadState {
  progress: number;
  complete: boolean;
  completedUrl: string;
  key: string;
}

interface UploadProps {
  onComplete: (string) => null
}

class Upload extends React.Component<UploadProps, UploadState> {
  private onComplete : (s: string) => null;

  constructor(props) {
    super(props);
    this.state = { progress: 0, complete: false, completedUrl: '', key: '' };
    this.onComplete = props.onComplete || console.log
  }

  updateProgress(e) {
    const percentage = Math.ceil((100 * e.loaded) / e.total);
    this.setState({ progress: percentage });
  }

  processFile(e) {
    const file = e.target.files[0];
    this.signFile(file).then((response) => {
      const putUrl = response.data.signedUrl;
      this.setState({ key: response.data.key });
      const options = {
        url: putUrl,
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: this.updateProgress.bind(this),
        method: 'PUT',
        data: file,
      };
      axios.request(options).then((_) => {
        this.fetchPlayableUrl.bind(this)();
        this.onComplete(putUrl);
      });
    });
  }

  fetchPlayableUrl() {
    axios.get(`uploads/playable_url?key=${this.state.key}`).then((response) => {
      this.setState({ completedUrl: response.data.signedUrl, complete: true });
    });
  }

  signFile(file) {
    return axios.get(`/uploads/sign?contentType=${file.type}`);
  }

  render() {
    const { completedUrl, progress } = this.state;
    return (
      <div style={{ width: '400px' }}>
        <ProgressBar now={progress} />
        <input type="file" onChange={this.processFile.bind(this)} />
        <audio ref="audio_tag" src={completedUrl} controls autoPlay={this.state.complete} />
      </div>
    );
  }
}

export { Upload };
