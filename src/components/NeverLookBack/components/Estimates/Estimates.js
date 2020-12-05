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

  get years() {
    if (this._years) {
      return this._years;
    }

    const { chartData } = this.dataStore;
    const { regressionData } = chartData;

    this._years = Array(5).fill(null)
      .map((item, i) => moment().year() + i)
      .map((year, i) =>
        regressionData.find(dataItem =>
          moment(dataItem.date).isSame(moment(`${year}-01-01`), 'day')
        )
      )

    return this._years;
  }

  get magnitudes() {
    if (this._magnitudes) {
      return this._magnitudes;
    }

    const { chartData } = this.dataStore;
    const { regressionData } = chartData;

    this._magnitudes = Array(5).fill(null)
      .map((val, i) => Math.pow(10, i+3)) // 10,000 to 100,000,000
      .map((price, i) =>
          regressionData.find(dataItem =>
              Math.pow(10, dataItem.regressionNlb) > price
          )
      )

    return this._magnitudes;
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
          <table>
            <tbody>
              {this.years.map((year, i) =>
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
              {this.magnitudes.map((magnitude, i) =>
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

export default Estimates;