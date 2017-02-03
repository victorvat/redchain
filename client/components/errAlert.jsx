import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

class ErrAlert extends React.Component {
  render() {
    const errors = this.prop.errors;

    if (errors) {
      return (
        <Alert bsStyle="danger">
          <h4>Oh snap! You got an error!</h4>
          <p>{errors}</p>
          <p>{errors.summary}</p>
        </Alert>
      )
    }
  }
}

export default ErrAlert;