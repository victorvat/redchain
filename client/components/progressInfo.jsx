import React, { PropTypes } from 'react';
import { ProgressBar } from 'react-bootstrap';

function ProgressInfo(props) {
  if (props.step !== undefined) {
    return (
      <ProgressBar now={props.step} />
    );
  }
  return null;

}

export default ProgressInfo;