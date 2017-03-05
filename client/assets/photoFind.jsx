import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Table, ProgressBar, Alert } from 'react-bootstrap';

import store from '../store';
import gate from '../lib/gate';
import PhotoTrackList from './photoTrackList.jsx'
import UploadCtrl from '../components/uploadCtrl.jsx'

class PhotoFind extends React.Component {
    constructor(props) {
        super(props);

        this.state =  {
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

    onFileSend(event) {
        event.preventDefault();
        console.log("Poto.onFormUnload");

        if (this.state.progress !== undefined) {
            return;
        }

        const file = this.state.file;
        if ( file === undefined ) {
            return;
        }

        const formData = new FormData();
        formData.append('cmd', 'photo_find');

        const total = file.size + 5000; //pad
        formData.append('upload', file, file.name);
        
        // create an AJAX request
        //const xhr = new XMLHttpRequest();
        //xhr.open('post', '/ext/photo_push');
        const xhr = gate.broker('/ext/photo_push');
        xhr.responseType = 'json';
        xhr.addEventListener('progress', (evt) => {
            const percentComplete = parseInt(100 * evt.loaded / total);
            this.setState({ progress: percentComplete });
        });
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                console.log("/ext/photo_push 200", xhr.response);
                var ticket = xhr.response[0];
                const track = {
                    ticket, 
                    state: 'wait',
                    name: file.name
                }
                store.dispatch({ type: 'ADD_PHOTO_TRACK', track });
                this.setState({
                    error: undefined,
                    progress: undefined, 
                    file: undefined
                });
            } else {
                console.log('ERR:', xhr.status, xhr.response);
                this.setState({
                    error: xhr.statusText,
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
        const state = this.state;  
        let errAllert = null;
        if (state.error !== undefined) {
            errAllert = (
                <Alert bsStyle="danger">{this.state.error}</Alert>
            );
        }  
        let progressInfo = null; 
        const isProgress = (state.progress !== undefined);
        if (isProgress) {
            progressInfo = (
                <ProgressBar now={state.progress} />
            );
        }
        const isNotReady = (state.file === undefined);
        const fileName = isNotReady ? "" : state.file.name; 

        const deposit = store.getState();
        const trackList = deposit.photoTrack;

        //TODO row.onClick={(event) => onClick(event, value.ticket)}
        return(
            <Form horizontal onSubmit={this.onFileSend.bind(this)}>
                <h1>Photo find</h1>
                <UploadCtrl
                    onChange={this.onFileChange.bind(this)}
                    fileName={fileName}
                    isProgress={isProgress}
                    isNotReady={isNotReady || isProgress}
                />
                {progressInfo}
                {errAllert}
                <PhotoTrackList />  
            </Form>
        )
    }
}

export default PhotoFind;
