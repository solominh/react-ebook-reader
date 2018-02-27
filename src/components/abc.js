
import React, { Component } from "react";

import { withStyles } from "material-ui/styles";
import ArrowKeyStepper from "react-virtualized/dist/commonjs/ArrowKeyStepper";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";

const styles = theme => ({
  wrapper: {
    height: "100%",
    width: "100%"
  },
  arrowKeyStepper: {
    height: "100%",
    width: "100%"
  },
  autoSizerWrapper: {
    height: "100%",
    width: "100%"
  },
  list: {
    // border: "1px solid #e0e0e0",
    outline: "none !important",
    backgroundColor: "#fff",
    padding: "0px 8px"
  },
  row: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // padding: "0 8px",
    // backgroundColor: "#fff"
    // borderBottom: "1px solid #e0e0e0"
  },
  selectedRow: {
    backgroundColor: theme.palette.primary[100]
  },

  noRow: {
    display: "flex",
    padding: 16,
    justifyContent: "center"
  }
});

class TOC extends Component {
  state = {
    mode: "cells",
    isClickable: true,
    scrollToRow: 0,
    selectedRow: 0,
    rowHeight: 24
  };

  componentDidMount() {
    if (!this.props.toc) return;

    const { suggestedPosition } = this.props.suggestion;
    this.updateNewSelectedRow(suggestedPosition);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.suggestion !== nextProps.suggestion) {
      const { suggestedPosition } = nextProps.suggestion;
      this.updateNewSelectedRow(suggestedPosition);
    }
  } 

  updateNewSelectedRow = suggestedPosition => {
    if (!this.wrapperEl) return;
    const { wordIndex } = this.props;
    if (!wordIndex || wordIndex.length <= 0) return;

    const { rowHeight, scrollToRow } = this.state;
    const totalHeight = this.wrapperEl.clientHeight;
    const visibleRowCount = Math.floor(totalHeight / rowHeight);

    const offset =
      suggestedPosition > scrollToRow
        ? Math.floor(visibleRowCount / 2)
        : -Math.floor(visibleRowCount / 2);

    let newScrollToRow = suggestedPosition + offset;
    if (newScrollToRow >= wordIndex.length) {
      newScrollToRow = wordIndex.length - 1;
    } else if (newScrollToRow < 0) {
      newScrollToRow = 0;
    }

    this.setState({
      selectedRow: suggestedPosition,
      scrollToRow: newScrollToRow
    });
  };

  /**
   * Listen to Arrow key 
   */
  selectCell = ({ scrollToRow }) => {
    const newSelectedRow =
      scrollToRow - this.state.scrollToRow + this.state.selectedRow;
    this.onRowClick(newSelectedRow);
  };

  onRowClick = index => {
    this.setState({
      selectedRow: index,
      scrollToRow: index
    });

    // const word = this.props.wordIndex[index];
    // const { history } = this.props;
    // history.push(`/dictionary/search/${word}`);
  };

  _rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    const { classes, toc } = this.props;
    const chapter = toc[index].label;
    const shortenedWord =
      chapter.length > 16 ? chapter.substring(0, 13) + "..." : chapter;

    const { selectedRow } = this.state;
    const rowClassName =
      selectedRow === index ? classes.selectedRow : classes.row;

    return (
      <div
        className={rowClassName}
        key={key}
        style={style}
        onClick={() => {
          this.onRowClick(index);
        }}
      >
        {shortenedWord}
      </div>
    );
  };

  _noRowRenderer = () => {
    const { classes } = this.props;
    return (
      <div className={classes.noRow}>
        <div>WordIndex is empty</div>
      </div>
    );
  };

  render() {
    const { toc } = this.props;

    if (!toc) {
      return <div ref={el => (this.wrapperEl = el)}>Loading</div>;
    }

    const { classes } = this.props;
    const {
      selectedRow,
      scrollToRow,
      rowHeight,
      isClickable,
      mode
    } = this.state;

    return (
      <div ref={el => (this.wrapperEl = el)} className={classes.wrapper}>
        <ArrowKeyStepper
          className={classes.arrowKeyStepper}
          mode={mode}
          key={isClickable}
          columnCount={1}
          rowCount={toc.length}
          scrollToRow={scrollToRow}
          isControlled={isClickable}
          onScrollToChange={isClickable ? this.selectCell : undefined}
        >
          {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
            <div className={classes.autoSizerWrapper}>
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    className={classes.list}
                    width={width}
                    height={height}
                    rowCount={toc.length}
                    rowHeight={rowHeight}
                    rowRenderer={this._rowRenderer}
                    noRowRenderer={this._noRowRenderer}
                    selectedRow={this.state.selectedRow}
                    scrollToIndex={scrollToRow}
                    onRowRendered={onSectionRendered}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </ArrowKeyStepper>
      </div>
    );
  }
}

TOC = withStyles(styles)(TOC)

export default TOC
