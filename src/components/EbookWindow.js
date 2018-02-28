import React, { Component } from "react";
import Drawer from "./Drawer";
import epubLink from "../res/ebook/dragon-king.epub";
import EbookFrame from "./EbookFrame";
import _ from "lodash";

class EbookWindow extends Component {
  state = {
    isLoading: true,
    book: null,
    toc: null,
    selectedChapter: null,
    readingProgress: null
  };

  calReadingProgress = book => {
    let percent = book.pagination.percentageFromCfi(
      book.getCurrentLocationCfi()
    );
    return percent ? percent * 100 : null;
  };

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
    let book = window.ePub(epubLink, {
      gap: 20
    });

    book.getMetadata().then(meta => {
      document.title = meta.bookTitle + " – " + meta.creator;
    });

    book.getToc().then(toc => {
      this.setState({ toc });
    });

    book.renderTo("area");

    book.ready.all
      .then(() => {
        console.log(book);
        window.book = book;

        // Generate page
        book.generatePagination().then(toc => {
          console.log("Pagination generated");
          this.setState({
            readingProgress: this.calReadingProgress(book)
          });
        });

        // Create TOC index
        book.tocIndexBySpine = book.toc.reduce((prev, cur, index) => {
          prev[cur.spinePos] = index;
          return prev;
        }, {});
        this.setState({
          isLoading: false,
          selectedChapter: book.tocIndexBySpine[book.currentChapter.spinePos]
        });

        // Update selected chapter
        book.on("renderer:locationChanged", location => {
          this.setState({
            selectedChapter: book.tocIndexBySpine[book.currentChapter.spinePos],
            readingProgress: this.calReadingProgress(book)
          });
        });

        // Update pagination
        book.on("renderer:resized", () => {
          _.debounce(() => {
            console.log("asdasdasd");
            book.generatePagination().then(toc => {
              console.log("Pagination generated");
            });
          }, 1000);
        });
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({ book });
  }

  componentWillUnmount() {
    if (this.state.book) {
      const { book } = this.state;
      book.off("renderer:locationChanged");
      book.off("renderer:resized");
    }
  }

  onBtnPrevClicked = () => {
    const { book } = this.state;
    book.prevPage();
  };

  onBtnNextClicked = () => {
    const { book } = this.state;
    book.nextPage();
  };

  onItemSelected = index => {
    if (!this.state.toc) return;

    const { book, toc } = this.state;
    this.setState({ selectedChapter: index });
    book.goto(toc[index].href);
  };

  onDrawerTransition = () => {
    // const { book } = this.state;
    // var currentPosition = book.getCurrentLocationCfi();
    // book.gotoCfi(currentPosition);
  };

  onSliderChange = value => {
    this.setState({ readingProgress: value });
  };

  onSliderAfterChange = value => {
    const {book} = this.state
    book.gotoPercentage(value / 100);
  };
  render() {
    const { toc, isLoading, selectedChapter, readingProgress } = this.state;
    return (
      <Drawer
        toc={toc}
        selectedItem={selectedChapter}
        onItemSelected={this.onItemSelected}
        onDrawerTransition={this.onDrawerTransition}
      >
        <EbookFrame
          isLoading={isLoading}
          readingProgress={readingProgress}
          onBtnPrevClicked={this.onBtnPrevClicked}
          onBtnNextClicked={this.onBtnNextClicked}
          onSliderChange={this.onSliderChange}
          onSliderAfterChange={this.onSliderAfterChange}
        />
      </Drawer>
    );
  }
}

export default EbookWindow;
