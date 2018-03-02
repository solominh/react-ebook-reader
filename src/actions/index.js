import * as types from "./actionTypes";
import epubLink from "../res/ebook/dragon-king.epub";
// import epubLink from '../res/ebook/Đấu La Đại Lục II - Đường Gia Tam Thiếu.epub';
import _ from "lodash";
import axios from "axios";

export const clickPrevButton = () => {
  return (dispatch, getState) => {
    const { book } = getState();
    book.prevPage();
  };
};

export const clickNextButton = () => {
  return (dispatch, getState) => {
    const { book } = getState();
    book.nextPage();
  };
};

export const clickReadingProgress = () => ({
  type: types.CLICK_READING_PROGRESS
});

export const toggleTOC = () => ({
  type: types.TOGGLE_TOC
});

export const changeReadingProgress = value => ({
  type: types.CHANGE_READING_PROGRESS,
  readingProgress: value
});

export const gotoReadingProgress = value => {
  return (dispatch, getState) => {
    const { book } = getState();
    book.gotoPercentage(value / 100);
  };
};

export const gotoChapter = index => {
  return (dispatch, getState) => {
    const { book } = getState();
    book.goto(book.toc[index].href);

    dispatch({
      type: types.CHANGE_CHAPTER,
      selectedChapter: index
    });
  };
};

const calReadingProgress = book => {
  let percent = book.pagination.percentageFromCfi(book.getCurrentLocationCfi());
  return percent ? percent * 100 : null;
};




const ePubViewer = {}

const init = () => {
  const EPUBJS = window.EPUBJS;

  const Book = window.ePub({
    // gap:30,
    // Inject style to body
    styles: {
      // "column-rule":"1px inset rgba(0,0,0,0.05)",
      // "background-color":"red"
    }
  });
  ePubViewer.Book = Book;

  // EPUBJS.Hooks.register('beforeChapterDisplay').swipeDetection = function (callback, renderer) {
  //   var script = renderer.doc.createElement('script');
  //   script.text = "!function(a,b,c){function f(a){d=a.touches[0].clientX,e=a.touches[0].clientY}function g(f){if(d&&e){var g=f.touches[0].clientX,h=f.touches[0].clientY,i=d-g,j=e-h;Math.abs(i)>Math.abs(j)&&(i>a?b():i<0-a&&c()),d=null,e=null}}var d=null,e=null;document.addEventListener('touchstart',f,!1),document.addEventListener('touchmove',g,!1)}";
  //   /* (threshold, leftswipe, rightswipe) */
  //   script.text += "(10,function(){parent.ePubViewer.Book.nextPage()},function(){parent.ePubViewer.Book.prevPage()});"
  //   renderer.doc.head.appendChild(script);
  //   if (callback) {
  //     callback();
  //   }
  // };

  
  // EPUBJS.Hooks.register("beforeChapterDisplay").pageTurns = function (callback, renderer) {
  //   var lock = false;
  //   var arrowKeys = function (e) {
  //     e.preventDefault();
  //     if (lock) return;

  //     if (e.keyCode == 37) {
  //       ePubViewer.Book.prevPage();
  //       lock = true;
  //       setTimeout(function () {
  //         lock = false;
  //       }, 100);
  //       return false;
  //     }

  //     if (e.keyCode == 39) {
  //       ePubViewer.Book.nextPage();
  //       lock = true;
  //       setTimeout(function () {
  //         lock = false;
  //       }, 100);
  //       return false;
  //     }

  //   };
  //   renderer.doc.addEventListener('keydown', arrowKeys, false);
  //   if (callback) callback();
  // }

}

// init()

const getBufferFromFile = file => {
  if (!file) return Promise.reject();
  if (!window.FileReader) {
    alert("Your browser does not support the required features. Please use a modern browser such as Google Chrome, or Mozilla Firefox");
    return Promise.reject("Your browser does not support the required features. Please use a modern browser such as Google Chrome, or Mozilla Firefox")
  }

  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.readAsArrayBuffer(file);
  })
};

export const selectEbook = (bookPath) => ({
  type: types.SELECT_EBOOK,
  bookPath,
})


// url = "https://s3.amazonaws.com/moby-dick/"
// url="https://rawgit.com/solominh/react-ebook-reader/master/src/res/ebook/dragon-king.epub"
export const loadEbook = (bookPath) => {
  return async (dispatch, getState) => {
    init()
    dispatch({
      type: types.LOADING_EBOOK_REQUESTED
    });

    const book = ePubViewer.Book;
    if (!(typeof bookPath === "string")) {
      bookPath = await getBufferFromFile(bookPath)
    }

    console.log(bookPath);
    book.open(bookPath)

    book.getMetadata().then(meta => {
      document.title = meta.bookTitle + " – " + meta.creator;
    });

    book.getToc().then(toc => {
      // this.setState({ toc });
      book.toc = toc;
      dispatch({ type: "ABC" });
    });

    book.renderTo("area");

    try {
      await book.ready.all;

      window.EPUBJS.Hooks.register("beforeChapterDisplay").styles = function (callback, renderer) {
        window.a = renderer
        renderer.doc.body.appendChild(document.createElement("style")).innerHTML = [
          "a:link, a:visited {",
          "    color: inherit;",
          "    background: rgba(0,0,0,0.05);",
          "}",
          "",
          "html {",
          "    line-height: 1.5;",
          "    column-rule: 1px inset rgba(0,0,0,0.05);",
          "}"
        ].join("\n");
        if (callback) callback();
      };
    

      // Generate page
      book.generatePagination().then(toc => {
        console.log("Pagination generated");
        dispatch(changeReadingProgress(calReadingProgress(book)));
      });

      // Create TOC index
      book.tocIndexBySpine = book.toc.reduce((prev, cur, index) => {
        prev[cur.spinePos] = index;
        return prev;
      }, {});

      // Update selected chapter
      book.on("renderer:locationChanged", location => {
        dispatch({
          type: types.RENDERER_LOCATION_CHANGED,
          readingProgress: calReadingProgress(book),
          currentChapterIndex:
            book.tocIndexBySpine[book.currentChapter.spinePos]
        });
      });

      // Update pagination
      book.on("renderer:resized", () => {
        _.debounce(() => {
          book.generatePagination().then(toc => {
            console.log("Pagination generated");
          });
        }, 1000);
      });

      dispatch({
        type: types.LOADING_EBOOK_SUCCEEDED,
        book
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.LOADING_EBOOK_FAILED
      });
    }
  };
};
