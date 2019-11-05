import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
        margin: '0px',
      },
      elevation24: {
        boxShadow: 'none',
      },
      rounded: {
        borderRadius: '0px',
      },
    },
    MuiDialog: {
      paper: {
        margin: '0px',
        maxHeight: '100%',
      },
      paperScrollPaper: {
        maxHeight: '100%',
      },
    },
  },
});
