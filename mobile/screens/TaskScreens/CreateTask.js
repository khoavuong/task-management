import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { gql } from "apollo-boost";
import { Card, Text, Input, Button } from "react-native-elements";
import { useMutation } from "@apollo/react-hooks";

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!) {
    createTask(newTaskForm: { title: $title, description: $description }) {
      _id
      userId
      title
      description
      status
    }
  }
`;

const CreateTask = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createTask] = useMutation(CREATE_TASK);

  const submitTask = () => {
    createTask({ variables: { title, description } })
      .then(() => {
        props.navigation.navigate("TaskList");
      })
      .catch((err) => {
        Alert.alert("Title and Description should not be empty");
      });
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={{ borderRadius: 4 }}>
        <Text h4>Create a new Task</Text>
        <Text>Provide information about the task you wish to complete</Text>
        <Input placeholder="Title" onChangeText={(value) => setTitle(value)} />
        <Input
          placeholder="Description"
          containerStyle={{ marginBottom: 10 }}
          onChangeText={(value) => setDescription(value)}
        />
        <Button title="Create new task" onPress={submitTask}></Button>
      </Card>
    </View>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#434e5e",
    padding: 20,
    height: "100%",
    justifyContent: "center",
  },
});
