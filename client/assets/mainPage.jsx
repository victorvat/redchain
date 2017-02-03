import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// import HeadNav from '../components/headNan.jsx';

const NavTask = ({
  name,
  hrefBase,
  eventKey
}) => (
    <NavDropdown eventKey={eventKey} title={name} id={"nav-dropdown-"+eventKey}>
        <LinkContainer to={hrefBase} activeHref="active">
            <NavItem href="#">Поиск</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <LinkContainer to={hrefBase+"/all"} activeHref="active">
            <NavItem href="#">Показать все</NavItem>
        </LinkContainer>
    </NavDropdown>
);
//   <MenuItem disabled eventKey="{eventKey}.3">Something else here</MenuItem>
//   <MenuItem disabled eventKey="{eventKey}.4">Separated link</MenuItem>
//                    <NavTask name="Персона" hrefBase="/person" eventKey="1"/>

class MainPage extends React.Component {
    render() {
        return (
          <dev>  
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">RedChain</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav role="navigation">
                    <NavTask name="Персона" hrefBase="/person" eventKey="1"/>
                    <LinkContainer to="/person" activeHref="active">
                        <NavItem eventKey={2}>Find_person</NavItem>
                    </LinkContainer>
                </Nav>
                <Nav pullRight>
                    <LinkContainer to="/login" activeHref="active">
                        <NavItem eventKey={99} href="#">Login</NavItem>
                    </LinkContainer>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
            {this.props.children}
          </dev>  
        )
    }
}

export default MainPage;


