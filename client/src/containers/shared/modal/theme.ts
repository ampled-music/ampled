import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: { main: '#1E1E1E' },
  },
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
        marginBottom: '1rem',
      },
    },
    MuiInputBase: {
      input: {
        fontFamily: 'LL Replica Light Web, sans-serif'
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
        textTransform: 'initial',
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
