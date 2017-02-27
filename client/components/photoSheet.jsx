import React from 'react';

class PhotoSheet extends React.Component {
    constructor(props) {
        super(props);

        this.state =  {
            error: undefined,
            progress: undefined, 
            data: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        };
    }

    componentWillMount() {
        this.setState({
            error: undefined,
            progress: undefined, 
            data: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        })
    }

    componentDidMount() {
        const postData = {
            cmd: 'photo_get',
        }
        const params = this.props.params
        for(let key in params) {
            postData[key] = params[key];
        }
        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.path);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        //xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                console.log("/ext/photo_get 200");
                this.setState({
                    data: xhr.response
                })
            } else {
                console.log('ERR:', xhr.status, xhr.response);
                this.setState({
                    error: xhr.statusText,
                    progress: undefined
                });
            }
        });
        xhr.send( JSON.stringify(postData) );
    }

    render() {
        const data = this.state.data;
        return (
            <img alt="" src={data} 
                height={this.props.height} 
                width={this.props.width}
			/>
        )
    }
}

PhotoSheet.propTypes = {
    path: React.PropTypes.string,
    params: React.PropTypes.object
}

PhotoSheet.defaultProps = {
    path: '/ext/photo_get',
    height: 300,
    width: 200,
    params: {},
}

export default PhotoSheet;