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
import ErrorMessage from "../components/ErrorMessage";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const SIGN_UP = gql`
  mutation SignUp($username: String!, $password: String!) {
    signUp(signUpForm: { username: $username, password: $password }) {
      username
      password
    }
  }
`;

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();
  const [signUp] = useMutation(SIGN_UP);

  if (localStorage.getItem("accessToken")) return <Redirect to="/task" />;

  const toSignIn = () => {
    history.push("/signin");
  };

  const formSubmit = async e => {
    e.preventDefault();
    setError(null);
    signUp({ variables: { username: username, password: password } })
      .then(() => {
        history.push("/");
      })
      .catch(err => {
        setError(err.graphQLErrors[0].message.message);
      });
    setUsername("");
    setPassword("");
  };

  return (
    <FormWrapper>
      <Card style={{ backgroundColor: "#edf4ff", width: "600px" }}>
        <CardBody>
          <h1>Join us</h1>
          <p>Start managing tasks easily.</p>
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
            <p>
              Passwords must contain at least 1 upper case letter, 1 lower case
              letter and one number OR special charracter.
            </p>
            <hr style={{ backgroundColor: "black" }} />

            <Button type="submit" color="primary" block>
              Sign Up
            </Button>

            <Button color="danger" block onClick={toSignIn}>
              Return to Sign in
            </Button>
          </Form>
        </CardBody>
      </Card>
    </FormWrapper>
  );
};

export default SignUp;
