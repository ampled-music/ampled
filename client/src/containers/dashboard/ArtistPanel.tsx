import * as React from 'react';

import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { Image, Transformation } from 'cloudinary-react';
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from '@material-ui/core';
import Plus from '../../images/icons/Icon_Add-New.svg';
import Edit from '../../images/icons/Icon_Edit.svg';

interface ArtistPanelProps {
  ownedPages: any;
  selectedArtist: any;
  openPostModal: () => void;
  handleChange: any;
}

export const ArtistPanel = ({
  ownedPages,
  selectedArtist,
  openPostModal = () => null,
  handleChange,
}: ArtistPanelProps) => {
  const { name, image, artistColor, artistSlug } = selectedArtist;

  return (
    <>
      <Image
        publicId={image}
        alt={name}
        key={name}
        className="dashboard__panel_image"
        style={{ borderColor: artistColor }}
      >
        <Transformation
          fetchFormat="auto"
          quality="auto"
          crop="fill"
          width={80}
          height={80}
          responsive_placeholder="blank"
        />
      </Image>

      {ownedPages.length > 1 ? (
        <FormControl>
          <Select
            id="artist-page-select"
            name="selectedArtist"
            value={selectedArtist}
            onChange={handleChange}
          >
            {ownedPages.map((page, index) => (
              <MenuItem value={page} key={`menu-key${index}`}>
                {page.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <div id="artist-page-select">{ownedPages[0].name}</div>
      )}

      {selectedArtist && (
        <div className="dashboard__panel_buttons">
          <Tooltip title="Add New Post">
            <IconButton
              onClick={openPostModal}
              className="dashboard__panel_buttons_plus"
              style={{ backgroundColor: artistColor }}
            >
              <ReactSVG className="icon icon_white" src={Plus} />
            </IconButton>
          </Tooltip>
          <Link to={`/artist/${artistSlug}/edit`}>
            <Tooltip title={`Edit ${name}`}>
              <IconButton
                className="dashboard__panel_buttons_settings"
                style={{ backgroundColor: artistColor }}
              >
                <ReactSVG className="icon icon_white" src={Edit} />
              </IconButton>
            </Tooltip>
          </Link>
        </div>
      )}
    </>
  );
};

export default ArtistPanel;
