import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: { main: '#1E1E1E' },
    secondary: { main: '#1E1E1E' },
  },
  overrides: {
    MuiInputBase: {
      root: {
        marginBottom: '1rem',
      },
      input: {
        fontFamily: 'Courier, Courier New, monospace',
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
      },
    },
    MuiTab: {
      root: {
        fontFamily: 'LL Replica Bold Web, sans-serif',
      },
    },
    MuiTabs: {
      flexContainer: {
        backgroundColor: '#ffffff',
        color: '#000000',
      },
    },
  },

  typography: {
    fontFamily: 'Courier, Courier New, monospace',
  },
});
