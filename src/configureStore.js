import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import reducers from "./reducers";

import thunk from 'redux-thunk';
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

import createHistory from "history/createBrowserHistory";
import { createHashHistory } from "history";
// import { routerMiddleware } from "react-router-redux";

// Begin actions
// import { getSettings } from "./actions";

const configureStore = () => {
  const history = createHistory();
  const sagaMiddleware = createSagaMiddleware();
  // const routerMiddlewareInstance = routerMiddleware(history);
  const middlewares = [
    // routerMiddlewareInstance,
    sagaMiddleware,
    thunk
  ];

  // redux-devtools extension
  const enhancer = composeWithDevTools(
    applyMiddleware(...middlewares)
    // other store enhancers if any
  );

  const store = createStore(reducers, enhancer);
  sagaMiddleware.run(rootSaga);

  // Begin
  // store.dispatch(getSettings());

  return { store, history };
};

export default configureStore;
