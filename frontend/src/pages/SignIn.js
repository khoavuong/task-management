import React from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import AuthForm from "./AuthForm";

const SIGN_IN = gql`
  mutation SignIn($username: String!, $password: String!) {
    signIn(signInForm: { username: $username, password: $password }) {
      accessToken
    }
  }
`;

const SignIn = () => {
  const history = useHistory();
  const [signIn] = useMutation(SIGN_IN);

  const toSignUp = () => {
    history.push("/signup");
  };

  const formSubmit = (username, password, setError) => {
    signIn({ variables: { username: username, password: password } })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.signIn.accessToken);
        history.push("/task");
      })
      .catch((err) => {
        setError(err.graphQLErrors[0].message.message);
      });
  };

  return (
    <AuthForm
      title="Hello"
      description="Fill in your username and password to sign in."
      redirect={toSignUp}
      formSubmit={formSubmit}
    ></AuthForm>
  );
};

export default SignIn;
