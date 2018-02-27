import React, { Component } from "react";
import { BeatLoader } from "halogenium";
import { withStyles } from "material-ui/styles";
import cn from "classnames";

const styles = theme => ({
  main: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  area: {
    width: "80%",
    height: "80%",
    margin: "5% auto",
    maxWidth: 1250,
    "& iframe": {
      border: "none"
    }
  },
  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -32,
    fontSize: 64,
    color: "#E2E2E2",
    fontFamily: "arial, sans-serif",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      color: "#777"
    },
    "&:active": {
      color: "#000"
    }
  },
  prev: {
    left: 40
  },
  next: {
    right: 40
  }
});

class EbookFrame extends Component {
  render() {
    const {
      classes,
      onBtnPrevClicked,
      onBtnNextClicked,
      isLoading
    } = this.props;
    return (
      <div className={classes.main}>
        <div
          className={cn(classes.prev, classes.arrow)}
          onClick={onBtnPrevClicked}
        >
          ‹
        </div>
        <div id="area" className={classes.area} />
        <div
          className={cn(classes.next, classes.arrow)}
          onClick={onBtnNextClicked}
        >
          ›
        </div>

        {isLoading && <BeatLoader color="#26A65B" size="16px" margin="4px" />}
      </div>
    );
  }
}

EbookFrame = withStyles(styles)(EbookFrame);
export default EbookFrame;
