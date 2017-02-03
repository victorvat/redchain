var React = require("react");
var ReactDOM = require("react-dom");
//import { Provider } from 'react-redux'
//var SchoolsList = require("../components/SchoolsList.jsx");

//import store from './appStore.jsx';

import LoginPage from './loginPage.jsx';
import PersonFindPage from './personFindPage.jsx';
import PersonListPage from './personListPage.jsx';
import MainPage from './mainPage.jsx';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

//import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store)

const content = (
    <Router history={browserHistory}>
        <Route path="/" component={MainPage}>
            <Route path="person">
                <IndexRoute component={PersonFindPage} />
                <Route path="find" component={PersonFindPage} />
                <Route path="all" component={PersonListPage} />
            </Route>
            <Route path="login" component={LoginPage} />
        </Route>
    </Router>
);

function render() {
    ReactDOM.render(content, document.getElementById("container"));    
}

render();
