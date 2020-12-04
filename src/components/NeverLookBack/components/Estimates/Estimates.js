import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js';

import Chart from 'components/Chart';
import styles from "./Estimates.scss"

@observer
class Estimates extends Chart {
  constructor(props) {
    super(props);
  }

  get today() {
    if (this._today) {
      return this._today;
    }

    const { chartData } = this.dataStore;
    const { regressionData, standardDeviationNlb } = chartData;

    const todayData = regressionData.find(i =>
      moment(i.date).isSame(moment(), 'day')
    )

    const { regressionNlb } = todayData;
    const expected = Math.round(Math.pow(10, regressionNlb))
    const min = Math.round(Math.pow(10, regressionNlb - standardDeviationNlb))
    const max = Math.round(Math.pow(10, regressionNlb + standardDeviationNlb))

    this._today = {
      expected,
      min,
      max
    }

    return this._today;
  }

  get chartView() {
    return (
      <div className={styles.estimates}>
        <div>
          <h3>Today</h3>
          <table>
            <tbody>
              <tr className={styles.deviation}>
                <td>Max price</td>
                <td>{moneyFormat(this.today.max)}</td>
              </tr>
              <tr className={styles.expected}>
                <td>Expected price</td>
                <td>{moneyFormat(this.today.expected)}</td>
              </tr>
              <tr className={styles.deviation}>
                <td>Min price</td>
                <td>{moneyFormat(this.today.min)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3>5 Years</h3>
          <table></table>
        </div>

        <div>
          <h3>Goals</h3>
          <table></table>
        </div>
      </div>
    )
  }
}

export default Estimates;