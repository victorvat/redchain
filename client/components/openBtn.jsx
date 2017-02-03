import React, { PropTypes } from 'react';
import { Col, Button, ButtonToolbar } from 'react-bootstrap';

const OpenBtn = ({
  onClick
}) => (
  <ButtonToolbar>
   <Col smOffset={2} sm={10}>
        <Button onClick={ onClick }>
            ShowFind
        </Button>
    </Col>
    </ButtonToolbar>
);

OpenBtn.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default OpenBtn;