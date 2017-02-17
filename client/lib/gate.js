// load.js с промисами
import store from '../store';

function get(url) 
{
  console.log("GATE.get", url);

  return new Promise((success, fail) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      xhr.status === 200
        ? success(xhr.response)
        : fail(xhr.statusText);
    });

    xhr.addEventListener('error', () => {
      fail('Network Error');
    });

    xhr.send();
  });
};

function post(url, data)
{ 
  console.log("GATE.post", url);

  var state = store.getState();
  var token = state.token;
  console.log("GATE.post token", token);

  return new Promise((success, fail) => {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('X-Access-Token', token);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      if(xhr.status === 200) {
        success(xhr.response);
      } else if(xhr.status === 500) { 
        fail(xhr.response.message); 
      } else {
        fail(xhr.statusText);
      }
    });

    xhr.addEventListener('error', () => {
      fail('Network Error');
    });

    xhr.send( JSON.stringify(data) );
  });
};

export default { get, post };