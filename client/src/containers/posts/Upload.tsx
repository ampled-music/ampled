import axios from 'axios';
import * as React from 'react';
import { ProgressBar } from './ProgressBar';

class Upload extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { progress: 0, complete: false, completedUrl: '', key: '' };
  }

  updateProgress(e) {
    const percentage = Math.ceil((100 * e.loaded) / e.total);
    this.setState({ progress: percentage });
  }

  processFile(e) {
    const file = e.target.files[0];
    this.signFile(file).then((response) => {
      // const putUrl = response.data.signedUrl;
      this.setState({ key: response.data.key });
      const options = {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: this.updateProgress.bind(this),
        method: 'PUT',
        data: file,
      };
      axios.request(options).then((_) => {
        // this.onComplete(putUrl);
        this.fetchPlayableUrl.bind(this);
      });
    });
  }

  fetchPlayableUrl(_) {
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
