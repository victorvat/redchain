///

function photoTrack(state = [], action) {
    if (action.type === 'ADD_PHOTO_TRACK') {
        return [...state, action.track];
    }
    if (action.type === 'DEL_PHOTO_TRACK') {
        const ticket = action.track.ticket;
        return state.filter((oldTrack) => (oldTrack.ticket !== ticket));
    }
    if (action.type === 'UPD_PHOTO_TRACK') {
        const track = track.ticket;
        return state.map((oldTrack) => {
            return (oldTrack.ticket === track.ticket) ? track : oldTrack; 
        });
    }
    if (action.type === 'CLR_PHOTO_TRACK') {
        return [];
    }
    return state;
}

export default photoTrack;