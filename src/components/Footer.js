import React, { Component } from "react";
import TOCIcon from "material-ui-icons/Menu";
import MoreIcon from "material-ui-icons/MoreHoriz";
import IconButton from "material-ui/IconButton";

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
  }
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
          <IconButton aria-label="Open TOC" style={{ flex: 1 }} onClick={toggleTOC} >
            <TOCIcon />
          </IconButton>
        </div>
        <div className={classes.moreMenu} >
          <IconButton aria-label="Open more menu" onClick={toggleMoreView} >
            <MoreIcon />
          </IconButton>
        </div>
        <div className={classes.readingProgress}>
          <IconButton aria-label="Open reading progress slider"
            style={{ width: "80px" }}
            onClick={clickReadingProgress}>
            <span style={{ fontSize: "0.8rem" }}>{`${readingProgress ? readingProgress.toFixed(2) : 0} %`} </span>
          </IconButton >
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
