import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Drawer from "./components/Drawer";
import epubLink from "./res/ebook/dragon-king.epub";
import EbookFrame from "./components/EbookFrame";

class App extends Component {
  state = {
    book: null,
    toc: null,
    isLoading: true
  };
  componentWillMount() {}

  componentDidMount() {
    let book = window.ePub(epubLink);

    book.getMetadata().then(function(meta) {
      document.title = meta.bookTitle + " – " + meta.creator;
    });

    book.getToc().then(toc => {
      this.setState({ toc });
    });

    book.renderTo("area");

    book.ready.all.then(() => {
      this.setState({ isLoading: false });
    });

    this.setState({ book });
  }

  onBtnPrevClicked = () => {
    this.state.book.prevPage();
  };

  onBtnNextClicked = () => {
    this.state.book.nextPage();
  };

  onRowSelected=(index)=>{
    if(!this.state.toc) return;

    this.state.book.goto(this.state.toc[index].href)
  }
  render() {
    const { toc, isLoading } = this.state;
    return (
      <div className="App">
        <Drawer toc={toc} onRowSelected={this.onRowSelected}>
          <EbookFrame
            isLoading={isLoading}
            onBtnPrevClicked={this.onBtnPrevClicked}
            onBtnNextClicked={this.onBtnNextClicked}
          />
        </Drawer>
      </div>
    );
  }
}

export default App;
