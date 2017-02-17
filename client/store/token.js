//

function tokenReducer(state = null, action) {
  if (action.type === 'LOGON') {
    return action.token;
  }
  if (action.type === 'LOGOFF') {
    return undefined;
  }
  return state;
}

export default tokenReducer;

// Создание хранилища с передачей редьюсера
// var store = Redux.createStore(userReducer);

/* Отправка первого экшена, чтобы выразить намерение изменить состояние */
// store.dispatch({
//   type: 'ADD_USER',
//   user: {name: 'Dan'}
// });
// var dispatcher = require("../dispatcher");
