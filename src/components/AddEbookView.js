import React, { Component } from "react";
import Dropzone from "react-dropzone";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectEbook} from "../actions";

import { withStyles } from "material-ui/styles";

const styles = theme => ({});

class AddEbookView extends Component {
  constructor() {
    super();
    this.state = { files: [] };
  }

  onDrop(files) {
    this.setState({
      files
    });
    this.props.selectEbook(files[0])
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>
              Try dropping some files here, or click to select files to upload.
            </p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {this.state.files.map(f => (
              <li key={f.name}>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
        </aside>
      </section>
    );
  }
}

AddEbookView = withStyles(styles)(AddEbookView);

const mapStateToProps = ({ readingProgress }) => {
  return {};
};

export default connect(mapStateToProps, {
  selectEbook
})(AddEbookView);
