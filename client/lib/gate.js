// load.js с промисами
import store from '../store';

function getJson(url) {
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

function broker(url) {
  console.log("GATE.broker", url);

  const token = store.getState().token;
  console.log("GATE.broker token", token);

  const xhr = new XMLHttpRequest();
  xhr.open('post', url);
  xhr.setRequestHeader('X-Access-Token', token);
  return xhr;
};

function post(url, data) {
  const xhr = broker(url);
  return new Promise((success, fail) => {
    //const xhr = new XMLHttpRequest();
    //xhr.open('post', url);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        success(xhr.response);
      } else if (xhr.status === 500) {
        console.log('ERR:', xhr.status, xhr.response.message);
        fail(xhr.response.message);
      } else {
        console.log('ERR:', xhr.statusText);
        fail(xhr.statusText);
      }
    });

    xhr.addEventListener('error', () => {
      console.log('ERR: Network Error');
      fail('Network Error');
    });

    xhr.send(JSON.stringify(data));
  });
};

function getRaw(url, data) {
  const xhr = broker(url);
  return new Promise((success, fail) => {
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        success(xhr.response);
      } else if (xhr.status === 500) {
        console.log('ERR:', xhr.status, xhr.response.message);
        fail(xhr.response.message);
      } else {
        console.log('ERR:', xhr.statusText);
        fail(xhr.statusText);
      }
    });

    xhr.addEventListener('error', () => {
      console.log('ERR: Network Error');
      fail('Network Error');
    });

    xhr.send(JSON.stringify(data));
  });
}

export default { getJson, post, getRaw, broker };