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
import {
  loadEbook,
  clickPrevButton,
  clickNextButton,
  gotoChapter
} from "../actions";
import MoreView from "./MoreView";
import Settings from "./Settings";

const TOCWidth = 300;

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
  TOCSidebar: {
    width: TOCWidth,
    height: "100%",
    visibility: "hidden",
    marginLeft: -TOCWidth,
    backgroundColor: "#FFFFFF",
    border: "1px solid #eee",
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    display: "flex",
    flexDirection: "column"
  },
  TOCSidebarOpen: {
    visibility: "visible",
    marginLeft: 0
  },
  TOCWrapper: {
    width: "100%",
    flex: 1
    // padding:4
  },
  readingArea: {
    position: "relative",
    flex: 1,
    width: "100%",
    margin: "0 auto"
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
  moreView: {
    width: "100%",
    padding: "20px 20px 20px 20px",
    backgroundColor: "#EEEEEE",
    borderTop: "1px solid #616161"
  },
  textWrapper: {
    width: "90%",
    height: "100%",
    position: "absolute",
    padding: 20,
    margin: "0px 5%",
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
  },
  bookTitle: {
    fontSize: "1.2rem",
    textAlign: "center",
    fontWeight: "bold",
    padding: 8
  }
});

class EbookReader extends Component {
  /*this.settings = EPUBJS.core.defaults(options || {}, {
		bookPath : undefined,
		bookKey : undefined,
		packageUrl : undefined,
		storage: false, //-- true (auto) or false (none) | override: 'ram', 'websqldatabase', 'indexeddb', 'filesystem'
		fromStorage : false,
		saved : false,
		online : true,
		contained : false,
		width : undefined,
		height: undefined,
		layoutOveride : undefined, // Default: { spread: 'reflowable', layout: 'auto', orientation: 'auto'}
		orientation : undefined,
		minSpreadWidth: 768, //-- overridden by spread: none (never) / both (always)
		gap: "auto", //-- "auto" or int
		version: 1,
		restore: false,
		reload : false,
		goto : false,
		styles : {},
		classes : [],
		headTags : {},
		withCredentials: false,
		render_method: "Iframe",
		displayLastPage: false
  });
  */
  componentDidMount() {
    this.props.loadEbook(this.props.bookPath,this.renderArea)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bookPath && nextProps.bookPath !== this.props.bookPath) {
      this.props.loadEbook(nextProps.bookPath,this.renderArea)
    }
  }

  componentWillUnmount() {
    if (this.props.book) {
      const { book } = this.props;
      book.off("renderer:locationChanged");
      book.off("renderer:resized");
    }
  }

  onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      this.props.clickPrevButton()
    } else if (e.key === "ArrowRight") {
      this.props.clickNextButton()
    }
  }

  render() {
    const {
      classes,
      book,
      currentChapterIndex,
      isLoading,
      isReadingProgressSliderOpen,
      isMoreViewOpen,
      isTOCOpen,
      clickPrevButton,
      clickNextButton,
      gotoChapter
    } = this.props;

    const toc = book ? book.toc : null;

    return (
      <div className={classes.wrapper}
        onKeyDown={this.onKeyDown}
      >
        <div
          className={cn(classes.TOCSidebar, {
            [classes.TOCSidebarOpen]: isTOCOpen
          })}
        >
          <div className={classes.bookTitle}>
            {book ? book.metadata.bookTitle : ""}
          </div>
          <div className={classes.TOCWrapper}>
            {/* <TOC
              data={toc}
              selectedItem={currentChapterIndex}
              onItemSelected={gotoChapter}
            /> */}
            <Settings/>
          </div>
        </div>

        <div className={classes.contentWrapper}>
          <div className={classes.readingArea}>
            <div className={classes.textWrapper} ref={el => this.renderArea = el} id="area" />
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
          <Collapse in={isMoreViewOpen}>
            <div className={classes.moreView}>
              <MoreView />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

EbookReader = withStyles(styles)(EbookReader);

const mapStateToProps = ({
  book,
  bookPath,
  currentChapterIndex,
  isLoading,
  isReadingProgressSliderOpen,
  isMoreViewOpen,
  isTOCOpen
}) => {
  return {
    book,
    bookPath,
    currentChapterIndex,
    isLoading,
    isReadingProgressSliderOpen,
    isMoreViewOpen,
    isTOCOpen
  };
};

export default connect(mapStateToProps, {
  loadEbook,
  clickPrevButton,
  clickNextButton,
  gotoChapter
})(EbookReader);
