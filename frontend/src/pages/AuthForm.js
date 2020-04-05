import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import styled from "styled-components";
import ErrorMessage from "../components/ErrorMessage";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const AuthForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (localStorage.getItem("accessToken")) return <Redirect to="/task" />;

  const redirect = () => {
    props.redirect();
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    props.formSubmit(username, password, setError);
    setUsername("");
    setPassword("");
  };

  return (
    <FormWrapper>
      <Card style={{ backgroundColor: "#edf4ff", width: "600px" }}>
        <CardBody>
          <h1>{props.title}!</h1>
          <p>{props.description}</p>
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
                  onChange={(e) => {
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Col>
            </FormGroup>

            {props.children}
            <hr style={{ backgroundColor: "black" }} />

            <Button type="submit" color="primary" block>
              Sign In
            </Button>

            <Button color="danger" block onClick={redirect}>
              Don't have an account? Sign up now!!!
            </Button>
          </Form>
        </CardBody>
      </Card>
    </FormWrapper>
  );
};

AuthForm.defaultProps = {
  title: "Title",
  description: "Description",
};

export default AuthForm;
