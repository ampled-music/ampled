import * as React from 'react';
import { hexToRGB } from '../../styles/utils';

type StyleOverrideProps = {
  accentColor: string;
  isSupporter: boolean;
  bgColor: boolean;
};

const lightOrDark = (color) => {
  // Variables for red, green, blue values
  let r, g, b;

  if (color) {
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
      );

      r = color[1];
      g = color[2];
      b = color[3];
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +(
        '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
      );

      r = color >> 16;
      g = (color >> 8) & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {
      return '#1E1E1E';
    } else {
      return '#ffffff';
    }
  }
};

const StyleOverride = ({
  accentColor,
  isSupporter,
  bgColor,
}: StyleOverrideProps) => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .btn.btn-read-more,
        .btn.btn-support,
        .private-support__btn > .btn {
          border-width: 0px;
          background-color: ${accentColor};
          color: ${lightOrDark(accentColor)};
        }
        .artist-header__title_flair,
        .artist-header__contributors  {
          background-color: ${accentColor};
          color: ${lightOrDark(accentColor)};
        }
        .artist-header.minimal,
        .artist-header__persons {
          border-color: ${accentColor};
        }
        .artist-header__supporters {
          border-top-color: ${accentColor};
        }
        .new-post button,
        .edit-page button,
        .artist-header__photo {
          background-color: ${accentColor};
          color: ${lightOrDark(accentColor)};
        }
        .new-post svg path,
        .edit-page svg path,
        .artist-header__play_svg svg path {
          fill: ${lightOrDark(accentColor)};
        }
        .btn.btn-read-more:hover,
        .btn.btn-support:hover,
        .private-support__btn > .btn:hover,
        .new-post button:hover,
        .edit-page button:hover {
          background-color: ${accentColor}CC;
        }
        .supporter__hover-card_bands_name a:hover {
          color: ${accentColor};
        }
        .artist-header__message_container button, {
          background-color: ${hexToRGB(accentColor, '.5')};
          color: ${lightOrDark(accentColor)};
        }
        .artist-header__message_container button:hover {
          background-color: ${hexToRGB(accentColor, '.7')};
        }
        ${bgColor &&
          `
          body { 
            background-color: ${hexToRGB(accentColor, '.2')} !important; 
          }
        `}
        ${isSupporter &&
          `
          .user-image { 
            border: 1px solid ${accentColor}; 
          }
          header .supporter-message { 
            display: inline-block !important; 
            color: ${accentColor}; 
          }
        `}
      `,
    }}
  />
);

export default StyleOverride;
