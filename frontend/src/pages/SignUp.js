import React from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import AuthForm from "./AuthForm";

const SIGN_UP = gql`
  mutation SignUp($username: String!, $password: String!) {
    signUp(signUpForm: { username: $username, password: $password }) {
      username
    }
  }
`;

const SignUp = () => {
  const history = useHistory();
  const [signUp] = useMutation(SIGN_UP);

  const toSignIn = () => {
    history.push("/signin");
  };

  const formSubmit = (username, password, setError) => {
    signUp({ variables: { username: username, password: password } })
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        setError(err.graphQLErrors[0].message.message);
      });
  };

  return (
    <AuthForm
      title="Join us"
      description="Start managing tasks easily."
      redirect={toSignIn}
      formSubmit={formSubmit}
    >
      <p>
        Passwords must contain at least 1 upper case letter, 1 lower case letter
        and one number OR special charracter.
      </p>
    </AuthForm>
  );
};

export default SignUp;
