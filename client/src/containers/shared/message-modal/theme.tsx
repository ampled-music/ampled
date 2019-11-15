import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: { main: '#1E1E1E' },
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
        backgroundImage: 'url(/static/media/background_paper_lg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'scroll',
      },
      elevation24: {
        boxShadow: '0 0 0 transparent',
      },
      rounded: {
        borderRadius: '0px',
      }
    },
  },
});
