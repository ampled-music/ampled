import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
      },
      elevation24: {
        boxShadow: 'none',
      },
      rounded: {
        borderRadius: '0px',
      },
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: '670px',
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderRadius: '0px',
      },
    },
    MuiFormLabel: {
      root: {
        focused: {
          color: '$brand-primary',
        },
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: '#eeeeee',
      },
      barColorPrimary: {
        backgroundColor: '$brand-primary',
      },
    },
  },

  typography: {
    fontFamily: 'Courier, Courier New, monospace',
  },
});
