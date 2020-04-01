import React, { useState, useEffect } from "react";
import { Button, FormGroup, Input, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useHistory, Redirect } from "react-router";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";

const Wrapper = styled.div`
  margin: auto;
  width: 100%;
  max-width: 860px;
  padding: 20px;
  box-sizing: border-box;
  height: 100vh;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

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

const TasksList = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { loading, error, data } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateStatus] = useMutation(UPDATE_STATUS);

  useEffect(() => {
    if (data) setTasks(data.tasks);
  }, [data]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (!localStorage.getItem("accessToken")) return <Redirect to="/" />;

  const tasksRender = () => {
    let filterdTasks;
    if (!searchTerm && statusFilter)
      filterdTasks = tasks.filter(task => task.status === statusFilter);
    else if (searchTerm && !statusFilter)
      filterdTasks = tasks.filter(
        task =>
          task.title.includes(searchTerm) ||
          task.description.includes(searchTerm)
      );
    else if (searchTerm && statusFilter)
      filterdTasks = tasks
        .filter(
          task =>
            task.title.includes(searchTerm) ||
            task.description.includes(searchTerm)
        )
        .filter(task => task.status === statusFilter);
    else filterdTasks = tasks;

    return filterdTasks.map(task => {
      return (
        <Card key={task._id} style={{ marginBottom: "20px" }}>
          <CardBody>
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <Row>
              <FormGroup>
                <Input
                  type="select"
                  name="status"
                  id="status"
                  defaultValue={task.status}
                  onChange={e => onStatusChange(e.target.value, task._id)}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </Input>
              </FormGroup>
              <Button color="danger" onClick={() => onDeleteClick(task._id)}>
                Delete
              </Button>
            </Row>
          </CardBody>
        </Card>
      );
    });
  };

  const onStatusChange = (status, id) => {
    updateStatus({ variables: { status, id } })
      .then(() => {
        setTasks(
          tasks.map(task => {
            if (task._id === id) {
              const temp = { ...task };
              temp.status = status;
              return temp;
            } else return task;
          })
        );
      })
      .catch(error => console.log(error));
  };

  const onDeleteClick = id => {
    deleteTask({ variables: { id } })
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(err => console.log(err));
  };

  const logOut = () => {
    localStorage.removeItem("accessToken");
    history.push("/");
  };

  const filterStatus = e => {
    const filteredStatus = e.target.value;
    setStatusFilter(filteredStatus);
  };

  const search = e => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  return (
    <Wrapper>
      <Row>
        <h1>Get things done</h1>
        <div>
          <Button
            style={{ marginRight: "15px" }}
            onClick={() => history.push("/task/create")}
          >
            Create Task
          </Button>
          <Button color="danger" onClick={logOut}>
            Log out
          </Button>
        </div>
      </Row>
      <hr style={{ backgroundColor: "white", height: "3px" }} />
      <Row>
        <FormGroup>
          <Input
            name="search"
            id="search"
            placeholder="Search..."
            autoComplete="off"
            onChange={search}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="select"
            name="status"
            id="status"
            onChange={filterStatus}
          >
            <option value="">No status filter</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Input>
        </FormGroup>
      </Row>

      {tasksRender()}
    </Wrapper>
  );
};

export default TasksList;
