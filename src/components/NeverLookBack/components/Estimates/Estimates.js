import React from 'react';
import styles from "./Estimates.scss"

import Chart from 'components/Chart';

class Estimates extends Chart {
  constructor(props) {
    super(props);
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
                <td></td>
              </tr>
              <tr className={styles.expected}>
                <td>Expected price</td>
                <td></td>
              </tr>
              <tr className={styles.deviation}>
                <td>Min price</td>
                <td></td>
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