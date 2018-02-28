import * as types from "./actionTypes";
import epubLink from "../res/ebook/dragon-king.epub";
import _ from "lodash";

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
  type: types.TOGGLE_TOC,
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

export const loadEbook = (url = epubLink) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.LOADING_EBOOK_REQUESTED
    });

    let book = window.ePub(url, {
      gap: 20
    });

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
          type:types.RENDERER_LOCATION_CHANGED,
          readingProgress:calReadingProgress(book),
          currentChapterIndex:book.tocIndexBySpine[book.currentChapter.spinePos]
        })
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
