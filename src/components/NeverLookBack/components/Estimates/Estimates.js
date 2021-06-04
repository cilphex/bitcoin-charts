import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js';

import EstimatesStore from './EstimatesStore.js';
import Chart from 'components/Chart';
import styles from "./Estimates.scss"

@observer
class EstimatesContent extends React.Component {
  constructor(props) {
    super(props);

    this.estimatesStore = new EstimatesStore(this.props.chartData);
  }

  render() {
    const { ready, today, years, magnitudes } = this.estimatesStore;

    if (!ready) {
      return <>Calculating...</>;
    }

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
              <td>Expected price</td>
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
                  <td>{moneyFormat(Math.round(Math.pow(10, year.regressionNlb)))}</td>
                </tr>
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
                  <td>{moneyFormat(Math.round(Math.pow(10, Math.floor(magnitude.regressionNlb))))}</td>
                  <td>{moment(magnitude.date).format('MMM D, YYYY')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

@observer
class Estimates extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
  }

  render() {
    const { chartData } = this.dataStore;

    if (!chartData) {
      return <>Loading...</>;
    }

    return (
      <EstimatesContent
        chartData={chartData}
      />
    );
  }
}

export default Estimates;