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
        backgroundColor: 'blue',
      },
    },
    MuiButton: {
      root: {
        color: 'black',
        backgroundColor: 'white',
        width: '100%',
        borderRadius: '0',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'black',
        transition: 'all .25s ease-in-out',
        maxWidth: '500px',
      },
    },
    MuiDialogActions: {
      root: {
        justifyContent: 'center',
        padding: '0px',
      },
    },
  },

  typography: {
    fontFamily: 'Courier, Courier New, monospace',
  },
});
