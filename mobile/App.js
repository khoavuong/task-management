import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";

// Graphql and Apollo
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./config/apollo";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import SignIn from "./screens/AuthScreens/SignIn";
import SignUp from "./screens/AuthScreens/SignUp";
import TaskList from "./screens/TaskScreens/TaskList";
import Loading from "./screens/Loading";
import CreateTask from "./screens/TaskScreens/CreateTask";

const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  useEffect(() => {
    (async function () {
      const token = await AsyncStorage.getItem("accessToken");
      if (token !== null) setIsSignedIn(true);
      else setIsSignedIn(false);
    })();
  }, []);

  const renderStack = () => {
    if (isSignedIn === false)
      return (
        <>
          <Stack.Screen
            name="SignIn"
            options={{
              headerTitleAlign: "center",
            }}
          >
            {(props) => <SignIn {...props} setIsSignedIn={setIsSignedIn} />}
          </Stack.Screen>

          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerTitleAlign: "center",
            }}
          />
        </>
      );
    else if (isSignedIn === true)
      return (
        <>
          <Stack.Screen
            name="TaskList"
            options={{
              headerTitleAlign: "center",
            }}
          >
            {(props) => <TaskList {...props} setIsSignedIn={setIsSignedIn} />}
          </Stack.Screen>
          <Stack.Screen
            name="CreateTask"
            component={CreateTask}
            options={{
              headerTitleAlign: "center",
            }}
          ></Stack.Screen>
        </>
      );
    else
      return (
        <>
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{
              headerTitleAlign: "center",
            }}
          />
        </>
      );
  };

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>{renderStack()}</Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
