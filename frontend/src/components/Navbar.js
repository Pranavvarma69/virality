// src/components/AppNavbar.js
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { logoutUser } from "../api/authAPI";

const AppNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Helper function to read from localStorage
  const getUserFromStorage = () => {
    try {
      const raw = localStorage.getItem("userInfo");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // Run once when Navbar loads + whenever user changes
  useEffect(() => {
    // Initial load
    setUser(getUserFromStorage());

    // Event listeners for changes
    const handleUserChange = () => {
      setUser(getUserFromStorage());
    };

    window.addEventListener("storage", handleUserChange);
    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Influencer virality</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>🏆 Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/analytics">
              <Nav.Link>📈 Analytics</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/influencers">
              <Nav.Link>👤 Influencers</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/predict">
              <Nav.Link>🤖 Predict</Nav.Link>
            </LinkContainer>
            
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <NavDropdown title={`👋 ${user.name || user.username || "User"}`} id="user-dropdown">
                <NavDropdown.Item onClick={handleLogout}>🚪 Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button variant="outline-light" className="me-2">Login</Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="light" className="text-dark">Register</Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;