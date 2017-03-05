import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Button, Table } from 'react-bootstrap';

import store from '../store';

class PhotoTrackList extends React.Component {
    constructor(props) {
        super(props);

        this.handleRowClick = this.handleRowClick.bind(this);
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
        )
    }
}

export default PhotoTrackList;
