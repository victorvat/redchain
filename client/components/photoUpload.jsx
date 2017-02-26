import React from 'react';
import { Form, FormGroup, Alert, ProgressBar } from 'react-bootstrap';

import UploadCtrl from './uploadCtrl.jsx'

// UploadTool.propTypes = {
//   onChange: React.PropTypes.func.isRequired,
//   files: React.PropTypes.array.isRequired,
//   progress: React.PropTypes.number,
//   label: React.PropTypes.string
// }

function UploadTool(props) {
    let isNotReady = true;
    let isProgress = (props.progress !== undefined);
    let fileName = "";
    let files = props.files;
    if (files.length > 0) {
        fileName = files[0].name;
        isNotReady = isProgress;
    }
    //console.log("isProgress", isProgress, this.props.progress);
    //console.log("isNotReady", isNotReady, files.length);
    return (
        <UploadCtrl
            onChange={props.onChange}
            fileName={fileName}
            isProgress={isProgress}
            isNotReady={isNotReady}
            label={props.label}
        />
    )
}

class PhotoUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state =  {
            error: undefined,
            progress: undefined, 
            files: [],
            tasks: [],
            gallery: []
        };
    }

    componentWillMount() {
        this.setState({
            error: undefined,
            progress: undefined, 
            files: [],
        });
    }

    onFileSend(event) {
        event.preventDefault();
        console.log("Poto.onFormUnload");

        if (this.state.progress !== undefined) 
            return;

        const files = this.state.files;
        if ( ! files.length ) 
            return;

        const formData = new FormData();
        formData.append('cmd', 'photo_push');
        const params = this.props.params
        for(let key in params) {
            formData.append(key, params[key]);
        }

        var total = 5000; //pad
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            total += file.size;
            formData.append('upload', file, file.name);
        }

        // create an AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.path);
        xhr.responseType = 'json';
        xhr.addEventListener('progress', (evt) => {
            if (evt.lengthComputable)
                total = evt.total;
            const percentComplete = parseInt(100 * evt.loaded / total);
            this.setState({ progress: percentComplete });
        });
        xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            //console.log("/ext/photo_push 200 readyState=", xhr.readyState);
            //console.log(xhr.response);
            var tickets = xhr.response[0];
            this.setState({
                error: undefined,
                progress: undefined, 
                files: []
            });
            if (this.props.onUploaded !== undefined) {
                this.props.onUploaded(tickets)
            }
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
        const pool = [];
        for (let i = 0; i < files.length; i++) {
            pool.push(files[i]);
        }
        this.setState({ 
            error: undefined,
            files: pool 
        });
    }

    render() {
        let state = this.state;  
        let errAllert = null;
        if (state.error !== undefined) {
            errAllert = (
                <Alert bsStyle="danger">{this.state.error}</Alert>
            )
        }  
        let progress = null;
        if (state.files.length > 0) {
            if (state.progress !== undefined) {
                progress = (
                    <ProgressBar now={state.progress} />
                )
            }
        }
        return(
            <Form horizontal onSubmit={this.onFileSend.bind(this)}>
                <UploadTool 
                    onChange={this.onFileChange.bind(this)}
                    files={state.files} 
                    progress={state.progress}
                    label={this.props.label}
                />
                {errAllert}  
                {progress}
            </Form>
        )
    }
}

PhotoUpload.propTypes = {
    path: React.PropTypes.string,
    params: React.PropTypes.object,
    onUploaded: React.PropTypes.func,
    label: React.PropTypes.string
}

PhotoUpload.defaultProps = {
    path: '/ext/photo_push',
    params: {},
    onUploaded: undefined,
    label: 'Upload photo:'
}

export default PhotoUpload;