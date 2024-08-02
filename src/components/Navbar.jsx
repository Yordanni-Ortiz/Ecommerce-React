import React, { useState, useEffect, useRef } from "react";
import $Cart from "./Cart";
import { Cart } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLogged, clearLogin } from "../store/slices/isLogged.slice";
import { BsBagCheckFill } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";
import { CiLogin, CiLogout } from "react-icons/ci";
import "../assets/styles/Navbar.css";

function $Navbar() {
  const [launch, setLaunch] = useState(false);
  const isLoggedIn = useSelector((state) => state.isLogged.isLoggedIn);
  const userName = useSelector((state) => state.isLogged.userName);
  const userFirstName = useSelector((state) => state.isLogged.userFirstName);
  const userLastName = useSelector((state) => state.isLogged.userLastName);
  const profileImageUrl = useSelector((state) => state.isLogged.profileImageUrl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [isLoggedIn]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearLogin());
    navigate("/");
    window.location.reload();
  };

  const handleDropdownItemClick = () => {
    setIsOpen(false);
    setIsMenuOpen(false);
  };

  const getFirstNameInitials = (firstName) => {
    const nameArray = firstName.trim().split(" ");
    const initials = nameArray.map(name => name[0]).join("").substring(0, 2).toUpperCase();
    return initials;
  };

  const getLastNameInitials = (lastName) => {
    if (!lastName) {
      return '';
    }

    const nameArray = lastName.trim().split(" ");
    if (nameArray.length > 1) {
      return nameArray[nameArray.length - 1][0].toUpperCase();
    } else {
      return nameArray[0][0].toUpperCase();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  // Acceder a la variable de entorno
  const defaultProfileImage = import.meta.env.VITE_PROFILE_IMAGE;

  // Log para depuración
  console.log("profileImageUrl: ", profileImageUrl);
  console.log("defaultProfileImage: ", defaultProfileImage);
  console.log("profileImageUrl === defaultProfileImage: ", profileImageUrl === defaultProfileImage);

  return (
    <>
      <Navbar className="custom-navbar" variant="light" expand="sm">
        <Container className="custom-container" id="header" fluid>
          <Navbar.Brand to="/" as={Link}>
            Electronic Shop
          </Navbar.Brand>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={`menu ${isMenuOpen ? 'show' : ''}`}>
            <Nav className="nav-menu">
              <Nav.Link className="navbar-options" onClick={() => handleNavLinkClick("/")}>
                <FaBoxOpen className="icon" /> Products
              </Nav.Link>
              <Nav.Link className="navbar-options" onClick={() => handleNavLinkClick("/purchases")}>
                <BsBagCheckFill className="icon" />Purchases
              </Nav.Link>
              {!isLoggedIn ? (
                <Nav.Link className="navbar-options" onClick={() => handleNavLinkClick("/login")}>
                  <CiLogin className="icon" />Sign In
                </Nav.Link>
              ) : (
                ""
              )}
            </Nav>

            {isLoggedIn && (
              <div className="user-dropdown-container" ref={dropdownRef}>
                <div className="user-name" onClick={toggleDropdown}>
                  <div className="user-photo">
                    {profileImageUrl && profileImageUrl !== defaultProfileImage ? (
                      <img src={profileImageUrl} alt="Profile" className="profile-image" />
                    ) : (
                      <div className="user-initials-name">
                        <div className="initial-name">{getFirstNameInitials(userFirstName)}</div>
                        <div className="initial-name">{getLastNameInitials(userLastName)}</div>
                      </div>
                    )}
                  </div>
                  <div className="user-name-name">{userName.toUpperCase()} <span className="centered-character">ˇ</span></div>
                </div>
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                  <li className="dropdown-item" onClick={handleDropdownItemClick}>
                    <Nav.Link className="nav-dropdown-options" onClick={() => handleNavLinkClick("/account")}>
                      My Account
                    </Nav.Link>
                  </li>
                  <li className="dropdown-item" onClick={handleDropdownItemClick}>
                    <Nav.Link className="nav-dropdown-options" onClick={() => handleNavLinkClick("/change-password")}>
                      My Password
                    </Nav.Link>
                  </li>
                  <hr />
                  <li className="dropdown-item log-out" onClick={logout}>Logout<CiLogout className="icon-logout" /></li>
                </ul>
              </div>
            )}
          </div>
        </Container>
        <Button
          className="custom-button"
          variant="warning"
          onClick={() => setLaunch(!launch)}
        >
          <Cart />
        </Button>
      </Navbar>
      <$Cart sendLaunch={(launch) => setLaunch(launch)} launch={launch} />
    </>
  );
}

export default $Navbar;
