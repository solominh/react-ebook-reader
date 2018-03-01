import React, { Component } from "react";
import Dropzone from "react-dropzone";
import cn from 'classnames';

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectEbook } from "../actions";

import { withStyles } from "material-ui/styles";
import Icon from 'material-ui-icons/FolderOpen';

const styles = theme => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5EDF1"
  },
  dropZoneClassName: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
    // border: "2px dashed rgb(102, 102, 102)",
    // borderRadius: 5,
  },
  dropZoneAcceptClassName: {
    // border: "2px dashed rgb(102, 255, 102)",
    // borderRadius: 5,
  },
  dropZoneRejectClassName: {
    // border: "2px dashed rgb(255, 102, 102)",
    // borderRadius: 5,
  },
  innerWrapper: {
    // width: 500,
    // height: 300,
    fontSize: "1.5rem",
    padding: 8,
    backgroundColor: "#C9DADF",
    outline: "2px dashed #92b0b3",
    outlineOffset: -8,
    transition: theme.transitions.create("outline-offset", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
  },
  innerWrapperActive: {
    backgroundColor: "#FFF",
    outlineOffset: -20
  },
  content: {
    padding: "100px 160px",
    display:"flex",
    flexDirection:"column",
    alignItems:"center"
  },
  icon:{
    color: "#93B0B3",
    width: 100,
    height: 100,
    marginBottom: 16,
  }

});

class AddEbookView extends Component {

  state = {
    dropzoneActive: false
  }

  onDragEnter = () => {
    this.setState({ dropzoneActive: true })
  }

  onDragLeave = () => {
    this.setState({ dropzoneActive: false })
  }

  onDrop = (files) => {
    this.setState({ dropzoneActive: false })
    console.log(files);
    this.props.selectEbook(files[0])
  }

  render() {
    const { classes } = this.props
    const { dropzoneActive } = this.state;
    return (
      <div className={classes.wrapper}>
        <Dropzone
          className={classes.dropZoneClassName}
          acceptClassName={classes.dropZoneAcceptClassName}
          rejectClassName={classes.dropZoneRejectClassName}
          accept="application/epub+zip"
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
        >
          <div className={cn(classes.innerWrapper, { [classes.innerWrapperActive]: dropzoneActive })}>
            <div className={classes.content}>
              <Icon className={classes.icon}/>
              <div>
                Choose a .epub file or drag it here
              </div>
            </div>
          </div>
        </Dropzone>
      </div>
    );
  }
}

AddEbookView = withStyles(styles)(AddEbookView);

export default connect(null, {
  selectEbook
})(AddEbookView);
