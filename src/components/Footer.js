import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import TOCIcon from "material-ui-icons/Menu";
const styles = theme => ({
  wrapper: {
    display: "flex",
    alignItems:"center"
  },
  spacing: {
    flex: 1
  }
});

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <TOCIcon />
        <div className={classes.spacing}>...</div>
        <div>{"10%"}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
