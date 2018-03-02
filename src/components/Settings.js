import React, { Component } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';

import { withStyles } from 'material-ui/styles';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSettings, resetSettings } from "../actions";

import { settingOptions } from '../constants';

const styles = theme => ({
  formControl: {
    display: "flex!important",
    // flexDirection: "row!important",
    // flexWrap: "wrap",
    alignItems: "center"
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize:"1rem",
    flex: 1
  },
  select: {
    flex: 2
  }
})

class Settings extends Component {

  handleChange = (settingType) => {
    return (e) => {
      const { settings, updateSettings } = this.props;
      const newSettings = {
        ...settings,
        [settingType]: e.target.value
      }
      updateSettings(newSettings)
    }
  }

  render() {
    const { classes, settings, updateSettings, resetSettings } = this.props
    const { fonts, themes, lineHeights, margins, fontSizes } = settingOptions;

    return (
      <div>
        <div className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor="font-setting">Font</InputLabel>
          <Select
            className={classes.select}
            value={settings.font}
            onChange={this.handleChange("font")}
            inputProps={{
              id: 'font-setting',
            }}
          >
            {Object.keys(fonts).map(font => {
              return (
                <MenuItem key={font} value={font}>{fonts[font].label}</MenuItem>
              )
            })}
          </Select>
        </div>

        <div className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor="theme-setting">Theme</InputLabel>
          <Select
            className={classes.select}
            value={settings.theme}
            onChange={this.handleChange("theme")}
            inputProps={{
              id: 'theme-setting',
            }}
          >
            {Object.keys(themes).map(theme => {
              return (
                <MenuItem key={theme} value={theme}>{themes[theme].label}</MenuItem>
              )
            })}
          </Select>
        </div>

        <div className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor="line-height-setting">Line spacing</InputLabel>
          <Select
            className={classes.select}
            value={settings["line-height"]}
            onChange={this.handleChange("line-height")}
            inputProps={{
              id: 'line-height-setting',
            }}
          >
            {lineHeights.map(value => {
              return (
                <MenuItem key={value} value={value}>{value}</MenuItem>
              )
            })}
          </Select>
        </div>

        <div className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor="font-size-setting">Font size</InputLabel>
          <Select
            className={classes.select}
            value={settings["font-size"]}
            onChange={this.handleChange("font-size")}
            inputProps={{
              id: 'font-size-setting',
            }}
          >
            {fontSizes.map(value => {
              return (
                <MenuItem key={value} value={value}>{`${value}`}</MenuItem>
              )
            })}
          </Select>
        </div>

        <div className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor="margin-setting">Margin</InputLabel>
          <Select
            className={classes.select}
            value={settings["margin"]}
            onChange={this.handleChange("margin")}
            inputProps={{
              id: 'margin-setting',
            }}
          >
            {margins.map(value => {
              return (
                <MenuItem key={value} value={value}>{`${value}%`}</MenuItem>
              )
            })}
          </Select>
        </div>
        <Button color="primary" onClick={resetSettings}>
          Reset settings
        </Button>
      </div>
    );
  }
}

Settings = withStyles(styles)(Settings);

const mapStateToProps = ({ settings }) => {
  return { settings };
};

export default connect(mapStateToProps, {
  updateSettings,
  resetSettings
})(Settings);
