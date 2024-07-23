import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/ResetPasswordForm.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
  const { token } = useParams(); // Obtén el token de la URL
  const navigate = useNavigate(); // Hook para navegar
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showFirstPassword, setShowFirstPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleShowFirstPassword = () => {
    setShowFirstPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowSecondPassword = () => {
    setShowSecondPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
      errors.password = "The passwords do not match";
      errors.confirmPassword = "The passwords do not match";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        successful();
        setErrors({});
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setErrors({ general: data.message || "Error changing the password." });
      }
    } catch (err) {
      errorRequest();
    }
  };

  const handlePasswordChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: null
    }));
  };

  const successful = () => toast("✔ Password has been reset.", {
    autoClose: 3000,
    onClose: () => navigate('/Login')
  });

  const errorRequest = () => toast("✘ An error occurred while sending the request.", {
    autoClose: 2000,
  });

  return (
    <div>
      {!errors.general ? (
        <Card className="card-register">
          <Form onSubmit={handleSubmit}>
            <h1>Reset password</h1>
            <Form.Group className="mb-3" controlId="formBasicResetPassword">
              <Form.Label>New password</Form.Label>
              <div className="password-wrapper">
                <Form.Control
                  className={`password ${errors.password ? "error-border" : ""}`}
                  type={showFirstPassword ? "text" : "password"}
                  placeholder="*********"
                  autoComplete="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange(setPassword)}
                  required
                />
                <span className="show-password-icon" onClick={toggleShowFirstPassword}>
                  <FontAwesomeIcon icon={showFirstPassword ? faEye : faEyeSlash} />
                </span>
                {errors.password && (
                  <span className="error-icon">
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                )}
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm new password</Form.Label>
              <div className="password-wrapper">
                <Form.Control
                  className={`password ${errors.confirmPassword ? "error-border" : ""}`}
                  type={showSecondPassword ? "text" : "password"}
                  placeholder="*********"
                  autoComplete="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  minLength={8}
                  onChange={handlePasswordChange(setConfirmPassword)}
                  required
                />
                <span className="show-password-icon" onClick={toggleShowSecondPassword}>
                  <FontAwesomeIcon icon={showSecondPassword ? faEye : faEyeSlash} />
                </span>
                {errors.confirmPassword && (
                  <span className="error-icon">
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                )}
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </Form.Group>
            <Button variant="warning" type="submit">
              Save
            </Button>
            <ToastContainer
              position="top-center"
              closeOnClick={true}
              pauseOnHover={true}
            />
          </Form>
        </Card>
      ) : (<div className="error-fullscreen">
          <h1 className="error-text" >Password reset token is invalid or has expired.</h1>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;



