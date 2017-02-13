import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const nav_content = (
    <Navbar.Collapse>
      <Nav role="navigation">
        <NavDropdown eventKey={1} title="Find" id="nav-dropdown-1">

          <LinkContainer to="/d/doc/find" activeHref="active">
            <NavItem href="#">Документ</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/person/find" activeHref="active">
            <NavItem href="#">Персона</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/agent/find" activeHref="active">
            <NavItem href="#">Агент</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/state/find" activeHref="active">
            <NavItem href="#">Состояние</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/contact/find" activeHref="active">
            <NavItem href="#">Contact</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/docspec/find" activeHref="active">
            <NavItem href="#">DocSpec</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/oprule/find" activeHref="active">
            <NavItem href="#">OpRule</NavItem>
          </LinkContainer>
        </NavDropdown>
        <NavDropdown eventKey={2} title="Create" id="nav-dropdown-2">

          <LinkContainer to="/d/doc/crate" activeHref="active">
            <NavItem href="#">Документ</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/person/crate" activeHref="active">
            <NavItem href="#">Персона</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/agent/crate" activeHref="active">
            <NavItem href="#">Агент</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/state/crate" activeHref="active">
            <NavItem href="#">Состояние</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/contact/crate" activeHref="active">
            <NavItem href="#">Contact</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/docspec/crate" activeHref="active">
            <NavItem href="#">DocSpec</NavItem>
          </LinkContainer>
          <LinkContainer to="/d/oprule/crate" activeHref="active">
            <NavItem href="#">OpRule</NavItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <LinkContainer to="/login" activeHref="active">
            <NavItem eventKey={99} href="#">Login</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
);  

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
                {nav_content}
            </Navbar>
            {this.props.children}
          </dev>  
        )
    }
}

export default MainPage;


