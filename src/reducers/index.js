import * as types from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
  settings: null,
  isLoading: true,
  book: null,
  bookPath: null,
  coverURL: null,
  currentChapterIndex: null,
  readingProgress: null,
  isReadingProgressSliderOpen: false,
  isMoreViewOpen: true,
  isTOCOpen: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.CLICK_READING_PROGRESS: {
      return {
        ...state,
        isReadingProgressSliderOpen: !state.isReadingProgressSliderOpen
      };
    }
    case types.CHANGE_READING_PROGRESS: {
      return {
        ...state,
        readingProgress: action.readingProgress
      };
    }
    case types.CHANGE_CHAPTER: {
      return {
        ...state,
        selectedChapter: action.selectedChapter
      };
    }
    case types.LOADING_EBOOK_REQUESTED: {
      return {
        ...state,
        isLoading: true
      };
    }
    case types.LOADING_EBOOK_SUCCEEDED: {
      return {
        ...state,
        isLoading: false,
        book: action.book,
        toc: action.toc,
        coverURL: action.coverURL
      };
    }
    case types.LOADING_EBOOK_FAILED: {
      return {
        ...state,
        isLoading: false,
        book: null
      };
    }
    case types.TOGGLE_TOC: {
      return {
        ...state,
        isTOCOpen: !state.isTOCOpen
      };
    }
    case types.TOGGLE_MORE_VIEW: {
      return {
        ...state,
        isMoreViewOpen: !state.isMoreViewOpen
      };
    }
    case types.RENDERER_LOCATION_CHANGED: {
      return {
        ...state,
        readingProgress: action.readingProgress,
        currentChapterIndex: action.currentChapterIndex
      };
    }
    case types.SELECT_EBOOK: {
      return {
        ...state,
        bookPath: action.bookPath
      }
    }

    case types.LOADING_SETTINGS_SUCCEEDED: {
      return {
        ...state,
        settings: action.settings
      }
    }
  }
  return state;
}
