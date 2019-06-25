import { createMuiTheme } from '@material-ui/core/styles';
import background from '../../../images/background_post.svg';

const defaultTheme = createMuiTheme();

export const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        background: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        paddingTop: '93px',
        backgroundColor: 'initial',
        [defaultTheme.breakpoints.down('sm')]: {
          background: 'white',
          paddingTop: '0px'
        },
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
