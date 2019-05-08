import { createMuiTheme } from '@material-ui/core/styles';
import background from '../../../images/background_post.svg';

export const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        background: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        paddingTop: '93px',
        backgroundColor: 'initial',
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
      focused: {
        color: '$brand-primary !important',
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
    useNextVariants: true,
  },
});
