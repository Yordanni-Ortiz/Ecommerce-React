import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import PhoneInput from 'react-phone-input-2';
import "../assets/styles/Register.css";
import axios from 'axios';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: 've'
  });

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePhone = (value, countryData) => {
    setFormData((prevState) => ({
      ...prevState,
      phone: value,
      country: countryData.countryCode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) {
      phoneError()
      return;
    }
    // Lógica para enviar el formulario
    console.log('Form submitted', formData);
    try {
      await axios.post("http://localhost:8080/api/v1/users", formData);
      successful();
      resetForm();
     
    } catch (error) {
      console.error('Error registering user:', error.response.data.message);
      if (error.response && error.response.data.message === 'llave duplicada viola restricción de unicidad «users_email_key»') {
        emailDuplicated();
      } else {
        unsuccessful();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      country: 've'
    });
  };
  
  const successful = () => toast("✔ User registered successfully.");
  const unsuccessful = () => toast("✘ Error registering user.");
  const emailDuplicated = () => toast("This email is already in use, please use a different one.");
  const phoneError = () => toast("Enter a correct phone number.")

  return (
    <div>
      <Card className='card-register'>
        <Form onSubmit={handleSubmit}>
          <h1>Register</h1>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <div className="name-fields">
              <Form.Control className='first-name' id="formBasicFirstName"
                type="text"
                value={formData.firstName}
                onChange={handleChangeData}
                placeholder="First name"
                autoComplete="user-name"
                name="firstName"
                required
              />
              <Form.Control className='last-name' id="formBasicLastName"
                type="text"
                value={formData.lastName}
                onChange={handleChangeData}
                placeholder="Last name"
                autoComplete="user-name"
                name="lastName"
                required
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <Form.Label>Phone number</Form.Label>
            <PhoneInput
              className="phone"
              country={formData.country}
              value={formData.phone}
              onChange={handleChangePhone}
              containerStyle={{ width: '100%' }}
              inputStyle={{ width: '100%' }}
              inputProps={{
                required: true,
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className='email'
              value={formData.email}
              onChange={handleChangeData}
              type="email"
              placeholder="email@example.com"
              autoComplete="user-name"
              name="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className='password-wrapper'>
              <Form.Control
                className='password'
                value={formData.password}
                type={showPassword ? "text" : "password"}
                onChange={handleChangeData}
                placeholder="********"
                name="password"
                autoComplete="current-password" 
                minLength={8}
                required
              />
              <span className="show-password-icon" onClick={toggleShowPassword}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
          </Form.Group>
          
          <Button variant="warning" type="submit">
            Submit
          </Button>
          <div className="mt-3">
            <p>
              You have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
          <ToastContainer
            position="top-center" 
            closeOnClick={true}
            pauseOnHover={true}
            autoClose={3000} 
          />
        </Form>
      </Card>
    </div>
  );
};

export default Register;