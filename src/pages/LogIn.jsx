import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {setIsLogged} from "/src/store/slices/isLogged.slice";
import {setIsLoading} from "/src/store/slices/isLoading.slice";

const Login = () => {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test1234");
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    dispatch(setIsLoading(true));
    e.preventDefault();

    const data = {
      email,
      password
    };

    axios
      .post("https://ecommerce-api-94zo.onrender.com/api/v1/users/login", data)
      .then((resp) => {
        localStorage.setItem("token", resp.data.token);
	dispatch(setIsLogged());
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setAlert(true);
      })
      .finally(() => dispatch(setIsLoading(false)));
  };

  return (
    <>
      <Card style={{ maxWidth: 500, margin: "3rem auto", padding: "2rem" }}>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <h1>Login</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="warning" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default Login;
