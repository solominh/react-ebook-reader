import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import DynamicHeightListExample from "./components/DynamicHeightListExample";
import App from './components/App';

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
