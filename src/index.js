// import "./utils/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import "typeface-roboto";
import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import configureStore from "./configureStore";


import { Provider, connect } from "react-redux";
import { BrowserRouter, withRouter } from "react-router-dom";
// import { ConnectedRouter } from "react-router-redux";

const { store, history } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
