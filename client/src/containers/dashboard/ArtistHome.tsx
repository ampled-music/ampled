import * as React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CardOverview from './CardOverview';
import CardStripe from './CardStripe';
import CardPromote from './CardPromote';
import CardRoadMap from './CardRoadMap';

interface ArtistHomeProps {
  userData: any;
  selectedArtist: any;
}

export const ArtistHome = ({ userData, selectedArtist }: ArtistHomeProps) => {
  const theme = createMuiTheme({
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
        <CardStripe selectedArtist={selectedArtist} />
        <h2>My Account</h2>
        <CardOverview selectedArtist={selectedArtist} />
        <h2>Resources</h2>
        <CardRoadMap />
        <CardPromote selectedArtist={selectedArtist} />
      </div>
    </ThemeProvider>
  );
};

export default ArtistHome;
