import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import axios from "axios";
import "../assets/styles/LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogged } from "../store/slices/isLogged.slice";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState("yordannimod@gmail.com");
  const [password, setPassword] = useState("test1234");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    const data = {
      email,
      password,
    };

    axios
      .post("http://localhost:8080/api/v1/users/login", data)
      .then((resp) => {
        localStorage.setItem("token", resp.data.token);
        dispatch(setIsLogged({ 
          userName: resp.data.user.userName,
          userFirstName: resp.data.user.firstName,
          userLastName: resp.data.user.lastName,
          userEmail: resp.data.user.email,
          userPhone: resp.data.user.phone
        }));
        
        localStorage.setItem("userName", resp.data.user.userName);
        localStorage.setItem("userFirstName", resp.data.user.firstName);
        localStorage.setItem("userLastName", resp.data.user.lastName);
        localStorage.setItem("userEmail", resp.data.user.email);
        localStorage.setItem("userPhone", resp.data.user.phone);
        loginSuccessful();
        resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data.message === "Credentials invalid") {
          setErrors({
            email: "Invalid email or password.",
            password: "Invalid email or password."
          });
        } else {
          loginError();
        }
      })
      .finally(() => {
        dispatch(setIsLoading(false));
      });
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const loginSuccessful = () => toast("✔ Login successful! Redirecting...", {
    onClose: () => {
      navigate('/') 
      window.location.reload(); 
    } 
  });

  const loginError = () => toast("✘ Login failed. Please try again.");

  return (
    <Card className="card-login">
      <Form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <div className="password-wrapper">
          <Form.Control
            className={`email ${errors.email ? "error-border" : ""}`}
            type="email"
            name="email"
            placeholder="Enter email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, email: null }));
            }}
          />
          {errors.email && (
              <span className="error-icon ">
                  <FontAwesomeIcon icon={faXmark} />
              </span>
            )}</div>
          {errors.email && <p className="error-message">{errors.email}</p>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <div className="password-wrapper">
            <Form.Control
              className={`password ${errors.password ? "error-border" : ""}`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, password: null }));
              }}
            />
            <span className="show-password-icon" onClick={toggleShowPassword}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
            {errors.password && (
              <span className="error-icon">
                  <FontAwesomeIcon icon={faXmark} />
              </span>
            )}
          </div>
          {errors.password && <p className="error-message">{errors.password}</p>}
        </Form.Group>
        <Button variant="warning" type="submit">
          Submit
        </Button>
        <div className="mt-3">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
        <div className="mt-3">
          <i className="fa-solid fa-lock"></i>
          <p>
            <FontAwesomeIcon icon={faLock} className='upload-icon' />
            <Link className="fa-solid fa-lock" to="/reset-password">Forgot your password?</Link>
          </p>
        </div>
      </Form>
      <ToastContainer
        position="top-center" 
        closeOnClick={true}
        pauseOnHover={true}
        autoClose={1500}
      />
    </Card>
  );
};

export default Login;
