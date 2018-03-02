import React, { Component } from 'react';
import Divider from 'material-ui/Divider';

import { withStyles } from 'material-ui/styles';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSettings } from "../actions";

const styles = {
  wrapper: {
    width:"100%",
    height:"100%",
    lineHeight:"1.3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& .creator":{
      fontSize:"1.2rem",
      marginTop:8
    },
    "& .divider":{
      width:"50%",
      height:1,
      margin:4,
      backgroundColor:"rgba(0,0,0,0.05)"
    }
  },
  coverImage: {
    width: 100,
    height: 150
  },
};

class BookInfo extends Component {
  render() {
    const { classes, book, coverURL, readingProgress } = this.props
    if (!book) return null;

    const readingPercentage = readingProgress ? readingProgress.toFixed(2) : 0
    const currentPage = book.pagination.pageFromCfi(book.getCurrentLocationCfi())
    const totalPages = book.pagination.lastPage;

    return (
      <div className={classes.wrapper}>
        <img src={coverURL} className={classes.coverImage} />
        <div className="creator">{book.metadata.bookTitle}</div>
        <div>{book.metadata.creator}</div>
        <div className="divider"/>
        <div>{`${readingPercentage} % read`}</div>
        <div>{`Page ${currentPage} of ${totalPages}`}</div>
      </div>
    );
  }
}

BookInfo = withStyles(styles)(BookInfo);

const mapStateToProps = ({ book, coverURL, readingProgress }) => {
  return { book, coverURL, readingProgress };
};

export default connect(mapStateToProps, {
  updateSettings
})(BookInfo);
