import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Button from 'material-ui/Button';
import App from './App';

const theme = createMuiTheme({
  overrides: {
    // MuiButton: {
    //   // Name of the styleSheet
    //   root: {
    //     // Name of the rule
    //     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    //     borderRadius: 3,
    //     border: 0,
    //     color: 'white',
    //     height: 48,
    //     padding: '0 30px',
    //     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
    //   },
    // },
    MuiIconButton:{
      color:"inherit"
    },
    MuiButton:{
      root:{
        color:"inherit"
      }
    }
  },
});

function AppWithTheme() {
  return (
    <MuiThemeProvider theme={theme}>
      <App/>
    </MuiThemeProvider>
  );
}

export default AppWithTheme;
