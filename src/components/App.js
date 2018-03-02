import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import AddEbookView from "./AddEbookView";
import EbookReader from "./EbookReader";

import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadSettings } from "../actions";

const styles = {
  wrapper: {
    width: "100%",
    height: "100%"
  }
};

class App extends Component {

  componentWillMount() {
    this.props.loadSettings();
  }

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


App = withStyles(styles)(App);

export default connect(null, {
  loadSettings
})(App);
