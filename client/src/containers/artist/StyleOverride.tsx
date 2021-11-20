import * as React from 'react';
import { hexToRGB, lightOrDark } from '../../styles/utils';

type StyleOverrideProps = {
  accentColor: string;
  isSupporter?: boolean;
  bgColor?: boolean;
};

const StyleOverride = ({
  accentColor,
  isSupporter = false,
  bgColor = false,
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
        .artist-header__photo,
        .artist-header__banner-icons_icon.active {
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
        .artist-header__message_container button {
          background-color: ${hexToRGB(accentColor, '.5')};
          color: ${lightOrDark(accentColor)};
        }
        .artist-header__message_container button:hover {
          background-color: ${hexToRGB(accentColor, '.7')};
        }
        .dashboard__panel_buttons .icon svg,
        .dashboard__panel_buttons .icon svg path {
          fill: ${lightOrDark(accentColor)};
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
