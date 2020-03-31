import React, { useState, useEffect } from "react";
import { Button, FormGroup, Input, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import axios from "axios";
import { useHistory, Redirect } from "react-router";

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

const TasksList = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:3000/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    })();
  }, []);

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
                  onChange={e => updateTask(e.target.value, task._id)}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </Input>
              </FormGroup>
              <Button color="danger" onClick={() => deleteTask(task._id)}>
                Delete
              </Button>
            </Row>
          </CardBody>
        </Card>
      );
    });
  };

  const updateTask = (status, id) => {
    const token = localStorage.getItem("accessToken");
    axios
      .patch(
        `http://localhost:3000/tasks/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
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

  const deleteTask = id => {
    const token = localStorage.getItem("accessToken");
    axios
      .delete(`http://localhost:3000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(error => {
        console.log(error);
      });
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
