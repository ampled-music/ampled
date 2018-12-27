import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMe } from '../../redux/ducks/get-me';

import './user.scss';

interface Props {
  getMe: Function;
  history: {
    goBack: Function;
  };
  me: {
    loading: boolean;

    me: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export class UserComponent extends React.Component<Props, any> {
  componentDidMount() {
    this.props.getMe();
  }

  handleGoBackClick = () => {
    this.props.history.goBack();
  };

  render() {
    const loading = this.props.me.loading;
    const me = this.props.me.me;

    return loading ? (
      <span>Loading...</span>
    ) : (
      <div className="logged-user">
        <div>
          <h1>{`${me.first_name} ${me.last_name}`}</h1>
          <span>{me.email}</span>
        </div>
        <br />
        <button onClick={this.handleGoBackClick}>Go back</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMe: bindActionCreators(getMe, dispatch),
  };
};

const User = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserComponent);

export { User };
