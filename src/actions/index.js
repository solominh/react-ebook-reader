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

const getBufferFromFile = fileObj => {
  if (!fileObj) return Promise.reject();

  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        var arr = new Uint8Array(reader.result).subarray(0, 2);
        var header = "";
        for (var i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        console.log(header);
        if (header == "504b") {
          resolve(reader.result);
        } else {
          reject(
            "The file you chose is not a valid ePub ebook. Please try choosing a new file."
          );
        }
      },
      false
    );
    reader.readAsArrayBuffer(fileObj);
  });
};

export const selectEbook = (bookPath) => ({
  type: types.SELECT_EBOOK,
  bookPath,
})

const book = window.ePub();

// url = "https://s3.amazonaws.com/moby-dick/"
// url="https://rawgit.com/solominh/react-ebook-reader/master/src/res/ebook/dragon-king.epub"
export const loadEbook = (bookPath) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.LOADING_EBOOK_REQUESTED
    });

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

      console.log(book);
      window.book = book;

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
