import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

function ErrAlert(props) {
  if (props.error !== undefined) {
    return (
      <Alert bsStyle="danger">
        {props.error}
      </Alert>
    );
  }
  return null;

}

export default ErrAlert;