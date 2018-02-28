import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import TOCIcon from "material-ui-icons/Menu";
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
  spacing: {
    flex: 1
  },
  readingProgress: {
    fontSize:"1rem",
  }
});

class Footer extends Component {
  render() {
    const {
      classes,
      readingProgress,
      clickReadingProgress,
      toggleTOC
    } = this.props;
    return (
      <div className={classes.wrapper}>
        <IconButton aria-label="Open TOC" onClick={toggleTOC} >
          <TOCIcon />
        </IconButton>
        <div className={classes.spacing} />

        <IconButton aria-label="Open TOC" style={{width:"80px"}} onClick={clickReadingProgress}>
          <div className={classes.readingProgress}>{`${
            readingProgress ? readingProgress.toFixed(2) : 0
          } %`}</div>
        </IconButton>
      </div>
    );
  }
}

Footer = withStyles(styles)(Footer);

const mapStateToProps = ({ readingProgress }) => {
  return { readingProgress };
};

export default connect(mapStateToProps, {
  clickReadingProgress,
  toggleTOC
})(Footer);
