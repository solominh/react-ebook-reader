import * as types from "../actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
  isLoading: true,
  book: null,
  readingProgress: null,
  isReadingProgressSliderOpen: true
};

export default function(state = initialState, action) {
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
        book: action.book
      };
    }
    case types.LOADING_EBOOK_FAILED: {
      return {
        ...state,
        isLoading: false,
        book: null
      };
    }
  }
  return state;
}
