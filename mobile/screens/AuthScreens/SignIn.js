import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Card, Input, Text, Button } from "react-native-elements";
import { AsyncStorage } from "react-native";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const SIGN_IN = gql`
  mutation SignIn($username: String!, $password: String!) {
    signIn(signInForm: { username: $username, password: $password }) {
      accessToken
    }
  }
`;

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signIn] = useMutation(SIGN_IN);

  const onSignIn = async () => {
    AsyncStorage.removeItem("accessToken");
    signIn({ variables: { username: username, password: password } })
      .then(async (response) => {
        await AsyncStorage.setItem(
          "accessToken",
          response.data.signIn.accessToken
        );
        props.setIsSignedIn(true);
      })
      .catch((err) => {
        Alert.alert("Wrong username or password");
      });
  };

  const toSignUp = async () => {
    props.navigation.navigate("SignUp");
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
        <Text h1>Hello!</Text>
        <Text>Fill in your username and password to sign in.</Text>
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
        <Button
          title="Sign In"
          containerStyle={{ marginBottom: 10 }}
          onPress={onSignIn}
        ></Button>
        <Button
          title="Don't have an account? Sign up now!!!"
          buttonStyle={{ backgroundColor: "red" }}
          onPress={toSignUp}
        ></Button>
      </Card>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#434e5e",
    padding: 20,
  },
});
