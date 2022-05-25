import React from "react"
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Stores
import ChartStore from 'stores/ChartStore';

// Components
import LinearScaleChart from './components/LinearScaleChart';
import ChartPageFooter from 'components/ChartPageFooter';

// Styles
import styles from 'app.scss';

@observer
class WeeklyMovingAverage extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.linearScaleChartStore = new ChartStore();
  }

  render() {
    const {
      hoverData: linearScaleChartData,
      hoverItem: linearScaleChartItem,
    } = this.linearScaleChartStore;

    return(
      <div>
        <div className={styles.contentColumn}>
          <h1>200-Week Moving Average</h1>
          <p className={styles.intro}>
            A commonplace indicator
          </p>

          <div className={styles.textBlock}>
            <p>The 200-week moving average tracks the average Bitcoin price
            over the last 200 weeks for any given day. It has provided an apparent
            minimum price for Bitcoin since its inception.</p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Linear Scales</h2>
            { linearScaleChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(linearScaleChartItem.date).format('MMM D, YYYY')}
                </div>
                <div>
                  Price: <span className={styles.chartPrice}>{moneyFormat(linearScaleChartItem.price)}</span>
                  200-Week MA: <span className={styles.chartPriceForwardMin}>{moneyFormat(linearScaleChartItem.wma200week)}</span>
                </div>
              </div>
            )}
          </div>

          { linearScaleChartItem && (
            <div className={styles.chartDataOverlay}>
              <table>
                <tbody>
                <tr>
                  <td>Date</td>
                  <td>{moment(linearScaleChartItem.date).format('MMM D, YYYY')}</td>
                </tr>
                <tr>
                  <td>Price</td>
                  <td className={styles.chartPrice}>{moneyFormat(linearScaleChartItem.price)}</td>
                </tr>
                <tr>
                  <td>200-Week MA</td>
                  <td className={styles.chartPriceForwardMin}>{moneyFormat(linearScaleChartItem.wma200week)}</td>
                </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <LinearScaleChart
          dataStore={this.dataStore}
          chartStore={this.linearScaleChartStore}
        />

        <div className={styles.contentColumn}>
          <div className={styles.chartHeader}>
            <h2>Power Law Scales</h2>
          </div>
        </div>

        <div className={styles.contentColumn}>
          <ChartPageFooter/>
        </div>
      </div>
    )
  }
}

export default WeeklyMovingAverage;
