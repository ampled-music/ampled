import * as React from 'react';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ArtistSocial extends React.Component<any> {
  adjustedBackgroundColor = (accentColor: string, opacity = 0.2) => {
    // @accentColor: RGB eg 'aabbcc' *NOT* RGBA
    // @opacity: float e.g. 0.2 for 20%
    // e.g. adjustedBackgroundColor('aabbcc', 0.2); => 'f8f2ee'
    if (accentColor.charAt(0) === '#') {
      accentColor = accentColor.substr(1, 6);
    }
    const adjustedChannel = (hex) =>
      (Math.round(parseInt(hex, 16) * opacity) + (1 - opacity) * 255).toString(
        16,
      );
    const r = adjustedChannel(accentColor.substr(0, 2));
    const g = adjustedChannel(accentColor.substr(2, 2));
    const b = adjustedChannel(accentColor.substr(4, 2));

    return `${r}${g}${b}`;
  };

  handlePublicID = (image: string) => {
    if (!image) {
      return '';
    }
    const url = image.split('/');
    const part_1 = url[url.length - 2];
    const part_2 = url[url.length - 1];
    return part_1 + '/' + part_2;
  };

  buildBrokenName = (artistname: string) => {
    const broken_name = artistname.split(' ');
    const name_array = [];
    let name_string = '';

    for (let index = 0; index < broken_name.length; index++) {
      if (broken_name[index].length >= 7) {
        // Words longer than 6 get their own line
        if (name_string) {
          // If there is a string being built, push that before the next Word
          name_array.push(name_string.trim());
          name_string = '';
        }
        name_array.push(broken_name[index]);
      } else if (broken_name[index].length < 7) {
        // Build string of small words
        name_string += broken_name[index] + ' ';
        if (name_string.length > 10) {
          // If its a small word continue loop
          if (broken_name[index].length < 3) {
            continue;
          }
          // Push built string of small word once its over 10
          name_array.push(name_string.trim());
          name_string = '';
        } else if (index === broken_name.length - 1) {
          // If its the last word push whats left in the string
          name_array.push(name_string.trim());
          name_string = '';
        }
      } else {
        if (name_string) {
          // If there is a string being built, push that before the next Word
          name_array.push(name_string.trim());
          name_string = '';
        }
        name_array.push(broken_name[index]);
      }
    }
    return name_array;
  };

  handleBrokenName = (
    fullname: string,
    position: string,
    x: number,
    y: number,
    distance: number,
    font_size: number,
    color: string,
    bg: string,
  ) => {
    const broken_name = this.buildBrokenName(fullname);
    let y_index = y;
    let name_part = '';
    let new_font_size = font_size;
    let new_distance = distance;

    if (broken_name.length < 5) {
      // Font size for long names
      if (broken_name.length >= 4) {
        new_font_size = font_size / 1.2;
        new_distance = distance / 1.2;
      }
      // Grid 2
      if (position === 'center' && x === 0 && y === -180) {
        for (let index = 0; index < broken_name.length; index++) {
          y_index = index === 0 ? y_index : y_index - distance / 2;
        }
      }
      // Story 2
      if (position === 'center' && x === 0 && y === -400) {
        for (let index = 0; index < broken_name.length; index++) {
          y_index = index === 0 ? y_index : y_index - 60;
        }
      }
      // Cycle through and build text plate
      for (let index = 0; index < broken_name.length; index++) {
        name_part += `l_text:Arial_${new_font_size}_bold:%20${encodeURIComponent(
          broken_name[index],
        )}%20,co_rgb:${color},b_rgb:${bg},g_${position},x_${x},y_${y_index}/`;
        y_index += Math.round(new_distance);
      }
      return name_part;
    } else {
      return '';
    }
  };

  renderSocialImages = (artist) => {
    if (!artist.image) {
      return;
    }
    const BASE_UPLOAD_URL =
      'https://res.cloudinary.com/ampled-web/image/upload';
    let color = artist.artistColor;
    color = color.replace('#', '');
    const cleanArtistName = artist.name
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const promoteSquare = [];
    const promoteStory = [];
    const promoteFacebook = [];

    // Facebook
    promoteFacebook.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_630,w_1200/c_scale,g_south_east,l_social:AmpledLogo,w_200,x_50,y_50/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          50,
          50,
          55,
          45,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Facebook.jpg`,
      description: '',
    });
    // if (promoteFacebook.length > 0) {
    //   console.log(promoteFacebook);
    // }

    // Square
    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_1500,w_1500/l_social:Grid:Grid1/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          160,
          80,
          65,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Grid1.jpg`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/`,
        this.handleBrokenName(
          artist.name,
          'center',
          0,
          -180,
          100,
          75,
          'ffffff',
          '202020',
        ),
        `social/Grid/Grid2.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid2.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Grid/Grid3.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid3.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Grid/Grid4.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid4.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Grid/Grid5.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid5.png`,
      description: '',
    });

    promoteSquare.push({
      url: [
        BASE_UPLOAD_URL,
        `/l_text:Arial_55_bold:%20ampled.com%252Fartist%252F${artist.artistSlug}%20,co_rgb:ffffff,b_rgb:202020,g_south,y_380/`,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Grid/Grid6.png`,
      ].join(''),
      name: `${cleanArtistName}_Grid6.png`,
      description: '',
    });

    // Story
    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_2666,w_1500/l_social:Story:StoryBlank/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          160,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_StoryBlank.jpg`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_2666,w_1500/l_social:Story:Story1/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          210,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Story1.jpg`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/`,
        this.handleBrokenName(
          artist.name,
          'center',
          0,
          -400,
          120,
          85,
          'ffffff',
          '202020',
        ),
        `social/Story/Story2.png`,
      ].join(''),
      name: `${cleanArtistName}_Story2.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Story/Story3.png`,
      ].join(''),
      name: `${cleanArtistName}_Story3.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Story/Story4.png`,
      ].join(''),
      name: `${cleanArtistName}_Story4.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Story/Story5.png`,
      ].join(''),
      name: `${cleanArtistName}_Story5.png`,
      description: '',
    });

    promoteStory.push({
      url: [
        BASE_UPLOAD_URL,
        `/l_text:Arial_60_bold:%20ampled.com%252Fartist%252F${artist.artistSlug}%20,co_rgb:ffffff,b_rgb:202020,g_center,y_100/`,
        `/b_rgb:${this.adjustedBackgroundColor(color)}/social/Story/Story6.png`,
      ].join(''),
      name: `${cleanArtistName}_Story6.png`,
      description: '',
    });

    return (
      <div>
        <div className="details__info_title">Promote Your Page</div>
        <div className="row no-gutters">
          <div className="col-6">
            <div className="details__info_title sm">Square</div>
            <div className="details__promote_container">
              {promoteSquare.map((promoImage) => (
                <a
                  key={promoImage.name}
                  className="details__promote_link"
                  href={promoImage.url}
                  download={promoImage.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faImage} title={promoImage.name} />
                </a>
              ))}
            </div>
          </div>
          <div className="col-6">
            <div className="details__info_title sm">Stories</div>
            <div className="details__promote_container">
              {promoteStory.map((promoImage) => (
                <a
                  key={promoImage.name}
                  className="details__promote_link"
                  href={promoImage.url}
                  download={promoImage.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faImage} title={promoImage.name} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderSupporterShareImages = (artist) => {
    const BASE_UPLOAD_URL =
      'https://res.cloudinary.com/ampled-web/image/upload';
    const cleanArtistName = artist.name
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const supportShare = [];

    // Square
    supportShare.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_1500,w_1500/l_social:Supporter:Grid/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          160,
          80,
          65,
          'ffffff',
          '202020',
        ),
        `/l_text:Arial_60_bold:%20ampled.com%252Fartist%252F${artist.artistSlug}%20,co_rgb:ffffff,b_rgb:202020,g_south_east,y_280,x_100/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Grid.jpg`,
      description: '',
    });

    // Story
    supportShare.push({
      url: [
        BASE_UPLOAD_URL,
        `/c_fill,h_2666,w_1500/l_social:Supporter:Story/`,
        this.handleBrokenName(
          artist.name,
          'north_west',
          220,
          270,
          100,
          85,
          'ffffff',
          '202020',
        ),
        `/l_text:Arial_65_bold:%20ampled.com%252Fartist%252F${artist.artistSlug}%20,co_rgb:ffffff,b_rgb:202020,g_south,y_500/`,
        this.handlePublicID(artist.image),
      ].join(''),
      name: `${cleanArtistName}_Story.jpg`,
      description: '',
    });

    return (
      <div>
        <div className="details__info_title">Promote This Page</div>
        <div className="row">
          <div className="col-12">
            <div className="details__promote_container">
              {supportShare.map((promoImage) => (
                <a
                  key={promoImage.name}
                  className="details__promote_link"
                  href={promoImage.url}
                  download={promoImage.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faImage} title={promoImage.name} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export { ArtistSocial };
