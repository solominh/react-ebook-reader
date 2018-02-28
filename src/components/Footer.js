import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import TOCIcon from "material-ui-icons/Menu";
const styles = theme => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: 8
  },
  spacing: {
    flex: 1
  },
  readingProgress:{
    cursor:"pointer"
  }
});

class Footer extends Component {
  render() {
    const { classes, readingProgress, onReadingProgressClick } = this.props;
    return (
      <div className={classes.wrapper}>
        <TOCIcon />
        <div className={classes.spacing} />
        <div
          className={classes.readingProgress}
          onClick={onReadingProgressClick}
        >{`${readingProgress ? readingProgress.toFixed(2) : 0} %`}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
