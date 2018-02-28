import React, { Component } from "react";
import { BeatLoader } from "halogenium";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from "material-ui/Progress";
import cn from "classnames";
import Footer from "./Footer";
import ReadingProgressSlider from "./ReadingProgressSlider";

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
    width: "100%"
    // height: 64
  },
  slider: {
    width: "100%",
    padding:"20px 20px 20px 20px",
    backgroundColor:"#EEEEEE",
    borderTop:"1px solid #616161"
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
    },
    columnGap: "10px!important"
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
  },
  loadingWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

class EbookFrame extends Component {
  render() {
    const {
      classes,
      onBtnPrevClicked,
      onBtnNextClicked,
      isLoading,
      readingProgress,
      onSliderChange,
      onSliderAfterChange
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

          {isLoading && (
            <div className={classes.loadingWrapper}>
              <BeatLoader color="#26A65B" size="16px" margin="4px" />
              {/* <CircularProgress/> */}
            </div>
          )}
        </div>
        <div className={classes.footer}>
          <Footer readingProgress={readingProgress} />
        </div>
        <div className={classes.slider}>
          <ReadingProgressSlider
            readingProgress={readingProgress}
            onChange={onSliderChange}
            onAfterChange={onSliderAfterChange}
          />
        </div>
      </div>
    );
  }
}

EbookFrame = withStyles(styles)(EbookFrame);
export default EbookFrame;
