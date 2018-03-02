import React, { Component } from 'react';

import { withStyles } from "material-ui/styles";
import SettingsIcon from "material-ui-icons/Settings";
import InfoIcon from "material-ui-icons/Info";
import SearchIcon from "material-ui-icons/Search";
import OpenFileIcon from "material-ui-icons/FileUpload";
import IconButton from "material-ui/IconButton";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clickReadingProgress, toggleTOC } from "../actions";

const styles = theme => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    // padding: 8
  },
})

class MoreView extends Component {
  render() {
    const {classes}=this.props
    return (
      <div>
          <IconButton>
            <InfoIcon/>
          </IconButton>
          <IconButton>
            <SearchIcon/>
          </IconButton>
          <IconButton>
            <SettingsIcon/>
          </IconButton>
          <IconButton>
            <OpenFileIcon/>
          </IconButton>
      </div>
    );
  }
}


MoreView = withStyles(styles)(MoreView);

const mapStateToProps = ({ readingProgress }) => {
  return { readingProgress };
};

export default connect(mapStateToProps, {
})(MoreView);
