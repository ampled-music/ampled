// import './artist.scss';

import * as React from 'react';

class CommunityShare extends React.Component<any> {
  render() {
    const share_square_images = [
      {
        name: 'Community Share 1',
        url:
          'https://res.cloudinary.com/ampled-web/image/upload/v1602018717/social/Community/CommunityShare_Grid_1.png',
      },
      {
        name: 'Community Share 2',
        url:
          'https://res.cloudinary.com/ampled-web/image/upload/v1602018717/social/Community/CommunityShare_Grid_2.png',
      },
      {
        name: 'Community Share 3',
        url:
          'https://res.cloudinary.com/ampled-web/image/upload/v1602018717/social/Community/CommunityShare_Grid_3.png',
      },
    ];
    const share_story_images = [
      {
        name: 'Community Share 1',
        url:
          'https://res.cloudinary.com/ampled-web/image/upload/v1602018717/social/Community/CommunityShare_Story_1.png',
      },
      {
        name: 'Community Share 2',
        url:
          'https://res.cloudinary.com/ampled-web/image/upload/v1602018717/social/Community/CommunityShare_Story_2.png',
      },
      {
        name: 'Community Share 3',
        url:
          'https://res.cloudinary.com/ampled-web/image/upload/v1602018716/social/Community/CommunityShare_Story_3.png',
      },
    ];

    return (
      <div className="artist-promote container">
        <h1>Share that you're a member!</h1>
        <p>
          Post these images on Instagram to help spread the word and remember to
          tag{' '}
          <a
            href="https://www.instagram.com/ampl3d/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ampl3d
          </a>{' '}
          so we can repost.
        </p>
        <h2>Instagram Post</h2>
        <div className="row">
          {share_square_images &&
            share_square_images.map((image, index) => (
              <div className="col-md-4" key={`share_square_${index}`}>
                <a
                  download={image.name}
                  href={image.url}
                  title={image.name}
                  rel="noopener noreferrer"
                >
                  <img src={image.url} alt={image.name} />
                </a>
              </div>
            ))}
        </div>
        <h2>Instagram Story</h2>
        <div className="row">
          {share_story_images &&
            share_story_images.map((image, index) => (
              <div className="col-md-4" key={`share_story_${index}`}>
                <a
                  download={image.name}
                  href={image.url}
                  title={image.name}
                  rel="noopener noreferrer"
                >
                  <img src={image.url} alt={image.name} />
                </a>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export { CommunityShare };
