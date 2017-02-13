var React = require("react");
var ReactDOM = require("react-dom");

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import MainPage from './mainPage.jsx';
import LoginPage from './loginPage.jsx';

import DocPage from './docPage.jsx';
import PersonPage from './personPage.jsx';
import AgentPage from './agentPage.jsx';
import StatePage from './statePage.jsx';
import ContactPage from './contactPage.jsx';
import DocSpecPage from './docSpecPage.jsx';
import OpRulePage from './opRulePage.jsx';

const content = (
  <Router history={browserHistory}>
    <Route path="/" component={MainPage}>
      <Route path="/d">
        <Route path="doc">
          <IndexRoute component={DocPage.FindPage} />
          <Route path="create" component={DocPage.CreatePage} />
          <Route path=":pid"component={DocPage.EditPage} />
          <Route path="find" component={DocPage.FindPage} />
        </Route>
        <Route path="person">
          <IndexRoute component={PersonPage.FindPage} />
          <Route path="create" component={PersonPage.CreatePage} />
          <Route path=":pid"component={PersonPage.EditPage} />
          <Route path="find" component={PersonPage.FindPage} />
        </Route>
        <Route path="agent">
          <IndexRoute component={AgentPage.FindPage} />
          <Route path="create" component={AgentPage.CreatePage} />
          <Route path=":pid"component={AgentPage.EditPage} />
          <Route path="find" component={AgentPage.FindPage} />
        </Route>
        <Route path="state">
          <IndexRoute component={StatePage.FindPage} />
          <Route path="create" component={StatePage.CreatePage} />
          <Route path=":pid"component={StatePage.EditPage} />
          <Route path="find" component={StatePage.FindPage} />
        </Route>
        <Route path="contact">
          <IndexRoute component={ContactPage.FindPage} />
          <Route path="create" component={ContactPage.CreatePage} />
          <Route path=":pid"component={ContactPage.EditPage} />
          <Route path="find" component={ContactPage.FindPage} />
        </Route>
        <Route path="docspec">
          <IndexRoute component={DocSpecPage.FindPage} />
          <Route path="create" component={DocSpecPage.CreatePage} />
          <Route path=":pid"component={DocSpecPage.EditPage} />
          <Route path="find" component={DocSpecPage.FindPage} />
        </Route>
        <Route path="oprule">
          <IndexRoute component={OpRulePage.FindPage} />
          <Route path="create" component={OpRulePage.CreatePage} />
          <Route path=":pid"component={OpRulePage.EditPage} />
          <Route path="find" component={OpRulePage.FindPage} />
        </Route>
      </Route>
      <Route path="login" component={LoginPage} />
    </Route>
  </Router>
);

function render() {
    ReactDOM.render(content, document.getElementById("container"));    
}

render();
