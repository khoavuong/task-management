import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { AsyncStorage } from "react-native";
import { gql } from "apollo-boost";
import { useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Card, Text, Button, SearchBar } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";

const GET_TASKS = gql`
  {
    tasks {
      _id
      userId
      title
      description
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateStatus($status: TaskStatus!, $id: ID!) {
    updateStatus(id: $id, newStatus: { status: $status }) {
      _id
      status
      title
      description
    }
  }
`;

const searchStatus = [
  {
    value: "IN_PROGRESS",
  },
  {
    value: "DONE",
  },
  {
    value: "OPEN",
  },
  {
    value: "NO FILTER",
  },
];

const status = [
  {
    value: "IN_PROGRESS",
  },
  {
    value: "DONE",
  },
  {
    value: "OPEN",
  },
];

const TaskList = (props) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data, refetch } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateStatus] = useMutation(UPDATE_STATUS);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      try {
        refetch();
      } catch (err) {
        console.log(err);
      }
      if (data) {
        setTasks(data.tasks);
      }
    });

    try {
      refetch();
    } catch (err) {
      console.log(err);
    }
    if (data) {
      setTasks(data.tasks);
    }

    return unsubscribe;
    /* (() => {
      try {
        refetch();
      } catch (err) {
        console.log(err);
      }
      if (data) {
        console.log(data.tasks.length);
        setTasks(data.tasks);
      }
    })(); */
  }, [props.navigation, data]);

  const tasksRender = () => {
    let filterdTasks;
    if (!searchTerm && statusFilter)
      filterdTasks = tasks.filter((task) => task.status === statusFilter);
    else if (searchTerm && !statusFilter)
      filterdTasks = tasks.filter(
        (task) =>
          task.title.includes(searchTerm) ||
          task.description.includes(searchTerm)
      );
    else if (searchTerm && statusFilter)
      filterdTasks = tasks
        .filter(
          (task) =>
            task.title.includes(searchTerm) ||
            task.description.includes(searchTerm)
        )
        .filter((task) => task.status === statusFilter);
    else filterdTasks = tasks;

    return filterdTasks.map((task) => (
      <Card
        key={task._id}
        containerStyle={{
          borderRadius: 5,
          backgroundColor: "#edf4ff",
        }}
      >
        <Text h4 style={{ textAlign: "center", marginBottom: 20 }}>
          {task.title}
        </Text>
        <Text>{task.description}</Text>
        <Dropdown
          data={status}
          value={task.status}
          onChangeText={(value) => onStatusChange(value, task._id)}
        />
        <Button
          title="Delete"
          buttonStyle={{ backgroundColor: "red" }}
          onPress={() => onDeleteClick(task._id)}
        ></Button>
      </Card>
    ));
  };

  const logout = () => {
    AsyncStorage.removeItem("accessToken");
    props.setIsSignedIn(false);
  };

  const search = (value) => {
    setSearchTerm(value);
  };

  const onStatusChange = (status, id) => {
    updateStatus({ variables: { status, id } })
      .then(() => {
        setTasks(
          tasks.map((task) => {
            if (task._id === id) {
              const temp = { ...task };
              temp.status = status;
              return temp;
            } else return task;
          })
        );
      })
      .catch((error) => console.log(error));
  };

  const onDeleteClick = (id) => {
    deleteTask({ variables: { id } })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const filterStatus = (value) => {
    if (value === "NO FILTER") setStatusFilter("");
    else setStatusFilter(value);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.menu}>
        <View style={styles.title}>
          <Text h4 style={{ color: "white" }}>
            Get things done
          </Text>
        </View>
        <View>
          <Button
            title="Create Task"
            buttonStyle={{ marginBottom: 10 }}
            onPress={() => props.navigation.navigate("CreateTask")}
          ></Button>
          <Button
            onPress={logout}
            title="Log out"
            buttonStyle={{ backgroundColor: "red" }}
          ></Button>
        </View>
      </View>

      <View style={styles.search}>
        <SearchBar
          placeholder="Search..."
          lightTheme={true}
          value={searchTerm}
          onChangeText={search}
        />
        <Dropdown
          data={searchStatus}
          value="No status filter"
          containerStyle={{
            backgroundColor: "#edf4ff",
            padding: 10,
            marginTop: 10,
          }}
          onChangeText={filterStatus}
        />
      </View>

      <View style={{ marginBottom: 20 }}>{tasksRender()}</View>
    </ScrollView>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#434e5e",
    paddingLeft: 20,
    paddingRight: 20,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    justifyContent: "center",
  },
});
