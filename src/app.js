import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

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
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);
