import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: { main: '#1E1E1E' },
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
        transform: 'rotate(-2deg)',
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
