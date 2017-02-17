import { createStore, combineReducers } from 'redux';

import tokenReducer from './token.js'

const emptyReducer = function(state = {}, action) {
  return state;
}

const reducers = combineReducers({
  token: tokenReducer,
  empty: emptyReducer
});

const store = createStore(reducers);

store.subscribe(() => {
  console.log('STORE:', store.getState());
});

export default store;