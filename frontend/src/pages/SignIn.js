import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Button,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import styled from "styled-components";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();
  if (localStorage.getItem("accessToken")) return <Redirect to="/task" />;

  const toSignUp = () => {
    history.push("/signup");
  };

  const formSubmit = async e => {
    e.preventDefault();
    setError(null);
    axios
      .post("http://localhost:3000/auth/signin", {
        username,
        password
      })
      .then(res => {
        localStorage.setItem("accessToken", res.data.accessToken);
        history.push("/task");
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        setError(errMsg);
      });
  };

  return (
    <FormWrapper>
      <Card style={{ backgroundColor: "#edf4ff", width: "600px" }}>
        <CardBody>
          <h1>Hello!</h1>
          <p>Fill in your username and password to sign in.</p>
          {error && <ErrorMessage message={error} />}

          <Form onSubmit={formSubmit}>
            <FormGroup row>
              <Col>
                <Input
                  name="username"
                  id="username"
                  placeholder="Username"
                  autoComplete="off"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                  }}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  autoComplete="off"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                />
              </Col>
            </FormGroup>

            <hr style={{ backgroundColor: "black" }} />

            <Button type="submit" color="primary" block>
              Sign In
            </Button>

            <Button color="danger" block onClick={toSignUp}>
              Don't have an account? Sign up now!!!
            </Button>
          </Form>
        </CardBody>
      </Card>
    </FormWrapper>
  );
};

export default SignIn;
