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
    <Route path="/" component={MainPage}>
      <Route path="/d">
        <Route path="doc">
          <IndexRoute component={DocPage.FindPage} />
          <Route path="find" component={DocPage.FindPage} />
          <Route path="create" component={DocPage.CreatePage} />
          <Route path="edit/:cdoc" component={DocPage.EditPage} />
        </Route>
        <Route path="person">
          <IndexRoute component={PersonPage.FindPage} />
          <Route path="find" component={PersonPage.FindPage} />
          <Route path="create" component={PersonPage.CreatePage} />
          <Route path="edit/:pid" component={PersonPage.EditPage} />
        </Route>
        <Route path="agent">
          <IndexRoute component={AgentPage.FindPage} />
          <Route path="find" component={AgentPage.FindPage} />
          <Route path="create" component={AgentPage.CreatePage} />
          <Route path="edit/:cagent" component={AgentPage.EditPage} />
        </Route>
        <Route path="state">
          <IndexRoute component={StatePage.FindPage} />
          <Route path="find" component={StatePage.FindPage} />
          <Route path="create" component={StatePage.CreatePage} />
          <Route path="edit/:cstate" component={StatePage.EditPage} />
        </Route>
        <Route path="contact">
          <IndexRoute component={ContactPage.FindPage} />
          <Route path="find" component={ContactPage.FindPage} />
          <Route path="create" component={ContactPage.CreatePage} />
          <Route path="edit/:ccontact" component={ContactPage.EditPage} />
        </Route>
        <Route path="docspec">
          <IndexRoute component={DocSpecPage.FindPage} />
          <Route path="find" component={DocSpecPage.FindPage} />
          <Route path="create" component={DocSpecPage.CreatePage} />
          <Route path="edit/:cspec" component={DocSpecPage.EditPage} />
        </Route>
        <Route path="oprule">
          <IndexRoute component={OpRulePage.FindPage} />
          <Route path="find" component={OpRulePage.FindPage} />
          <Route path="create" component={OpRulePage.CreatePage} />
          <Route path="edit/:crule" component={OpRulePage.EditPage} />
        </Route>
      </Route>
      <Route path="login" component={LoginPage} />
    </Route>
)

class MainRoute extends React.Component {
    render() {
        console.log('Route', browserHistory.getCurrentLocation());
        return (
            <Router history={browserHistory}>
                {content}
            </Router>
        )
    }
}

function render() {
    ReactDOM.render(<MainRoute />, document.getElementById("container"));    
}

render();
