import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import TOCIcon from "material-ui-icons/Menu";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clickReadingProgress } from "../actions";


const styles = theme => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: 8
  },
  spacing: {
    flex: 1
  },
  readingProgress: {
    cursor: "pointer"
  }
});

class Footer extends Component {
  render() {
    const { classes, readingProgress, clickReadingProgress } = this.props;
    return (
      <div className={classes.wrapper}>
        <TOCIcon />
        <div className={classes.spacing} />
        <div
          className={classes.readingProgress}
          onClick={clickReadingProgress}
        >{`${readingProgress ? readingProgress.toFixed(2) : 0} %`}</div>
      </div>
    );
  }
}

Footer = withStyles(styles)(Footer);

const mapStateToProps = ({ readingProgress }) => {
  return { readingProgress };
};

export default connect(mapStateToProps, {
  clickReadingProgress
})(Footer);
