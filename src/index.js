// import "./utils/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import "typeface-roboto";
import registerServiceWorker from "./registerServiceWorker";
import AppWithTheme from "./components/AppWithTheme";
import configureStore from "./configureStore";


import { Provider, connect } from "react-redux";
import { BrowserRouter, withRouter } from "react-router-dom";
// import { ConnectedRouter } from "react-router-redux";

const { store, history } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <AppWithTheme />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
