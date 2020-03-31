import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  Card,
  CardBody,
  Col,
  Input,
  FormGroup,
  Button,
  Form
} from "reactstrap";
import { useHistory, Redirect } from "react-router";
import ErrorMessage from "../components/ErrorMessage";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const CreateTask = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessages, setErrorMessages] = useState(null);
  if (!localStorage.getItem("accessToken")) return <Redirect to="/" />;

  const submitTask = e => {
    e.preventDefault();
    setErrorMessages(null);
    const token = localStorage.getItem("accessToken");
    axios
      .post(
        "http://localhost:3000/tasks",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => {
        history.push("/task");
      })
      .catch(err => {
        const errMsg = err.response.data.message;
        setErrorMessages(errMsg);
      });
  };

  return (
    <FormWrapper>
      <Card
        style={{
          backgroundColor: "#edf4ff",
          width: "580px",
          boxSizing: "border-box"
        }}
      >
        <CardBody>
          <h2>Create a new Task</h2>
          <p>Provide information about the task you wish to complete</p>
          {errorMessages && <ErrorMessage message={errorMessages} />}
          <Form onSubmit={submitTask}>
            <FormGroup row>
              <Col>
                <Input
                  name="title"
                  id="title"
                  placeholder="Title"
                  autoComplete="off"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="text"
                id="exampleText"
                placeholder="Description"
                rows="8"
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                }}
              />
            </FormGroup>
            <Button type="submit" color="primary" block>
              Create task
            </Button>
            <Button color="danger" onClick={() => history.push("/task")} block>
              Return to Your Tasks
            </Button>
          </Form>
        </CardBody>
      </Card>
    </FormWrapper>
  );
};

export default CreateTask;
