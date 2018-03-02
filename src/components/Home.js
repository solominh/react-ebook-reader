import React, { Component } from 'react';
import AddEbookView from './AddEbookView';
import EbookReader from './EbookReader';

import { withStyles } from 'material-ui/styles';

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clickReadingProgress, toggleTOC } from "../actions";

const styles = theme => ({
  wrapper: {
    width: "100%",
    height: "100%"
  }
})

class Home extends Component {
  render() {

    const { classes, bookPath } = this.props;
    const el = bookPath ? <EbookReader /> : <AddEbookView />
    return (
      <div className={classes.wrapper} id="main">
        {el}
      </div>
    );
  }
}


Home = withStyles(styles)(Home)

const mapStateToProps = ({ bookPath }) => {
  return { bookPath };
};

export default connect(mapStateToProps, {
  clickReadingProgress,
  toggleTOC
})(Home);
