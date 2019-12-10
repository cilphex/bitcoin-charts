import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styles from "./app.scss";

import Nav from './components/Nav'
import Home from './components/Home'
import NeverLookBack from './components/NeverLookBack'
import PowerLawCorridor from "./components/PowerLawCorridor";

function App() {
  return (
    <Router>
      <Nav />
      <div className={styles.content}>
        <Route path="/never-look-back">
          <NeverLookBack />
        </Route>
        <Route path="/power-law-corridor">
          <PowerLawCorridor />
        </Route>
        <Route exact path="/">
          <Home/>
        </Route>
      </div>
    </Router>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);
