import React from 'react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {Link} from 'react-router';


const Header = () => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          Collobarative Realtime Editor
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <NavItem><Link to={'/'}>Documents</Link></NavItem>
      </Nav>
    </Navbar>
  )
}

export default Header;