import React, { Component } from 'react';

import { withStyles } from "material-ui/styles";
import SettingsIcon from "material-ui-icons/Settings";
import InfoIcon from "material-ui-icons/Info";
import SearchIcon from "material-ui-icons/Search";
import OpenEbookIcon from "material-ui-icons/FileUpload";
import IconButton from "material-ui/IconButton";
import Tooltip from "material-ui/Tooltip";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectEbook, toggleBookInfo, toggleSettings, toggleSearch } from "../actions";

import Dropzone from "react-dropzone";


const styles = theme => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    // padding: 8
  },
  openFile: {
    display: "inline-block"
  }
})

class MoreView extends Component {


  onDrop = (files) => {
    console.log(files);
    if (files.length === 0) return;
    this.props.selectEbook(files[0])
  }

  render() {
    const { classes, toggleBookInfo, toggleSettings, toggleSearch } = this.props
    return (
      <div>
        <Tooltip title="Book info" placement="top">
          <IconButton onClick={toggleBookInfo}>
            <InfoIcon />
          </IconButton>
        </Tooltip>

        {/* <Tooltip title="Search" placement="top">
          <IconButton onClick={toggleSearch}>
            <SearchIcon />
          </IconButton>
        </Tooltip> */}

        <Tooltip title="Settings" placement="top">
          <IconButton onClick={toggleSettings}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Open ebook" placement="top">
          <Dropzone
            className={classes.openFile}
            accept="application/epub+zip"
            onDrop={this.onDrop}
          >
            <IconButton>
              <OpenEbookIcon />
            </IconButton>
          </Dropzone>
        </Tooltip>
      </div>
    );
  }
}


MoreView = withStyles(styles)(MoreView);

const mapStateToProps = ({ readingProgress }) => {
  return { readingProgress };
};

export default connect(mapStateToProps, {
  selectEbook,
  toggleBookInfo,
  toggleSettings,
  toggleSearch
})(MoreView);
