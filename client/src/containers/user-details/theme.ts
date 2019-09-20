import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: { main: '#1E1E1E' },
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
    },

    typography: {
        fontFamily: 'Courier, Courier New, monospace',
    },
});
