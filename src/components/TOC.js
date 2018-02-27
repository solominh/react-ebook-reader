import React, { Component } from "react";

import { withStyles } from "material-ui/styles";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import { CellMeasurer, CellMeasurerCache } from "react-virtualized";

import cn from "classnames";

const styles = theme => ({
  wrapper: {
    width: "100%",
    height: "500px"
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "0 8px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e0e0e0",
    "&:hover": {
      backgroundColor: "gray"
    }
  },
  selectedRow: {
    backgroundColor: "red"
  },

  noRow: {
    display: "flex",
    padding: 16,
    justifyContent: "center"
  }
});

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

let list;
let mostRecentWidth;

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

    this.updateNewSelectedRow(0);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.toc) return;
    console.log(this.props.toc);
    this.updateNewSelectedRow(0);
  }

  updateNewSelectedRow = suggestedPosition => {
    if (!this.wrapperEl) return;
    const { toc } = this.props;
    if (!toc || toc.length <= 0) return;

    const { rowHeight, scrollToRow } = this.state;
    const totalHeight = this.wrapperEl.clientHeight;
    const visibleRowCount = Math.floor(totalHeight / rowHeight);

    const offset =
      suggestedPosition > scrollToRow
        ? Math.floor(visibleRowCount / 2)
        : -Math.floor(visibleRowCount / 2);

    let newScrollToRow = suggestedPosition + offset;
    if (newScrollToRow >= toc.length) {
      newScrollToRow = toc.length - 1;
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

    this.props.onRowSelected(index);
  };

  _rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    parent,
    style // Style object to be applied to row (to position it)
  }) => {
    const { classes, toc } = this.props;
    const chapter = toc[index].label;
    const shortenedWord =
      chapter.length > 100 ? chapter.substring(0, 13) + "..." : chapter;

    const { selectedRow } = this.state;
    const rowClassName = cn(classes.row, {
      [classes.selectedRow]: selectedRow === index
    });
    console.log("asdasd");

    return (
      <CellMeasurer
        cache={cache}
        rowIndex={index}
        columnIndex={0}
        parent={parent}
        width={mostRecentWidth}
        key={key}
      >
        <div
          key={key}
          className={rowClassName}
          style={style}
          onClick={() => {
            this.onRowClick(index);
          }}
        >
          {shortenedWord}
        </div>
      </CellMeasurer>
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
        <div className={classes.autoSizerWrapper}>
          <AutoSizer>
            {({ width, height }) => {
              if (mostRecentWidth && mostRecentWidth !== width) {
                cache.clearAll();
                list.recomputeRowHeights();
              }
              console.log(toc);

              mostRecentWidth = width;
              <List
                className={classes.list}
                ref={el => (list = el)}
                deferredMeasurementCache={cache}
                width={width}
                height={height}
                rowCount={toc.length}
                rowHeight={cache.rowHeight}
                rowRenderer={this._rowRenderer}
                noRowRenderer={this._noRowRenderer}
                selectedRow={this.state.selectedRow}
                scrollToIndex={scrollToRow}
              />;
            }}
          </AutoSizer>
        </div>
      </div>
    );
  }
}

TOC = withStyles(styles)(TOC);

export default TOC;
