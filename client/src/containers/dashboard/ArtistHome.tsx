import * as React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import CardOverview from './CardOverview';
import CardPromote from './CardPromote';
import CardRoadMap from './CardRoadMap';
import CardWhatTo from './CardWhatTo';

interface ArtistHomeProps {
  userData: any;
  selectedArtist: any;
}

export const ArtistHome = ({ userData, selectedArtist }: ArtistHomeProps) => {
  const theme = createTheme({
    palette: {
      primary: { main: '#1E1E1E' },
    },
    overrides: {
      MuiCard: {
        root: {
          margin: '1rem 0rem',
          padding: '1rem',
          boxShadow: 'none',
          border: '1px solid #969696',
          maxWidth: '900px',
          alignSelf: 'flex-start',
          width: '100%',
          borderRadius: '0',
        },
      },
      MuiCardContent: {
        root: {
          padding: '0px',
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="dashboard__home">
        <span className="dashboard__home_title blue">My Account</span>
        <CardOverview selectedArtist={selectedArtist} />
        <span className="dashboard__home_title green">Resources</span>
        <CardRoadMap />
        <CardPromote selectedArtist={selectedArtist} />
        <CardWhatTo />
      </div>
    </ThemeProvider>
  );
};

export default ArtistHome;
