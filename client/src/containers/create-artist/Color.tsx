import * as React from 'react';

import ChromePicker from 'react-color/lib/Chrome';

interface ColorProps {
  state: any;
  handleColorChange: Function;
}

export class Color extends React.Component<ColorProps> {
  render() {
    const { state } = this.props;

    return (
      <div className="artist-color">
        <div
          className="primary-color"
          style={{ backgroundColor: state.artistColor }}
        >
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-6 col-sm-12">
                <div className="artist-color__info">
                  <div className="create-artist__subtitle">Accent Color</div>
                  <div className="create-artist__copy">
                    <p>
                      Select a color for your artist page. This color will be
                      used as accents on both your page and around the site.
                    </p>
                    <p>
                      The lighter version (20% opacity) of the color is how it
                      will appear in certain rare instances.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="artist-color__picker">
                  <ChromePicker
                    color={
                      state.artistColor ? state.artistColor : state.randomColor
                    }
                    onChangeComplete={this.props.handleColorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="secondary-color"
          style={{ backgroundColor: state.artistColorAlpha }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="artist-color__opacity">20% Opacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
