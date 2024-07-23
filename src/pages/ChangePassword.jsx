import React, { useState } from "react";
import "../assets/styles/ChangePassword.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showFirstPassword, setShowFirstPassword] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
    };

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
            const token = localStorage.getItem("token"); // Ajusta esto según tu implementación
            const response = await fetch('http://localhost:8080/api/v1/users/change-pafssword', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ username, currentPassword, password }),
            });

            if (response.ok) {
                successful();
                setErrors({});
                setUsername("");
                setCurrentPassword("");
                setPassword("");
                setConfirmPassword("");
            } else {
                const data = await response.json();
                // Verifica si el mensaje de error es "Current password is incorrect"
                if (data.message === "Current password is incorrect") {
                    setErrors({ currentPassword: "Current password is incorrect" });
                } 
            }
        } catch (err) {
            errorRequest()
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
        autoClose: 2000,
    });

    const errorRequest = () => toast("✘ An error occurred while sending the request.", {
        autoClose: 2000,
    });


    return (
        <div>
            <Card className="card-register">
                <Form onSubmit={handleSubmit}>
                    <h1>Change Password</h1>
                    {errors.general && <p className="error-message">{errors.general}</p>}
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label className="sr-only">Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            style={{ display: 'none' }} // Ocultar el campo
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCurrentPassword">
                        <Form.Label>Current password</Form.Label>
                        <div className="password-wrapper">
                            <Form.Control
                                className={`password ${errors.currentPassword ? "error-border" : ""}`}
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="*********"
                                autoComplete="current-password"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={handlePasswordChange(setCurrentPassword)}
                                required
                            />
                            <span className="show-password-icon" onClick={toggleShowCurrentPassword}>
                                <FontAwesomeIcon icon={showCurrentPassword ? faEye : faEyeSlash} />
                            </span>
                            {errors.currentPassword && (
                                <span className="error-icon .icon-x-login-email">
                                    <FontAwesomeIcon icon={faXmark} />
                                </span>
                            )}
                        </div>
                        {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicResetPassword">
                        <Form.Label>New password</Form.Label>
                        <div className="password-wrapper">
                            <Form.Control
                                className={`password ${errors.password ? "error-border" : ""}`}
                                type={showFirstPassword ? "text" : "password"}
                                placeholder="*********"
                                autoComplete="new-password"
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
                                autoComplete="new-password"
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
        </div>
    );
};

export default ChangePassword;