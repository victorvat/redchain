import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Button, Table } from 'react-bootstrap';

import store from '../store';
import gate from '../lib/gate';
import ErrAlert from '../components/errAlert.jsx'

class PhotoTrackList extends React.Component {
    constructor(props) {
        super(props);

        this.handleTick = this.handleTick.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.state = {
            error: undefined,
            isLoading: false
        }
    }

    componentWillMount() {
        this.setState({
            error: undefined,
            isLoading: false
        });
    }

    componentDidMount() {
        const secondsToWait = 10;
        this.timerID = setInterval(
            this.handleTick,
            secondsToWait * 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleTick() {
        if (!this.state.isLoading) {
            const trackList = store.getState().photoTrack;
            for (let i = 0; i < trackList.length; i++) {
                if (trackList[i].state === 'wait') {
                    this.refreshTicketState(trackList[i]);
                    break;
                }
            }
        }
    }

    refreshTicketState(track) {
        this.setState({
            error: undefined,
            isLoading: true
        });
        const data = {
            cmd: 'get_state',
            ticket: track.ticket
        }
        gate.post('/ext/photo_state', data)
            .then(body => {
                console.log(body);
                if (body.ticket === track.ticket) {
                    const newVal = {
                        state: body.state
                    };
                    store.dispatch({
                        type: 'UPD_PHOTO_TRACK',
                        track: Object.assign({}, track, newVal),
                    });
                }
                this.setState({
                    isLoading: false
                });
            })
            .catch(error => {
                this.setState({
                    error: error,
                    isLoading: false
                });

            })
    }

    handleRowClick(event, key) {
        event.preventDefault();
        browserHistory.push('/d/photo/list/' + key);
    }

    render() {
        const deposit = store.getState();
        const trackList = deposit.photoTrack;

        //TODO row.onClick={(event) => onClick(event, value.ticket)}
        return (
            <div>
                <ErrAlert error={this.state.error} />
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <td>Ticket</td>
                            <td>State</td>
                            <td>fileName</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trackList.map((value) => (
                                <tr key={value.ticket}
                                    onClick={(event) => this.handleRowClick(event, value.ticket)}
                                >
                                    <td>{value.ticket}</td>
                                    <td>{value.state}</td>
                                    <td>{value.name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default PhotoTrackList;
