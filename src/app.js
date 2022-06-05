import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Stores
import DataStore from "stores/DataStore.js";

// Components
import Nav from "./components/Nav";
import Home from "./components/Home";
import NeverLookBack from "./components/NeverLookBack";
import PowerLawCorridor from "./components/PowerLawCorridor";
import WeeklyMovingAverage from "./components/WeeklyMovingAverage";

// Styles
import styles from "./app.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = new DataStore();
  }

  render() {
    return (
      <Router>
        <Nav dataStore={this.dataStore}/>
        <div className={styles.content}>
          {/* Switch means one route or the other, which lets us
              have the catch-all route for a 404 page at the bottom */}
          <Switch>
            <Route path="/never-look-back">
              <NeverLookBack dataStore={this.dataStore}/>
            </Route>
            <Route path="/power-law-corridor">
              <PowerLawCorridor dataStore={this.dataStore}/>
            </Route>
            <Route path="/weekly-moving-average">
              <WeeklyMovingAverage dataStore={this.dataStore}/>
            </Route>
            <Route exact path="/">
              <Home dataStore={this.dataStore}/>
            </Route>
            <Route exact path="*">
              This page does not exist.
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById("root"),
);
