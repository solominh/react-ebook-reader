import {
  call,
  put,
  all,
  fork,
  takeEvery,
  takeLatest
} from "redux-saga/effects";

// import phonetic from "./phonetic.saga";

function* rootSaga() {
  // yield all([
  //   fork(searchWord),
  //   fork(suggestion),
  //   fork(getWordIndex),
  //   fork(settings),
  //   fork(actionBar),
  //   fork(electron),
  //   fork(phonetic),
  // ]);
}

export default rootSaga;
