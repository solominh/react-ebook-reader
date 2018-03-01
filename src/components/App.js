import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import AddEbookView from "./AddEbookView";
import EbookReader from "./EbookReader";

const styles = {
  wrapper: {
    width: "100%",
    height: "100%"
  }
};

class App extends Component {
  render() {
    return (
      <div style={styles.wrapper}>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/OpenEbook" component={EbookReader} />
      </div>
    );
  }
}

export default App;
