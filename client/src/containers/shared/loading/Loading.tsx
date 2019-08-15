import * as React from 'react';
import cx from 'classnames';
import './loading.scss';

import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

interface Props {
  artistLoading: boolean;
  meLoading: boolean;
}

const ColorCircularProgress = withStyles({
  root: {
    color: '#000',
  },
})(CircularProgress);
  
class Loading extends React.Component<Props,any> {

  render() {
    return (
      <div className={cx('loading-cover ', { show: this.props.artistLoading && this.props.meLoading })}>
        <ColorCircularProgress size={80} />
      </div>
    );
  }
}

export { Loading };
