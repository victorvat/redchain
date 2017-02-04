import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel } from 'react-bootstrap';
import { ErrAlert } from './errAlert.jsx'

const PersonFind = ({
  onSubmit,
  onChange,
  errors
}) => (
  <Form horizontal onSubmit={ onSubmit }>
    <FormGroup controlId="personFindShortName">
        <Col componentClass={ControlLabel} sm={2}>
        Short name
        </Col>
        <Col sm={10}>
        <FormControl type="text" placeholder="shortname" 
            onChange={onChange} 
        />
        </Col>
    </FormGroup>

    <FormGroup controlId="personFindFullName">
        <Col componentClass={ControlLabel} sm={2}>
        Full name
        </Col>
        <Col sm={10}>
        <FormControl type="text" placeholder="fullname" 
            onChange={onChange} 
        />
        </Col>
    </FormGroup>

    <FormGroup controlId="personFindLegalName">
        <Col componentClass={ControlLabel} sm={2}>
        Legal name
        </Col>
        <Col sm={10}>
        <FormControl type="text" placeholder="legalname" 
            onChange={onChange} 
        />
        </Col>
    </FormGroup>
    <FormGroup controlId="personFindFullName">
        <Col componentClass={ControlLabel} sm={2}>
        Дата рождения
        </Col>
        <Col sm={10}>
        <FormControl type="text" placeholder="borndate" 
            onChange={onChange} 
        />
        </Col>
    </FormGroup>
    <FormGroup controlId="personFindFullName">
        <Col componentClass={ControlLabel} sm={2}>
        Пол
        </Col>
        <Col sm={10}>
        <FormControl type="text" placeholder="sex" 
            onChange={onChange} 
        />
        </Col>
    </FormGroup>

    <FormGroup>
        <Col smOffset={2} sm={10}>
        <Button type="submit">
            Find
        </Button>
        </Col>
    </FormGroup>
  </Form>
);

//    <ErrAlert errors={errors} />
  

PersonFind.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default PersonFind;

