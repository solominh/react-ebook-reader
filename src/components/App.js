import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import OpenEbookWindow from "./OpenEbookWindow";
import EbookReader from './EbookReader';

const styles={
  wrapper:{
    width:"100%",
    height:"100%",
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div style={styles.wrapper}>
          <Route exact path="/" component={EbookReader} />
          <Route path="/about" component={About} />
          <Route path="/OpenEbook" component={EbookReader} />
        </div>
      </Router>
    );
  }
}

export default App;
