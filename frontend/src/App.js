import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const TasksList = lazy(() => import("./pages/TasksList"));
const CreateTask = lazy(() => import("./pages/CreateTask"));

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/task" component={TasksList} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/task/create" component={CreateTask} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    );
  }
}
