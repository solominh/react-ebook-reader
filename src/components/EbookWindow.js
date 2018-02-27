import React, { Component } from "react";
import Drawer from "./Drawer";
import epubLink from "../res/ebook/dragon-king.epub";
import EbookFrame from "./EbookFrame";

class EbookWindow extends Component {
  state = {
    isLoading: true,
    book: null,
    toc: null,
    selectedChapter: null
  };

  componentDidMount() {
    let book = window.ePub(epubLink);

    book.getMetadata().then(function(meta) {
      document.title = meta.bookTitle + " – " + meta.creator;
    });

    book.getToc().then(toc => {
      this.setState({ toc });
    });

    book.renderTo("area");

    book.ready.all
      .then(() => {
        console.log(book);
        book.tocIndexBySpine = book.toc.reduce((prev, cur, index) => {
          prev[cur.spinePos] = index;
          return prev;
        }, {});
        this.setState({
          isLoading: false,
          selectedChapter: book.tocIndexBySpine[book.currentChapter.spinePos]
        });

        book.on("renderer:locationChanged", location => {
          this.setState({
            selectedChapter: book.tocIndexBySpine[book.currentChapter.spinePos]
          });
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
  render() {
    const { toc, isLoading, selectedChapter } = this.state;
    return (
      <Drawer
        toc={toc}
        selectedItem={selectedChapter}
        onItemSelected={this.onItemSelected}
        onDrawerTransition={this.onDrawerTransition}
      >
        <EbookFrame
          isLoading={isLoading}
          onBtnPrevClicked={this.onBtnPrevClicked}
          onBtnNextClicked={this.onBtnNextClicked}
        />
      </Drawer>
    );
  }
}

export default EbookWindow;
