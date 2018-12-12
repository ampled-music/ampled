import React from "react";
import axios from "axios";

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div className={"progress"}>
        <div
          className={"progress-bar progress-bar-striped"}
          role="progressbar"
          style={{ width: `${this.props.now}%` }}
          aria-valuenow={this.props.now}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    );
  }
}

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { progress: 0, complete: false, completedUrl: "", key: "" };
  }

  updateProgress(e) {
    const percentage = Math.ceil((100 * e.loaded) / e.total);
    this.setState({ progress: percentage });
  }

  processFile(e) {
    const file = e.target.files[0];
    this.signFile(file).then(response => {
      console.log(response);
      const putUrl = response.data.signedUrl;
      this.setState({ key: response.data.key });
      const options = {
        headers: {
          "Content-Type": file.type
        },
        onUploadProgress: this.updateProgress.bind(this),
        method: "PUT",
        data: file
      };
      axios.request(putUrl, options).then(this.fetchPlayableUrl.bind(this));
    });
  }

  fetchPlayableUrl(_) {
    axios.get(`uploads/playable_url?key=${this.state.key}`).then(response => {
      this.setState({ completedUrl: response.data.signedUrl, complete: true });
    });
  }

  signFile(file) {
    return axios.get(`/uploads/sign?contentType=${file.type}`);
  }

  render() {
    return (
      <div style={{ width: "400px" }}>
        <ProgressBar now={this.state.progress} />
        <input type="file" onChange={this.processFile.bind(this)} />
        <audio
          ref="audio_tag"
          src={this.state.completedUrl}
          controls
          autoPlay={this.state.complete}
        />
      </div>
    );
  }
}
