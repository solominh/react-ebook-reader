import React, { Component } from "react";
import Drawer from "material-ui/Drawer";

class MainContainer extends Component {
  state = {
    open: false
  };
  render() {
    return (
      <div>
        <Drawer open={this.state.open}>
          <div>asdasdas</div>
        </Drawer>
      </div>
    );
  }
}

export default MainContainer;
