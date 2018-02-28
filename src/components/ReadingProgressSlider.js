import React, { Component } from "react";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";

const styles={
  trackStyle:{
    backgroundColor:"#616161"
  },
  handleStyle:{
    backgroundColor:"#616161",
    borderColor:"#616161",
    // boxShadow:"0 0 5px red"
  },
  railStyle:{
    backgroundColor:"#E0E0E0"
  },
  dotStyle:{
    borderColor:"#616161"
  },
  activeDotStyle:{
    borderColor:"#616161",
    boxShadow:"0 0 5px red"
  },

}

const Handle = Slider.Handle;

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

class ReadingProgressSlider extends Component {
  onChange = value => {
    this.props.onChange(value);
  };
  onAfterChange = value => {
    this.props.onAfterChange(value);
  };

  render() {
    let { classes, readingProgress } = this.props;
    if (!readingProgress) readingProgress = 0;
    return (
      <div>
        <Slider
          min={0}
          max={100}
          value={readingProgress}
          handle={handle}
          onChange={this.onChange}
          onAfterChange={this.onAfterChange}
          trackStyle={styles.trackStyle}
          handleStyle={styles.handleStyle}
          railStyle={styles.railStyle}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
        />
      </div>
    );
  }
}

export default ReadingProgressSlider;
