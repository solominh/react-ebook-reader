import React, { Component } from "react";
import { BeatLoader } from "halogenium";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from "material-ui/Progress";
import cn from "classnames";
import Footer from "./Footer";
import ReadingProgressSlider from "./ReadingProgressSlider";
import Collapse from "material-ui/transitions/Collapse";
import Slide from "material-ui/transitions/Slide";
import TOC from "./TOC";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clickPrevButton, clickNextButton, gotoChapter } from "../actions";

const TOCWidth = 240;

const styles = theme => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "stretch"
  },
  contentWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  TOCWrapper: {
    width: TOCWidth,
    height: "100%",
    visibility: "hidden",
    marginLeft: -TOCWidth,
    backgroundColor: "#FFFFFF",
    border: "1px solid #eee",
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  TOCWrapperOpen: {
    visibility: "visible",
    marginLeft: 0
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
    padding: "20px 20px 20px 20px",
    backgroundColor: "#EEEEEE",
    borderTop: "1px solid #616161"
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
      book,
      currentChapterIndex,
      isLoading,
      isReadingProgressSliderOpen,
      isTOCOpen,
      clickPrevButton,
      clickNextButton,
      gotoChapter
    } = this.props;

    const toc = book ? book.toc : null;
    console.log(currentChapterIndex);

    return (
      <div className={classes.wrapper}>
        {/* <Slide direction="right" in={isTOCOpen}>
          <div className={classes.TOCWrapper}>abc</div>
        </Slide> */}
        <div
          className={cn(classes.TOCWrapper, {
            [classes.TOCWrapperOpen]: isTOCOpen
          })}
        >
          <TOC
            data={toc}
            selectedItem={currentChapterIndex}
            onItemSelected={gotoChapter}
          />
        </div>


        <div className={classes.contentWrapper}>
          <div className={classes.readingArea}>
            <div className={classes.textWrapper} id="area" />
            <div className={classes.navWrapper}>
              <div
                className={cn(classes.arrowWrapper, classes.arrowWrapperLeft)}
                onClick={clickPrevButton}
              >
                <div className={classes.arrowLeft}>‹</div>
              </div>
              <div className={classes.navMiddle} />

              <div
                className={cn(classes.arrowWrapper, classes.arrowWrapperRight)}
                onClick={clickNextButton}
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
            <Footer />
          </div>
          <Collapse in={isReadingProgressSliderOpen}>
            <div className={classes.slider}>
              <ReadingProgressSlider />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

EbookFrame = withStyles(styles)(EbookFrame);

const mapStateToProps = ({
  book,
  currentChapterIndex,
  isLoading,
  isReadingProgressSliderOpen,
  isTOCOpen
}) => {
  return {
    book,
    currentChapterIndex,
    isLoading,
    isReadingProgressSliderOpen,
    isTOCOpen
  };
};

export default connect(mapStateToProps, {
  clickPrevButton,
  clickNextButton,
  gotoChapter
})(EbookFrame);
