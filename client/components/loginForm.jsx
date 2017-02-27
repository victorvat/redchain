import React, { PropTypes } from 'react';
//import { Link } from 'react-router';
//import { Card, CardText } from 'material-ui/Card';
//import RaisedButton from 'material-ui/RaisedButton';
//import TextField from 'material-ui/TextField';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel } from 'react-bootstrap';

const LoginFrame = ({
  onSubmit,
  onChange,
  errors
}) => (
    <Form horizontal onSubmit={onSubmit}>
      <FormGroup controlId="formHorizontalEmail">
        <Col componentClass={ControlLabel} sm={2}>
          Email
        </Col>
        <Col sm={10}>
          <FormControl type="text" 
            placeholder="Your account" 
            onChange={(event) => onChange(event,"username",)}
          />
        </Col>
      </FormGroup>

      <FormGroup controlId="formHorizontalPassword">
        <Col componentClass={ControlLabel} sm={2}>
          Password
        </Col>
        <Col sm={10}>
          <FormControl type="password" 
            placeholder="Password"
            onChange={(event) => onChange(event,"password",)}
          />  
        </Col>
      </FormGroup>

      <FormGroup>
        <Col smOffset={2} sm={2}>
          <Button type="submit">
            Sign in
          </Button>
        </Col>
      </FormGroup>
    </Form>
)

LoginFrame.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default LoginFrame;