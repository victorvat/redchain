import React from 'react';
import { FormGroup, FormControl, Col, Button, ControlLabel } from 'react-bootstrap';

const UploadCtrl = ({
  onChange,
  fileName,
  isProgress,
  isNotReady,
  label
}) => (
    <FormGroup controlId="upload-file">
        <Col componentClass={ControlLabel} sm={2}>
            {label}
        </Col>
        <Col sm={8}>
            <FormControl type="file" placeholder="Select file..." 
                onChange={onChange}
                value={fileName}
                disabled={isProgress}
            />
        </Col>
        <Col sm={2}>
            <Button type="submit" disabled={isNotReady} > 
                Send
            </Button>
        </Col>
    </FormGroup>
);

UploadCtrl.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  fileName: React.PropTypes.string.isRequired,
  isProgress: React.PropTypes.bool.isRequired,
  isNotReady: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string
}

UploadCtrl.defaultProps = {
  label: 'Upload file:'
}

export default UploadCtrl;
