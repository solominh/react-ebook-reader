import React, { Component } from "react";
import TOCIcon from "material-ui-icons/Menu";
import MoreIcon from "material-ui-icons/MoreHoriz";
import IconButton from "material-ui/IconButton";
import Tooltip from "material-ui/Tooltip";

import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clickReadingProgress, toggleTOC, toggleMoreView } from "../actions";

const styles = theme => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    // padding: 8
  },
  moreMenu: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  readingProgress: {
    flex: 1,
    fontSize: "0.7rem!important",
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
  },
});

class Footer extends Component {
  render() {
    const {
      classes,
      readingProgress,
      clickReadingProgress,
      toggleTOC,
      toggleMoreView
    } = this.props;
    return (
      <div className={classes.wrapper}>
        <div style={{ flex: 1 }}>
          <Tooltip title="Table of contents" placement="top"  enterDelay={300}>
            <IconButton className={classes.button} aria-label="Open TOC" style={{ flex: 1 }} onClick={toggleTOC} >
              <TOCIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.moreMenu} >
          <Tooltip title="More" placement="top"  enterDelay={300}>
            <IconButton className={classes.button} aria-label="Open more menu" onClick={toggleMoreView} >
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.readingProgress}>
          <Tooltip title="Open reading progress slider" placement="top"  enterDelay={300}>
            <IconButton className={classes.button} aria-label="Open reading progress slider"
              style={{ width: "80px" }}
              onClick={clickReadingProgress}>
              <span style={{ fontSize: "0.8rem" }}>{`${readingProgress ? readingProgress.toFixed(2) : 0} %`} </span>
            </IconButton >
          </Tooltip>
        </div >
      </div >
    );
  }
}

Footer = withStyles(styles)(Footer);

const mapStateToProps = ({ readingProgress }) => {
  return { readingProgress };
};

export default connect(mapStateToProps, {
  clickReadingProgress,
  toggleTOC,
  toggleMoreView
})(Footer);
