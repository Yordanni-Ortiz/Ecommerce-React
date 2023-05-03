import React, { useState } from "react";
import $Cart from "./Cart";
import { Cart } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { setIsLogged } from "/src/store/slices/isLogged.slice";
import { useSelector, useDispatch } from "react-redux";
import "/src/assets/styles/Navbar.css";

function $Navbar() {
  const [launch, setLaunch] = useState(false);
  const isLogged = useSelector((state) => state.isLogged);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(setIsLogged());
    navigate("/");
  };

  return (
    <>
      <Navbar className="custom-navbar" variant="light" expand="sm">
        <Container id="header" fluid>
          <Navbar.Brand to="/" as={Link}>
            Electronic Shop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "130px" }}
              navbarScroll
            >
              <Nav.Link to="/" as={Link}>
                Products
              </Nav.Link>
              <Nav.Link to="/purchases" as={Link}>
                Purchases
              </Nav.Link>
              {!isLogged ? (
                <Nav.Link to="/login" as={Link}>
                  Sing In
                </Nav.Link>
              ) : (
                <Nav.Link to="/login" as={Link} onClick={() => logout()}>
                  Sing Out
                </Nav.Link>
              )}
            </Nav>
            <Button
              className="custom-button"
              variant="warning"
              onClick={() => setLaunch(!launch)}
            >
              <Cart />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <$Cart sendLaunch={(launch) => setLaunch(launch)} launch={launch} />
    </>
  );
}

export default $Navbar;
