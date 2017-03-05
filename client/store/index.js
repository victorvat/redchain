import { createStore, combineReducers } from 'redux';

import tokenReducer from './token.js'
import photoTrack from './photoTrack.js'

const emptyReducer = function(state = {}, action) {
  return state;
}

const reducers = combineReducers({
  token: tokenReducer,
  photoTrack
});

const store = createStore(reducers);

store.subscribe(() => {
  console.log('STORE:', store.getState());
});

export default store;