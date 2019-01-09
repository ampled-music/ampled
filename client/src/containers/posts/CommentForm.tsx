import * as React from 'react';

interface Props {
  handleSubmit: Function;
}

class CommentForm extends React.Component<Props, any> {
  state = {
    comment: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleSubmit(this.state.comment);
    this.setState({ comment: '' });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="comment" value={this.state.comment} onChange={this.handleChange} />
      </form>
    );
  }
}

export { CommentForm };
