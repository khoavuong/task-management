import React, { useState, useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery, useSubscription } from "@apollo/react-hooks";

const Wrapper = styled.div`
  margin: auto;
  width: 100%;
  max-width: 860px;
  padding: 20px;
  box-sizing: border-box;
  height: 100vh;
`;

const GET_USERS = gql`
  {
    users {
      _id
      username
      tasks {
        title
      }
    }
  }
`;

const USERS_SUBSCRIPTION = gql`
  subscription {
    userSignedUp {
      _id
      username
      tasks {
        title
      }
    }
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const userJustSignedUp = useSubscription(USERS_SUBSCRIPTION);

  useEffect(() => {
    (() => {
      refetch();
      if (data) setUsers(data.users);
    })();
  }, [data, refetch, userJustSignedUp]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const renderUsers = () => (
    <ul>
      {users.map(user => {
        return (
          <li key={user._id}>
            {user.username}: {user.tasks.length} tasks
          </li>
        );
      })}
    </ul>
  );

  return (
    <Wrapper>
      <Card>
        <CardBody>
          <h6>
            This page is implemented with subscription feature, try signing up
            in another window and see how this page changes
          </h6>
          All Users:
          {renderUsers()}
        </CardBody>
      </Card>
    </Wrapper>
  );
};

export default UserManagement;
