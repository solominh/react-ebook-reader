import React, { Component } from "react";
import { BeatLoader } from "halogenium";
import { withStyles } from "material-ui/styles";
import cn from "classnames";
import Footer from "./Footer";

const styles = theme => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  readingArea: {
    position: "relative",
    flex: 1,
    width: "100%"
  },
  footer: {
    width: "100%",
    height: 64
  },
  textWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    padding: 20,
    margin: "0px auto",
    // maxWidth: 1250,
    "& iframe": {
      border: "none"
    }
  },
  navWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "stretch"
  },
  navMiddle: {
    flex: 1
  },
  arrowWrapper: {
    width: "40%",
    height: "100%",
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
    },
    display: "flex",
    alignItems: "center"
  },
  arrowWrapperLeft: {
    justifyContent: "flex-start"
  },
  arrowWrapperRight: {
    justifyContent: "flex-end"
  },
  arrowLeft: {
    marginLeft: 50
  },
  arrowRight: {
    marginRight: 50
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
      <div className={classes.wrapper}>
        <div className={classes.readingArea}>
          <div className={classes.textWrapper} id="area" />
          <div className={classes.navWrapper}>
            <div
              className={cn(classes.arrowWrapper, classes.arrowWrapperLeft)}
              onClick={onBtnPrevClicked}
            >
              <div className={classes.arrowLeft}>‹</div>
            </div>
            <div className={classes.navMiddle} />

            <div
              className={cn(classes.arrowWrapper, classes.arrowWrapperRight)}
              onClick={onBtnNextClicked}
            >
              <div className={classes.arrowRight}>›</div>
            </div>
          </div>

          {isLoading && <BeatLoader color="#26A65B" size="16px" margin="4px" />}
        </div>
        <div className={classes.footer}>
          <Footer />
        </div>
      </div>
    );
  }
}

EbookFrame = withStyles(styles)(EbookFrame);
export default EbookFrame;
