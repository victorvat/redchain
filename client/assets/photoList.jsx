import React, { PropTypes } from 'react';
import Lightbox from 'react-image-lightbox';
import { Alert, Thumbnail, Glyphicon, Button } from 'react-bootstrap';
import Spinner from 'react-spinner';
import Waypoint from 'react-waypoint';

import gate from '../lib/gate';
import ErrAlert from '../components/errAlert.jsx'

class PhotoList extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handlePhotoShow = this.handlePhotoShow.bind(this);
        this.handlePhotoHide = this.handlePhotoHide.bind(this);

        this.state = {
            error: undefined,
            containerWidth: 0,
            isLoading: false,
            isEof: false,
            isLightboxOpen: false,
            ticket: undefined,
            offset: undefined,
            photoMain: undefined, // {index, photo, src}
            pool: [] // photo = {id, info, thumbnail, photoid, personid}

        }
    }

    componentWillMount() {
        console.log('componentWillMount');
        if (this.state.ticket !== this.props.params.ticket) {
            this.setState({
                isLoading: false,
                isEof: false,
                ticket: this.props.ticket,
                offset: undefined,
                isLightboxOpen: false,
                photoMain: undefined,
                pool: []
            });
        }
    }

    componentDidMount() {
        console.log('componentDidMount');
        window.addEventListener('resize', this.handleResize);
        this.setState({
            error: undefined,
            containerWidth: Math.floor(this._gallery.clientWidth)
        });
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
        if (this._gallery.clientWidth !== this.state.containerWidth) {
            this.setState({
                containerWidth: Math.floor(this._gallery.clientWidth)
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize, false);
    }

    handleResize(event) {
        this.setState({
            containerWidth: Math.floor(this._gallery.clientWidth)
        });
    }

    handleLoadMore(event) {
        console.log('handleLoadMore', event);
        const secondsToWait = 2;

        this.setState({
            isLoading: true
        });
        window.setTimeout(() => {
            this.loadThumbnailPool();
        }, secondsToWait * 1000);
    }

    handlePhotoShow(event, id) {
        event.preventDefault();
        console.log('handlePhotoShow', id);
        const state = this.state;

        var index = -1;
        for (let i = 0; i < state.pool.length; i++) {
            if (state.pool[i].id === id) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            return;
        }
        const photoRec = state.pool[index];
        if (photoRec.photoid === undefined) {
            alert('Base photo is undefined');
            return;
        }
        const photoMain = state.photoMain;
        if (photoMain !== undefined) {
            if (photoMain.photo.photoid === photoRec.photoid) {
                this.setState({
                    isLoading: false,
                    isLightboxOpen: true,
                });
                return;
            }
        }
        this.setState({
            isLoading: true
        });

        const data = {
            cmd: 'get_photo',
            photoid: photoRec.photoid
        }
        gate.getRaw('/ext/photo_get', data)
            .then(response => {
                this.setState({
                    isLoading: false,
                    isLightboxOpen: true,
                    photoMain: {
                        index,
                        photo: photoRec,
                        src: response
                    },
                    //photoNext: undefined,
                    //photoPrev: undefined,
                });
            }).catch(error => {
                alert(error);
                this.setState({
                    isLoading: false
                });
            });
    }

    handlePhotoHide(event) {
        //event.preventDefault();
        console.log('handlePhotoHide');
        this.setState({
            isLightboxOpen: false
        })
    }

    loadThumbnailPool() {
        // limit. Lock as isLoading
        const data = {
            cmd: 'get_thumbnail',
            ticket: this.state.ticket,
            offset: this.state.offset
        }
        gate.post('/ext/photo_list', data)
            .then(body => {
                if (body.ticket !== this.state.ticket) {
                    this.setState({
                        isLoading: false,
                        isEof: false
                    });
                    return;
                }
                if (body.state === 'ready') {
                    const offset = body.offset;
                    this.setState({
                        isLoading: false,
                        isEof: offset.eof,
                        offset,
                        pool: [...this.state.pool, ...body.pool]
                    });
                    return;
                }
                alert('ERR STATE: ' + body.state);
                this.setState({
                    error: 'ERR STATE:' + body.state,
                    isEof: true
                });

            })
            .catch(reson => {
                console.log('ERR:', reson);
                this.setState({
                    error: reson,
                    isEof: true
                });
            });
    }

    renderLightbox() {
        const isLightboxOpen = this.state.isLightboxOpen;

        if (!this.state.isLightboxOpen) {
            return null;
        }
        const toolbarButtons = [];
        const photoMain = this.state.photoMain;

        const isOffPerson = (photoMain.photo.personid === undefined);
        toolbarButtons.push(
            <Button bsSize="large" disabled={isOffPerson}>
                <Glyphicon glyph="link" />
                Person
            </Button>
        );
        toolbarButtons.push(
            <Button bsSize="large">
                <Glyphicon glyph="list" />
                Info
            </Button>
        );

        return (
            <Lightbox
                mainSrc={photoMain.src}
                onCloseRequest={this.handlePhotoHide}
                toolbarButtons={toolbarButtons}
            />
        );
    }

    renderWaypoint() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Spinner />
                    <p>Loadin...</p>
                </div>
            );
        }
        if (!this.state.isEof) {
            return (
                <Waypoint onEnter={this.handleLoadMore}>
                    <p>Load more items…</p>
                </Waypoint>
            );
        }
        return null;
    }

    renderTable() {
        const cellHeight = this.props.cellHeight;
        const cellWidth = this.props.cellWidth;
        var colCnt = Math.floor(this.state.containerWidth / cellWidth);
        if (colCnt < 1) {
            colCnt = 1;
        }

        const pool = this.state.pool;
        let tData = [];
        for (let index = 0; index < pool.length;) {
            let tRow = [];
            for (let j = 0; j < colCnt; j++ , index++) {
                if (index < pool.length) {
                    const photo = pool[index];
                    tRow.push(
                        <td key={"d" + index} height={cellHeight} width={cellWidth} >
                            <img src={photo.thumbnail} height={cellHeight - 10} width={cellWidth - 2}
                                onClick={(evt) => this.handlePhotoShow(evt, photo.id)}
                            />
                            <p>{photo.info}</p>
                        </td>
                    );
                } else {
                    tRow.push(
                        <td key={"d" + index} height={cellHeight} width={cellWidth} >
                        </td>
                    );
                }
            }
            tData.push(
                <tr key={"r" + index} >
                    {tRow}
                </tr>
            );
        }
        return tData;
    }

    render() {
        if (this.state.error !== undefined) {
            return (
                <Alert bsStyle="danger">{this.state.error}</Alert>
            );
        }
        return (
            <div>
                <p>Items Loaded: {this.state.pool.length}</p>
                <div ref={(obj) => this._gallery = obj}>
                    <table>
                        <tbody>
                            {this.renderTable()}
                        </tbody>
                    </table>
                </div>
                {this.renderLightbox()}
                {this.renderWaypoint()}
            </div>
        );
    }
}

PhotoList.propTypes = {
    params: PropTypes.object.isRequired,
    //ticket: React.PropTypes.string.isRequired,
    cellWidth: React.PropTypes.number,
    cellHeight: React.PropTypes.number
}

PhotoList.defaultProps = {
    cellWidth: 130,
    cellHeight: 100
}

export default PhotoList;