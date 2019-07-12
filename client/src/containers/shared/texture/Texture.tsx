import * as React from 'react';
var classNames = require( 'classnames' );

interface Props {
  positionTop25: boolean;
  positionTop50: boolean;
  positionFlip: boolean;
}
  
class Texture extends React.Component<Props,any> {
      
  render() {
    var classes = classNames(
        'bg-texture bg-texture__absolute',
        { 'bg-texture__absolute_25': this.props.positionTop25 },
        { 'bg-texture__absolute_50': this.props.positionTop50 },
        { 'bg-texture__flip': this.props.positionFlip }
      );

    return (
      <div className={classes}></div>
    );
  }
}

export { Texture };
