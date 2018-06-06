import "./App.css";
import React, { Component } from "react";
import { Home } from "./components/Home";
import Repo from "./components/Repo";
import { Results } from "./components/Results";
import { BrowserRouter, Route, Switch } from "react-router-dom";
class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path={"/"} exact render={props => <Home {...props} />} />
            <Route
              path={"/search"}
              exact
              render={props => <Results {...props} />}
            />
            <Route
              path={"/repos/:owner/:repoName"}
              render={props => <Repo {...props} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
