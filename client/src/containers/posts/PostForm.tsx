import * as React from 'react';
import { Upload } from './Upload';

class PostForm extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      caption: '',
      audioUrl: '',
      artist_page_id: this.props.match.params.id,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert(`Form submitted: ${this.state}`);
    event.preventDefault();
  }

  addAudioUrl(audioUrl) {
    this.setState({ audioUrl });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Post title:
          <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
        </label>
        <label>
          Caption:
          <textarea name="caption" value={this.state.caption} onChange={this.handleChange} />
        </label>
        <input type="hidden" value={this.state.audioUrl} name="audioUrl" />
        <Upload onComplete={this.addAudioUrl.bind(this)} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export { PostForm };
