import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, ProgressBar } from 'react-bootstrap';

import store from '../store';
import gate from '../lib/gate';
import ErrAlert from '../components/errAlert.jsx'
import ProgressInfo from '../components/progressInfo.jsx'
import PhotoTrackList from './photoTrackList.jsx'

class PhotoFind extends React.Component {
    constructor(props) {
        super(props);

        this._fileNameCtrl = null;

        this.state = {
            error: undefined,
            progress: undefined,
            file: undefined
        };
    }

    componentWillMount() {
        this.setState({
            error: undefined,
            progress: undefined,
            file: undefined
        });
    }

    cleanState(event) {
        //
        // !!! Chrom not allow use "value" for input/file
        // === force update DOM
        //
        document.querySelectorAll('input[type="file"]').forEach((node) => {
            node.value = "";
        });
        this.setState({
            error: undefined,
            progress: undefined,
            file: undefined
        });
    }

    onFileSend(event) {
        event.preventDefault();
        console.log("Poto.onFormUnload");

        if (this.state.progress !== undefined) {
            return;
        }

        const file = this.state.file;
        if (file === undefined) {
            return;
        }
        const total = file.size + 5000; //pad

        this.setState({
            error: undefined,
            progress: 0,
        });

        const formData = new FormData();
        formData.append('cmd', 'photo_find');
        formData.append('upload', file, file.name);

        const xhr = gate.broker('/ext/photo_push');
        xhr.responseType = 'json';
        xhr.addEventListener('progress', (evt) => {
            const percentComplete = parseInt(100 * evt.loaded / total);
            this.setState({ progress: percentComplete });
        });
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                console.log("/ext/photo_push 200", xhr.response);
                store.dispatch({
                    type: 'ADD_PHOTO_TRACK',
                    track: {
                        ticket: xhr.response[0],
                        state: 'wait',
                        name: file.name
                    }
                });
                this.cleanState();
            } else {
                console.log('ERR:', xhr.status, xhr.response);
                this.setState({
                    error: xhr.response,
                    progress: undefined
                });
            }
        });
        xhr.send(formData);
    }

    onFileChange(event) {
        event.preventDefault();
        const files = event.target.files;

        console.log('onFieldChange', files.length);
        if (files.length > 0) {
            this.setState({
                error: undefined,
                file: files[0]
            });
        }
    }

    render() {
        const isProgress = (this.state.progress !== undefined);
        const isNotReady = (this.state.file === undefined) || isProgress;

        return (
            <Form horizontal onSubmit={this.onFileSend.bind(this)}>
                <h1>Photo find</h1>
                <FormGroup controlId="upload-file">
                    <Col componentClass={ControlLabel} sm={2}>
                        Photo
                    </Col>
                    <Col sm={8}>
                        <FormControl type="file" placeholder="Select file..."
                            onChange={this.onFileChange.bind(this)}
                            disabled={isProgress}
                        />
                    </Col>
                    <Col sm={2}>
                        <Button type="submit" disabled={isNotReady} >
                            Send
                        </Button>
                    </Col>
                </FormGroup>
                <ProgressInfo step={this.state.progress} />
                <ErrAlert error={this.state.error} />
                <PhotoTrackList />
            </Form>
        );
    }
}

export default PhotoFind;
