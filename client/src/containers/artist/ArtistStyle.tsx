import * as React from 'react';

interface Props {
    accentColor: string;
}

class ArtistStyle extends React.Component<Props, any> {
  
  render() {

    const { accentColor } = this.props;

    return (
        <div>
            {accentColor}
        </div>
    );
  }
}

export { ArtistStyle };
