import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Card, Input, Text, Button } from "react-native-elements";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const SIGN_UP = gql`
  mutation SignUp($username: String!, $password: String!) {
    signUp(signUpForm: { username: $username, password: $password }) {
      username
    }
  }
`;

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signUp] = useMutation(SIGN_UP);

  const onSignUp = async () => {
    signUp({ variables: { username: username, password: password } })
      .then(async (response) => {
        Alert.alert("Sign up successfully");
        props.navigation.navigate("SignIn");
      })
      .catch((err) => {
        Alert.alert("Wrong format");
      });
  };

  const toSignUp = async () => {
    props.navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Card
        containerStyle={{
          borderRadius: 5,
          backgroundColor: "#edf4ff",
          width: "100%",
        }}
      >
        <Text h1>Join us!</Text>
        <Text>Start managing tasks easily.</Text>
        <Input
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          secureTextEntry={true}
          placeholder="Password"
          containerStyle={{ marginBottom: 20 }}
          onChangeText={(text) => setPassword(text)}
        />
        <Text style={{ marginBottom: 20 }}>
          Passwords must contain at least 1 upper case letter, 1 lower case
          letter and one number OR special charracter.
        </Text>
        <Button
          title="Sign Up"
          containerStyle={{ marginBottom: 10 }}
          onPress={onSignUp}
        ></Button>
        <Button
          title="Return to Sign In screen"
          buttonStyle={{ backgroundColor: "red" }}
          onPress={toSignUp}
        ></Button>
      </Card>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#434e5e",
    padding: 20,
  },
});
