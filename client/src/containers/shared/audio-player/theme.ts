import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  overrides: {
    MuiSlider: {
      root: {
        padding: 0,
      },
      thumb: {
        width: 2,
        backgroundColor: '#fff',
        borderRadius: 0,
        marginLeft: -2,
        '&:focus,&:hover,&$active': {
          boxShadow: 'inherit',
        },
      },
      valueLabel: {
        backgroundColor: '#fff',
        width: 'auto',
        fontSize: '.7rem',
        top: 0,
        left: '1px',
        paddingLeft: '.5rem',
      },
    },
  },
});
