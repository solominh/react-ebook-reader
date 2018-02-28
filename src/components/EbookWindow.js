import React, { Component } from "react";
import Drawer from "./Drawer";
import EbookFrame from "./EbookFrame";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { gotoChapter, loadEbook } from "../actions";

class EbookWindow extends Component {
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
    this.props.loadEbook();
  }

  componentWillUnmount() {
    if (this.props.book) {
      const { book } = this.props;
      book.off("renderer:locationChanged");
      book.off("renderer:resized");
    }
  }

  render() {
    const {
      book,
      isLoading,
      readingProgress,
      isReadingProgressSliderOpen,
      gotoChapter
    } = this.props;

    const selectedChapter = book
      ? book.tocIndexBySpine[book.currentChapter.spinePos]
      : null;
    const toc = book ? book.toc : null;

    return (
      <Drawer
        toc={toc}
        selectedItem={selectedChapter}
        onItemSelected={gotoChapter}
      >
        <EbookFrame />
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps, {
  gotoChapter,
  loadEbook
})(EbookWindow);
