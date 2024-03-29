import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import moment from "moment";
import { moneyFormat } from "lib/utils.js";
import DataStore from "stores/DataStore.js";
import EstimatesStore from "./EstimatesStore.js";
import styles from "./Estimates.scss";

@observer
class EstimatesContent extends React.Component {
  constructor(props) {
    super(props);

    this.estimatesStore = new EstimatesStore(
      this.props.chartData,
      this.props.chartType,
    );
  }

  static get propTypes() {
    return {
      chartData: PropTypes.object,
      chartType: PropTypes.string,
    };
  }

  render() {
    const {
      chartType,
      chartTypeIsValid,
      ready,
      regressionVariables,
      today,
      years,
      magnitudes,
    } = this.estimatesStore;

    if (!chartTypeIsValid) {
      return <>Invalid chart type "{chartType}"</>;
    }

    if (!ready) {
      return <>Calculating...</>;
    }

    const {
      regressionType,
      standardDeviationType,
    } = regressionVariables;

    const standardDeviation = this.props.chartData[standardDeviationType] || 0;

    return (
      <div className={styles.estimates}>
        <div>
          <h3>Today</h3>
          <table>
            <tbody>
            <tr className={styles.deviation}>
              <td>Max price</td>
              <td>{moneyFormat(today.max)}</td>
            </tr>
            <tr className={styles.expected}>
              <td>Middle price</td>
              <td>{moneyFormat(today.expected)}</td>
            </tr>
            <tr className={styles.deviation}>
              <td>Min price</td>
              <td>{moneyFormat(today.min)}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3>5 Years</h3>
          <table>
            <tbody>
              {years.map((year, i) =>
                <tr key={i}>
                  <td>{moment(year.date).year()}</td>
                  <td>
                    {moneyFormat(Math.round(Math.pow(10, year[regressionType] - standardDeviation)))}
                  </td>
                </tr>,
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Goals</h3>
          <table>
            <tbody>
              {magnitudes.map((magnitude, i) =>
                <tr key={i}>
                  <td>{moneyFormat(Math.round(Math.pow(10, Math.floor(magnitude[regressionType] - standardDeviation))))}</td>
                  <td>{moment(magnitude.date).format("MMM D, YYYY")}</td>
                </tr>,
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

@observer
class Estimates extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
  }

  static get propTypes() {
    return {
      dataStore: PropTypes.instanceOf(DataStore),
      chartType: PropTypes.string,
    };
  }

  render() {
    const { chartData } = this.dataStore;
    const { chartType } = this.props;

    if (!chartData) {
      return <>Loading...</>;
    }

    return (
      <EstimatesContent
        chartData={chartData}
        chartType={chartType}
      />
    );
  }
}

export default Estimates;
