import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      elevation24: {
        boxShadow: 'none',
      },
      rounded: {
        borderRadius: '0px',
      },
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: '600px',
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderRadius: '0px',
      },
    },
    MuiButton: {
      textPrimary: {
        color: '$brand-primary',
      },
    },
  },

  typography: {
    fontFamily: 'Courier, Courier New, monospace',
    useNextVariants: true,
  },
});
