import React from "react"
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Stores
import ChartStore from 'stores/ChartStore';

// Components
import LinearScaleChart from './components/LinearScaleChart'
import PowerLawScaleChart from './components/PowerLawScaleChart'
import LineOfBestFit from './components/LineOfBestFit'
import ChartPageFooter from 'components/ChartPageFooter'

// Styles
import styles from 'app.scss';

@observer
class WeeklyMovingAverage extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.linearScaleChartStore = new ChartStore();
    this.powerLawScaleChartStore = new ChartStore();
    this.lineOfBestFitChartStore = new ChartStore();
  }

  render() {
    const {
      hoverItem: linearScaleChartItem,
    } = this.linearScaleChartStore;

    const {
      hoverItem: powerLawScaleChartItem,
    } = this.powerLawScaleChartStore;

    const {
      hoverItem: lineOfBestFitChartItem,
    } = this.lineOfBestFitChartStore;

    return(
      <div>
        <div className={styles.contentColumn}>
          <h1>200-Week Moving Average</h1>
          <p className={styles.intro}>
            A commonplace indicator
          </p>

          <div className={styles.textBlock}>
            <p>The 200-week moving average tracks the average Bitcoin price
            over the previous 200 weeks for any given day. It has provided an apparent
            minimum price for Bitcoin since it began trading.</p>
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
          <div className={styles.textBlock}>
            <p>We can get a more clear view by plotting the values on power
            law scales (log price over square-root time). The light blue line
            is the largest moving average available for dates that do not have
            200 weeks worth of history.</p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Power Law Scales</h2>
            { powerLawScaleChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(powerLawScaleChartItem.date).format('MMM D, YYYY')}
                </div>
                <div>
                  Price: <span className={styles.chartPrice}>{moneyFormat(powerLawScaleChartItem.price)}</span>
                  200-Week MA: <span className={styles.chartPriceForwardMin}>{moneyFormat(powerLawScaleChartItem.wma200week)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        { powerLawScaleChartItem && (
          <div className={styles.chartDataOverlay}>
            <table>
              <tbody>
              <tr>
                <td>Date</td>
                <td>{moment(powerLawScaleChartItem.date).format('MMM D, YYYY')}</td>
              </tr>
              <tr>
                <td>Price</td>
                <td className={styles.chartPrice}>{moneyFormat(powerLawScaleChartItem.price)}</td>
              </tr>
              <tr>
                <td>200-Week MA</td>
                <td className={styles.chartPriceForwardMin}>{moneyFormat(powerLawScaleChartItem.wma200week)}</td>
              </tr>
              </tbody>
            </table>
          </div>
        )}

        <PowerLawScaleChart
          dataStore={this.dataStore}
          chartStore={this.powerLawScaleChartStore}
        />

        <div className={styles.contentColumn}>
          <div className={styles.textBlock}>
            <p>We can map a line of best fit to the 200-week moving average
            to make a forward-looking projection. This projection uses all WMA
            data, including for the days without full 200-week history.</p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Line of Best Fit</h2>
            { lineOfBestFitChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(lineOfBestFitChartItem.date).format('MMM D, YYYY')}
                </div>
                <div>
                  Price: <span className={styles.chartPrice}>{moneyFormat(lineOfBestFitChartItem.price)}</span>
                  Projection: <span className={styles.chartPriceForwardMin}>{moneyFormat(Math.pow(10, lineOfBestFitChartItem.regressionWma))}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        { lineOfBestFitChartItem && (
          <div className={styles.chartDataOverlay}>
            <table>
              <tbody>
              <tr>
                <td>Date</td>
                <td>{moment(lineOfBestFitChartItem.date).format('MMM D, YYYY')}</td>
              </tr>
              <tr>
                <td>Price</td>
                <td className={styles.chartPrice}>{moneyFormat(lineOfBestFitChartItem.price)}</td>
              </tr>
              <tr>
                <td>Projection</td>
                <td className={styles.chartPriceForwardMin}>{moneyFormat(Math.pow(10, lineOfBestFitChartItem.regressionWma))}</td>
              </tr>
              </tbody>
            </table>
          </div>
        )}

        <LineOfBestFit
          dataStore={this.dataStore}
          chartStore={this.lineOfBestFitChartStore}
        />

        <div className={styles.contentColumn}>
          <ChartPageFooter/>
        </div>
      </div>
    )
  }
}

export default WeeklyMovingAverage;
