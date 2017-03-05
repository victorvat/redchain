///

function photoTrack(state = [], action) {
    if (action.type === 'ADD_PHOTO_TRACK') {
        return [...state, action.track];
    }
    if (action.type === 'DEL_PHOTO_TRACK') {
        const ticket = action.ticket;
        return state.filter((track) => (track.ticket !== ticket))
    }
    return state;
}

export default photoTrack;