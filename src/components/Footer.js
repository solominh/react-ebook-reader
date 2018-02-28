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
  }
});

class Footer extends Component {
  render() {
    const { classes, readingProgress } = this.props;
    return (
      <div className={classes.wrapper}>
        <TOCIcon />
        <div className={classes.spacing} />
        <div>{`${readingProgress ? (readingProgress*100).toFixed(2) : "*"}%`}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
