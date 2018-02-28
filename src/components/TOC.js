import React, { Component } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List
} from "react-virtualized";
import { withStyles } from "material-ui/styles";

const cache = new CellMeasurerCache({
  fixedWidth: true
});

let list;
let mostRecentWidth;

const styles = {
  wrapper: {
    width: "100%",
    height: "100%"
  },
  list: {
    // border: "1px solid #eee",
    "& .item": {
      borderBottom: "1px solid #eee",
      padding: "0.5rem",
      boxSizing: "border-box",
      "&:hover": {
        backgroundColor: "#eee"
      }
    },
    "& .selected": {
      backgroundColor: "#CFD8DC"
    }
  }
};

class TOC extends Component {
  state = {
    mode: "cells",
    isClickable: true,
    scrollToRow: 0,
    selectedRow: 0
  };

  onItemSelected = index => {
    this.setState({
      selectedRow: index,
      scrollToRow: index
    });

    this.props.onItemSelected(index);
  };

  rowRenderer = params => {
    const {
      key, // Unique key within array of rows
      index, // Index of row within collection
      isScrolling, // The List is currently being scrolled
      isVisible, // This row is visible within the List (eg it is not an overscanned row),
      parent,
      style // Style object to be applied to row (to position it)
    } = params;
    const { data, selectedItem } = this.props;
    const item = data[index];

    const itemClassName = selectedItem === index ? "item selected" : "item";

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
        width={mostRecentWidth}
      >
        <div
          className={itemClassName}
          key={key}
          style={style}
          onClick={() => {
            this.onItemSelected(index);
          }}
        >
          {item.label.trim()}
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const { classes, data, selectedItem } = this.props;

    if (!data) return <div>Loading...</div>;

    return (
      <AutoSizer>
        {({ width, height }) => {
          if (mostRecentWidth && mostRecentWidth !== width) {
            cache.clearAll();
            list.recomputeRowHeights();
          }

          mostRecentWidth = width;

          return (
            <List
              ref={ref => (list = ref)}
              className={classes.list}
              deferredMeasurementCache={cache}
              rowCount={data.length}
              width={width}
              height={height}
              rowHeight={cache.rowHeight}
              rowRenderer={this.rowRenderer}
              selectedRow={selectedItem}
            />
          );
        }}
      </AutoSizer>
    );
  }
}

export default withStyles(styles)(TOC);
