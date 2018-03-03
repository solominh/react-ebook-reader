import React, { Component } from 'react';


import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { gotoChapter, closeSidebar } from "../actions";

import TOC from "./TOC";
import Settings from "./Settings";
import BookInfo from "./BookInfo";
import SearchView from "./SearchView";

import IconButton from "material-ui/IconButton";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import Divider from "material-ui/Divider";

import cn from 'classnames';
const sidebarWidth = 240;


const styles = theme => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center"
  },
  sidebarTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: 8,
    flex: 1
  },
  sidebarContent: {
    flex: 1
  },
  sidebar: {
    width: sidebarWidth,
    height: "100%",
    visibility: "hidden",
    marginLeft: -sidebarWidth,
    backgroundColor: "#F5F5F5",
    borderRight: "1px solid #BDBDBD",
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    display: "flex",
    flexDirection: "column"
  },
  sidebarOpen: {
    visibility: "visible",
    marginLeft: 0
  },
  tocWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  tocInnerWrapper: {
    width: "100%",
    flex: 1
  },
  settingsWrapper: {
    width: "100%",
    height: "100%",
    padding: 4
  },
  bookInfoWrapper: {
    width: "100%",
    height: "100%",
    padding: 4
  },
  searchWrapper: {
    width: "100%",
    height: "100%",
    padding: 4
  },
  bookTitle: {
    fontSize: "1.2rem",
    textAlign: "center",
    fontWeight: "bold",
    padding: 8,
  },
})

class Sidebar extends Component {
  render() {
    const { classes, book, currentChapterIndex, isTOCOpen, isBookInfoOpen, isSettingsOpen,
      isSearchOpen, gotoChapter, closeSidebar } = this.props

    let sidebarTitle;
    if (isTOCOpen) {
      sidebarTitle = book ? book.metadata.bookTitle : ""
    } else if (isBookInfoOpen) {
      sidebarTitle = "Info"
    } else if (isSettingsOpen) {
      sidebarTitle = "Settings"
    } else if (isSearchOpen) {
      sidebarTitle = "Search"
    }
    return (
      <div className={classes.wrapper}>
        <div className={classes.sidebarHeader}>
          <div className={classes.sidebarTitle}>{sidebarTitle}</div>
          <IconButton onClick={closeSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.sidebarContent}>
          {isTOCOpen && (
            <div className={classes.tocWrapper}>
              {/* <div className={classes.bookTitle}>
                {book ? book.metadata.bookTitle : ""}
              </div> */}
              <div className={classes.tocInnerWrapper}>
                <TOC
                  data={book ? book.toc : null}
                  selectedItem={currentChapterIndex}
                  onItemSelected={gotoChapter}
                />
              </div>
            </div>
          )}

          {isSettingsOpen && (
            <div className={classes.settingsWrapper}>
              <Settings />
            </div>
          )}

          {isBookInfoOpen && (
            <div className={classes.bookInfoWrapper}>
              <BookInfo />
            </div>
          )}

          {isSearchOpen && (
            <div className={classes.searchWrapper}>
              <SearchView />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Sidebar = withStyles(styles)(Sidebar);

const mapStateToProps = ({ book, currentChapterIndex, isTOCOpen,
  isBookInfoOpen,
  isSettingsOpen,
  isSearchOpen
}) => {
  return {
    book,
    currentChapterIndex,
    isTOCOpen,
    isBookInfoOpen,
    isSettingsOpen,
    isSearchOpen
  }
};

export default connect(mapStateToProps, {
  gotoChapter,
  closeSidebar
})(Sidebar);
