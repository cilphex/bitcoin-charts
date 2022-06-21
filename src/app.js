import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Stores
import DataStore from "stores/DataStore.js";

// Components
import Page from "components/Page/index.js";
import Nav from "./components/Nav/index.js";
import Home from "./components/Home/index.js";
import NeverLookBack from "./components/NeverLookBack/index.js";
import PowerLawCorridor from "./components/PowerLawCorridor/index.js";
import WeeklyMovingAverage from "./components/WeeklyMovingAverage/index.js";

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
              <Page
                title="Never Look Back (NLB)"
                description="The NLB price is the last time bitcoin was at a particular price level.">
                <NeverLookBack dataStore={this.dataStore}/>
              </Page>
            </Route>
            <Route path="/power-law-corridor">
              <Page
                title="Power Law Corridor (PLC)"
                description="Bitcoin's growth on power law scales.">
                <PowerLawCorridor dataStore={this.dataStore}/>
              </Page>
            </Route>
            <Route path="/weekly-moving-average">
              <Page
                title="200-Week Moving Average (WMA)"
                description="The average Bitcoin price over the previous 200 weeks for any given day.">
                <WeeklyMovingAverage dataStore={this.dataStore}/>
              </Page>
            </Route>
            <Route exact path="/">
              <Page>
                <Home dataStore={this.dataStore}/>
              </Page>
            </Route>
            <Route exact path="*">
              <Page
                title="Page Not Found"
                description="404 - Page not found.">
                This page does not exist.
              </Page>
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
