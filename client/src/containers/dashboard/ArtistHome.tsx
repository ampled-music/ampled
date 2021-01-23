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
          margin: '1rem',
          padding: '1rem',
          boxShadow: 'none',
          border: '1px solid #969696',
          maxWidth: '600px',
          alignSelf: 'flex-start',
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
        <CardOverview selectedArtist={selectedArtist} />
        <CardStripe selectedArtist={selectedArtist} />
        <CardPromote selectedArtist={selectedArtist} />
        <CardRoadMap />
      </div>
    </ThemeProvider>
  );
};

export default ArtistHome;
