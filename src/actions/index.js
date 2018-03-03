import * as types from "./actionTypes";
import epubLink from "../res/ebook/dragon-king.epub";
// import epubLink from '../res/ebook/Đấu La Đại Lục II - Đường Gia Tam Thiếu.epub';
import _ from "lodash";
// import axios from "axios";
import localforage from 'localforage';
import { SETTINGS_KEY, defaultSettings, settingOptions } from '../constants';

export const clickPrevButton = () => {
  return (dispatch, getState) => {
    const { book } = getState();
    dispatch({
      type: types.GOTO_PREV_PAGE
    })
    book.prevPage();
  };
};

export const clickNextButton = () => {
  return (dispatch, getState) => {
    const { book } = getState();
    dispatch({
      type: types.GOTO_NEXT_PAGE
    })
    book.nextPage();
  };
};

export const clickReadingProgress = () => ({
  type: types.CLICK_READING_PROGRESS
});

export const toggleTOC = () => ({
  type: types.TOGGLE_TOC
});

export const toggleBookInfo = () => ({
  type: types.TOGGLE_BOOK_INFO
})

export const toggleSettings = () => ({
  type: types.TOGGLE_SETTINGS
})

export const toggleSearch = () => ({
  type: types.TOGGLE_SEARCH
})

export const toggleMoreView = () => ({
  type: types.TOGGLE_MORE_VIEW
});

export const closeSidebar = () => ({
  type: types.CLOSE_SIDEBAR
})

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
export const loadEbook = (bookPath, renderArea) => {
  if (!bookPath) return;

  return async (dispatch, getState) => {

    dispatch({
      type: types.LOADING_EBOOK_REQUESTED
    });

    if (!(typeof bookPath === "string")) {
      bookPath = await getBufferFromFile(bookPath)
    }

    const book = window.ePub({
      // gap:30,
      // Inject style to body
      styles: {
        // "column-rule":"1px inset rgba(0,0,0,0.05)",
        // "background-color":"red"
      }
    });
    book.open(bookPath)

    // book.getMetadata().then(meta => {
    //   document.title = meta.bookTitle + " – " + meta.creator;
    // });

    // book.getToc().then(toc => {
    //   book.toc = toc;
    //   dispatch({ type: "ABC" });
    // });

    renderArea.innerHTML = ""
    book.renderTo(renderArea);

    try {
      await book.ready.all;

      // Update title
      const meta = await book.getMetadata();
      document.title = meta.bookTitle + " – " + meta.creator;

      let coverURL = await book.coverUrl();
      let toc = await book.getToc()
      let bookID = [meta.bookTitle, meta.creator, meta.identifier, meta.publisher].join(":");

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
        const readingProgress = calReadingProgress(book);

        // Cache reading progress
        const key = `ePubViewer_${bookID}_curPosCfi`;
        localforage.setItem(key, book.getCurrentLocationCfi())

        dispatch({
          type: types.RENDERER_LOCATION_CHANGED,
          readingProgress,
          currentChapterIndex:
            book.tocIndexBySpine[book.currentChapter.spinePos]
        });
      });

      // Update pagination
      book.on("renderer:resized", () => {
        // _.debounce(() => {
        //   book.generatePagination().then(toc => {
        //     console.log("Pagination generated");
        //   });
        // }, 1000);
      });

      dispatch({
        type: types.LOADING_EBOOK_SUCCEEDED,
        book,
        bookID,
        toc,
        coverURL,
      });

      // Goto cached cfi
      const key = `ePubViewer_${bookID}_curPosCfi`;
      const cachedCurPosCfi = await localforage.getItem(key)
      if (cachedCurPosCfi) book.gotoCfi(cachedCurPosCfi)

    } catch (err) {
      console.log(err);
      dispatch({
        type: types.LOADING_EBOOK_FAILED
      });
    }
  };
};


export const loadSettings = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.LOADING_SETTINGS_REQUESTED
    });

    try {
      let settings = await localforage.getItem(SETTINGS_KEY)
      if (!settings) {
        settings = defaultSettings;
      }
      dispatch({
        type: types.LOADING_SETTINGS_SUCCEEDED,
        settings,
      })
      applySettings(getState().book, settings)
    } catch (err) {
      dispatch({
        type: types.LOADING_SETTINGS_FAILED
      });
    }
  }
}

export const updateSettings = (settings) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.LOADING_SETTINGS_SUCCEEDED,
      settings,
    })

    applySettings(getState().book, settings)

    try {
      await localforage.setItem(SETTINGS_KEY, settings)
    } catch (err) {
      console.log(err);
    }
  }
}

export const resetSettings = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.LOADING_SETTINGS_SUCCEEDED,
      settings: defaultSettings,
    })

    applySettings(getState().book, defaultSettings)

    try {
      await localforage.setItem(SETTINGS_KEY, defaultSettings)
    } catch (err) {
      console.log(err);
    }
  }
}

function handleApplySettingsToChapter(book, settings) {
  const { fonts, themes } = settingOptions;
  var font = settingOptions.fonts[settings.font] || fonts.ArbutusSlab;
  var theme = settingOptions.themes[settings.theme] || themes.SepiaLight;

  try {
    var doc = book.renderer.doc;
    if (doc.getElementById("ePubViewerSettings") === null) {
      doc.body.appendChild(doc.createElement("style")).id = "ePubViewerSettings";
    }
    var styleEl = doc.getElementById("ePubViewerSettings");
    styleEl.innerHTML = `
    html,body{
      font-family:${font["font-family"]};
      font-size:${settings["font-size"]}px;
      color:${theme.color}!important;
      background-color:${theme["background-color"]}!important;
      line-height:${settings["line-height"]}!important;
    }
    p{
      font-family:${font["font-family"]}!important;
      font-size:${settings["font-size"]}px!important;
    }
    `
    if (font.link) {
      if (doc.getElementById("ePubViewerFontLink") === null) {
        doc.body.appendChild(doc.createElement("link")).id = "ePubViewerFontLink";
      }
      var el = document.getElementById("ePubViewerFontLink");
      el.setAttribute("rel", "stylesheet");
      el.setAttribute("href", font.link);
    }
  } catch (e) { }
}

export function applySettingsToChapter() {
  return async (dispatch, getState) => {
    const { book, settings } = getState();
    handleApplySettingsToChapter(book, settings)
  }
}

/**
 * Apply Settings to both app and ebook current chapter
 */
function applySettings(book, settings) {
  const { fonts, themes } = settingOptions;
  var font = settingOptions.fonts[settings.font] || fonts.ArbutusSlab;
  var theme = settingOptions.themes[settings.theme] || themes.SepiaLight;

  // Theme settings
  // try {
  //   if (theme.light) {
  //     document.body.classList.remove("dark");
  //     document.body.classList.add("light");
  //   } else {
  //     document.body.classList.add("dark");
  //     document.body.classList.remove("light");
  //   }
  // } catch (ex) { }

  // App settings
  if (document.getElementById("ePubViewerAppSettings") === null) {
    document.body.appendChild(document.createElement("style")).id = "ePubViewerAppSettings";
  }
  var styleEla = document.getElementById("ePubViewerAppSettings");
  styleEla.innerHTML = `
      #main #content{
        font-family:${font["font-family"]};
        color: ${theme.color};
        background-color: ${theme["background-color"]};
      }
      #main #area {
        margin: 20px ${settings.margin}% 0px ${settings.margin}%;
      }
      #main {
        color:  ${theme.color};
        background: ${ theme["background-color"]}!important;
      }
    `
  if (font.link) {
    if (document.getElementById("ePubViewerAppFontLink") === null) {
      document.body.appendChild(document.createElement("link")).id = "ePubViewerAppFontLink";
    }
    var ela = document.getElementById("ePubViewerAppFontLink");
    ela.setAttribute("rel", "stylesheet");
    ela.setAttribute("href", font.link);
  }

  // Chapter settings
  handleApplySettingsToChapter(book, settings);
}

