import * as React from 'react';
import cx from 'classnames';
import './loading.scss';
import logo from '../../../images/ampled_logo.svg';

interface Props {
  isLoading: boolean;
}

class Loading extends React.Component<Props, any> {
  render() {
    return (
      <div className={cx('loading-cover ', { show: this.props.isLoading })}>
        <img src={logo} alt="Ampled Logo" className="ampled-logo" />
        <div className="eq-logo">
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
          <span className="eq-logo__bar"></span>
        </div>
      </div>
    );
  }
}

export { Loading };
