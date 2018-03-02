import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Button from 'material-ui/Button';
import App from './App';

import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadSettings } from "../actions";

import { settingOptions } from '../constants';


class AppWithTheme extends Component {

  componentWillMount() {
    this.props.loadSettings();
  }

  render() {
    const { settings } = this.props;
    if (!settings) return null;

    const { fonts, themes } = settingOptions;
    var font = settingOptions.fonts[settings.font] || fonts.ArbutusSlab;
    var theme = settingOptions.themes[settings.theme] || themes.SepiaLight;

    const themeType = theme.light ? "light" : "dark";
    const muiTheme = createMuiTheme({
      palette: {
        type: themeType,
      }
    });

    return (
      <MuiThemeProvider theme={muiTheme}>
        <App />
      </MuiThemeProvider>
    );
  }
}

// AppWithTheme = withStyles(styles)(AppWithTheme);

const mapStateToProps = ({ settings }) => {
  return { settings };
};

export default connect(mapStateToProps, { loadSettings })(AppWithTheme);
