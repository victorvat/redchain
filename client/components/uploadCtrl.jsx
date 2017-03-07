import React from 'react';
import { FormGroup, FormControl, Col, Button, ControlLabel } from 'react-bootstrap';

class UploadCtrl extends React.Component {

    // const UploadCtrl = ({
    //   onChange,
    //   fileName,
    //   isProgress,
    //   isNotReady,
    //   label
    // }) => 

    render() {
        return (
            <FormGroup controlId="upload-file">
                <Col componentClass={ControlLabel} sm={2}>
                    {this.props.label}
                </Col>
                <Col sm={8}>
                    <FormControl type="file" placeholder="Select file..."
                        onChange={this.props.onChange}
                        value={this.props.fileName}
                        disabled={this.props.isProgress}
                    />
                </Col>
                <Col sm={2}>
                    <Button type="submit" disabled={this.props.isNotReady} >
                        Send
            </Button>
                </Col>
            </FormGroup>
        );
    }
}

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
