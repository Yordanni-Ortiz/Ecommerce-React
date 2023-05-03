import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import linkedin from "../../public/linkedin.png";
import whatsapp from "../../public/whatsapp.png";
import gmail from "../../public/gmail.png";
import instagram from "../../public/instagram.png";
import "/src/assets/styles/Footer.css";

function Footer() {
  const wts =
    "https://api.whatsapp.com/send/?phone=584126351466&text=Hola%2C+%C2%A1Mucho+gusto%21%0AGracias+por+escribir.%0A%C2%BFEn+qu%C3%A9+puedo+ayudarte%3F&type=phone_number&app_absent=0";
  const mail =
    "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=yordannimod@gmail.com";
  const linkedIn = "https://www.linkedin.com/in/yordanni-ortiz/";
  const instaGram = "https://www.instagram.com/yordanni.ortiz/";

  return (
    <>
      <Navbar className="nav-footer" variant="dark">
        <Container id="footer" className="flex-column" fluid>
          <Row xs={1} md={2} lg={4}>
            <Col>
              <Nav className="flex-column">
                <Nav.Link>Get to Know Us</Nav.Link>
                <Nav.Link>Careers</Nav.Link>
                <Nav.Link>Blog</Nav.Link>
                <Nav.Link>Investor Relations</Nav.Link>
                <Nav.Link>Affiliates</Nav.Link>
              </Nav>
            </Col>
            <Col>
              <Nav className="flex-column">
                <Nav.Link>Let Us Help You</Nav.Link>
                <Nav.Link>Your Account</Nav.Link>
                <Nav.Link>Your Orders</Nav.Link>
                <Nav.Link>Shipping Rates & Policies</Nav.Link>
                <Nav.Link>Privacy Policy</Nav.Link>
              </Nav>
            </Col>
            <Col>
              <Nav className="flex-column">
                <Nav.Link>Payment Products</Nav.Link>
                <Nav.Link>Business Card</Nav.Link>
                <Nav.Link>Shop with Points</Nav.Link>
                <Nav.Link>Reload Your Balance</Nav.Link>
                <Nav.Link>Currency Converter</Nav.Link>
              </Nav>
            </Col>
            <Col>
              <Nav className="flex-column">
                <Nav.Link>Follow Us</Nav.Link>
                <div className="footer-icons">
                  <div className="footer-icons b1">
                    <a href={linkedIn} target="blank">
                      <img src={linkedin} alt="" />
                    </a>
                    <a href={wts} target="blank">
                      <img src={whatsapp} alt="" />
                    </a>
                  </div>
                  <div className="footer-icons b2">
                    <a href={mail} target="blank">
                      <img src={gmail} alt="" />
                    </a>
                    <a href={instaGram} target="blank">
                      <img src={instagram} alt="" />
                    </a>
                  </div>
                </div>
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <div className="nav-presentation">
        <h6>
          Si deseas contactarme, puedes hacerlo a través de mi correo
          electrónico{" "}
          <a href={mail} target="blank">
            yordannimod@gmail.com
          </a>{" "}
          y también puedes seguirme en{" "}
          <a href={linkedIn} target="blank">
            LinkedIn
          </a>{" "}
          para mantenerte informado sobre mis últimas actualizaciones y
          proyectos.
        </h6>
        <p>© 2023 - all rights reserved</p>
      </div>
    </>
  );
}

export default Footer;
