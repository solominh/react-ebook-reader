import React, { Component } from "react";
import { BeatLoader } from "halogenium";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from "material-ui/Progress";
import cn from "classnames";
import Footer from "./Footer";
import ReadingProgressSlider from "./ReadingProgressSlider";
import Collapse from "material-ui/transitions/Collapse";
import Slide from "material-ui/transitions/Slide";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  loadEbook,
  clickPrevButton,
  clickNextButton,
  gotoChapter,
  applySettingsToChapter
} from "../actions";
import MoreView from "./MoreView";
import Sidebar from "./Sidebar";

const sidebarWidth = 240;

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
  sidebar: {
    width: sidebarWidth,
    height: "100%",
    visibility: "hidden",
    marginLeft: -sidebarWidth,
    // backgroundColor: "#F5F5F5",
    borderRight: "1px solid #BDBDBD",
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
  },
  sidebarOpen: {
    visibility: "visible",
    marginLeft: 0
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
    // backgroundColor: "#F5F5F5",
    borderTop: "1px solid #BDBDBD"
  },
  moreView: {
    width: "100%",
    // backgroundColor: "#F5F5F5",
    borderTop: "1px solid #BDBDBD"
  },
  textWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    // padding: 20,
    // margin: "0px 5%",
    // maxWidth: 1250,
    "& iframe": {
      border: "none"
    },
  },
  text: {
    flex: 1,
    margin: "20px 5% 0px 5%"
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
    color: "rgba(0,0,0,0)",
    fontFamily: "arial, sans-serif",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      color: "rgba(0,0,0,0.1)"
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

});

class EbookReader extends Component {

  init = () => {
    const EPUBJS = window.EPUBJS;

    EPUBJS.Hooks.register('beforeChapterDisplay').swipeDetection = function (callback, renderer) {
      var script = renderer.doc.createElement('script');
      script.text = "!function(a,b,c){function f(a){d=a.touches[0].clientX,e=a.touches[0].clientY}function g(f){if(d&&e){var g=f.touches[0].clientX,h=f.touches[0].clientY,i=d-g,j=e-h;Math.abs(i)>Math.abs(j)&&(i>a?b():i<0-a&&c()),d=null,e=null}}var d=null,e=null;document.addEventListener('touchstart',f,!1),document.addEventListener('touchmove',g,!1)}";
      /* (threshold, leftswipe, rightswipe) */
      script.text += "(10,function(){parent.ePubViewer.Book.nextPage()},function(){parent.ePubViewer.Book.prevPage()});"
      renderer.doc.head.appendChild(script);
      if (callback) {
        callback();
      }
    };

    // Keyboard page turn
    EPUBJS.Hooks.register("beforeChapterDisplay").pageTurns = (callback, renderer) => {
      var lock = false;
      var arrowKeys = (e) => {
        e.preventDefault();
        if (lock) return;
        if (e.keyCode == 37) {
          this.props.clickPrevButton()
          lock = true;
          setTimeout(() => {
            lock = false;
          }, 100);
          return false;
        }

        if (e.keyCode == 39) {
          this.props.clickNextButton()
          lock = true;
          setTimeout(() => {
            lock = false;
          }, 100);
          return false;
        }

      };
      renderer.doc.addEventListener('keydown', arrowKeys, false);
      if (callback) callback();
    }

    // Remove select and focus => help page turn by keyboard
    EPUBJS.Hooks.register("beforeChapterDisplay").noSelection = function (callback, renderer) {
      renderer.doc.body.appendChild(document.createElement("style")).innerHTML = [
        "* {",
        "    -webkit-user-select: none;",
        "    -moz-user-select: none;",
        "    -ms-user-select: none;",
        "    user-select: none;",
        "    -webkit-user-drag: none;",
        "    -moz-user-drag: none;",
        "    -ms-user-drag: none;",
        "    user-drag: none;",
        "}"
      ].join("\n");
      if (callback) callback();
    };

    // Add column-rule to ebook
    EPUBJS.Hooks.register("beforeChapterDisplay").styles = (callback, renderer) => {
      renderer.doc.body.appendChild(document.createElement("style")).innerHTML = `
      a:link, a:visited {
        color: inherit;
        background: rgba(0,0,0,0.05);
      }
      html {
        line-height: 1.5;
        column-rule: 1px inset rgba(0,0,0,0.05);
      }
    `
      if (callback) callback();
    };

    // Apply settings to page
    EPUBJS.Hooks.register("beforeChapterDisplay").settings = (callback, renderer) => {
      this.props.applySettingsToChapter();
      if (callback) callback();
    };
  }

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
    this.init();
    this.props.loadEbook(this.props.bookPath, this.renderArea)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bookPath && nextProps.bookPath !== this.props.bookPath) {
      this.props.loadEbook(nextProps.bookPath, this.renderArea)
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
    // if (e.key === "ArrowLeft") {
    //   this.props.clickPrevButton()
    // } else if (e.key === "ArrowRight") {
    //   this.props.clickNextButton()
    // }
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
      isBookInfoOpen,
      isSettingsOpen,
      isSearchOpen,
      clickPrevButton,
      clickNextButton,
      gotoChapter
    } = this.props;

    return (
      <div className={classes.wrapper}
      // onKeyDown={this.onKeyDown}
      >

        <div className={cn(classes.sidebar, { [classes.sidebarOpen]: isTOCOpen || isBookInfoOpen || isSettingsOpen || isSearchOpen })}>
          <Sidebar />
        </div>

        <div className={classes.contentWrapper} id="content">
          <div className={classes.readingArea}>
            <div className={classes.textWrapper} >
              <div className={classes.text} ref={el => this.renderArea = el} id="area" />
            </div>
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
  isTOCOpen,
  isBookInfoOpen,
  isSettingsOpen,
  isSearchOpen
}) => {
  return {
    book,
    bookPath,
    currentChapterIndex,
    isLoading,
    isReadingProgressSliderOpen,
    isMoreViewOpen,
    isTOCOpen,
    isBookInfoOpen,
    isSettingsOpen,
    isSearchOpen
  };
};

export default connect(mapStateToProps, {
  loadEbook,
  clickPrevButton,
  clickNextButton,
  gotoChapter,
  applySettingsToChapter
})(EbookReader);
