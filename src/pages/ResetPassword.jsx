import React, { useState } from "react";
import "../assets/styles/ResetPassword.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});  // Clear previous errors

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/request-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Recovery email sent") {
          emailSend();
          setEmail('');
        }
      } else {
        if (data.message === "Email not found") {
          setErrors({ email: "Email not found." });
        }
      }
    } catch (err) {
      errorRequest();
    }
  };

  const emailSend = () => toast("✔ The recovery email has been sent successfully.");
  const errorRequest = () => toast("✘ An error occurred while sending the request.");

  return (
    <div className="reset-password-container">
      <Card className="card-register">
        <Form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <div className="password-wrapper">
              <Form.Control
                className={`email ${errors.email ? "error-border" : ""}`}
                type="email"
                placeholder="email@example.com"
                autoComplete="user-name"
                name="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                }}
              />
              {errors.email && (
                <p className="error-icon-reset-password">
                  <FontAwesomeIcon icon={faXmark} />
                </p>
              )}
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
          </Form.Group>

          <Button variant="warning" type="submit">
            Submit
          </Button>

          <div className="mt-3">
            <p>
              Remember it? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </Form>
        <ToastContainer 
          position="top-center" 
          autoClose={2000} 
          pauseOnHover={true}
        />
      </Card>
    </div>
  );
};

export default ResetPassword;
