import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  request: operation => {
    const token = localStorage.getItem("accessToken");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.querySelector("#root")
);
