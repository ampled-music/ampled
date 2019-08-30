import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    overrides: {
        MuiSlider: {
            root: {
                height: 20,
                padding: 0,
            },
            thumb: {
                height: 35,
                width: 2,
                backgroundColor: '#fff',
                borderRadius: 0,
                marginTop: -15,
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
            track: {
                height: 20,
            },
            rail: {
                height: 20,
            },
        },
        MuiIconButton: {
            root: {
                width: '70px',
                height: '70px',
            },
        },
    },
});
