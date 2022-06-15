import React from "react";
import { observer } from "mobx-react";
import moment from "moment";
import { moneyFormat } from "lib/utils.js";

// Stores
import DataStore from "stores/DataStore.js";
import ChartStore from "stores/ChartStore.js";

// Components
import PowerLawChart from "./components/PowerLawChart/index.js";
import LinearScaleChart from "./components/LinearScaleChart/index.js";
import Estimates from "./components/Estimates/index.js";
import ChartPageFooter from "components/ChartPageFooter/index.js";

// Styles
import styles from "app.scss";
import PropTypes from "prop-types";

@observer
class PowerLawCorridor extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.powerLawChartStore = new ChartStore();
    this.linearScaleChartStore = new ChartStore();
  }

  static get propTypes() {
    return {
      dataStore: PropTypes.instanceOf(DataStore),
    };
  }

  render() {
    const {
      hoverData: powerLawChartData,
      hoverItem: powerLawChartItem,
    } = this.powerLawChartStore;

    const {
      hoverData: linearScaleChartData,
      hoverItem: linearScaleChartItem,
    } = this.linearScaleChartStore;

    return (
      <div>
        <div className={styles.contentColumn}>
          <h1>Bitcoin's Power Law Corridor</h1>
          <p className={styles.intro}>
            As described in {" "}
            <a href="https://medium.com/coinmonks/bitcoins-natural-long-term-power-law-corridor-of-growth-649d0e9b3c94">this article</a>
            {" "} by {" "}
            <a href="https://twitter.com/hcburger1">Harold Christopher Burger</a>
          </p>

          <div className={styles.textBlock}>
            <p>Bitcoin's Power Law Corridor is the channel within which Bitcoin has
            been growing in price since its inception, when charted on log price
            over square-root time scales.</p>

            <p>The top top edge is a linear regression through Bitcoin's three bubble
            peaks. The bottom line is the linear regression through the daily price,
            minus standard deviation.</p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Power Law Corridor</h2>
            { powerLawChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(powerLawChartItem.date).format("MMM D, YYYY")}
                </div>
                <div>
                  Price: <span className={styles.chartPrice}>{moneyFormat(powerLawChartItem.price)}</span>
                  Max: <span className={styles.chartPriceDeviation}>{moneyFormat(powerLawChartData.regressionPriceMax)}</span>
                  Expected: <span className={styles.chartPriceExpected}>{moneyFormat(powerLawChartData.regressionPrice)}</span>
                  Min: <span className={styles.chartPriceDeviation}>{moneyFormat(powerLawChartData.regressionPriceMin)}</span>
                </div>
              </div>
            )}
          </div>

          { powerLawChartItem && (
            <div className={styles.chartDataOverlay}>
              <table>
                <tbody>
                <tr>
                  <td>Date</td>
                  <td>{moment(powerLawChartItem.date).format("MMM D, YYYY")}</td>
                </tr>
                <tr>
                  <td>Price</td>
                  <td className={styles.chartPrice}>{moneyFormat(powerLawChartItem.price)}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td className={styles.chartPriceDeviation}>{moneyFormat(powerLawChartData.regressionPriceMax)}</td>
                </tr>
                <tr>
                  <td>Expected</td>
                  <td className={styles.chartPriceExpected}>{moneyFormat(powerLawChartData.regressionPrice)}</td>
                </tr>
                <tr>
                  <td>Min</td>
                  <td className={styles.chartPriceDeviation}>{moneyFormat(powerLawChartData.regressionPriceMin)}</td>
                </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <PowerLawChart
          dataStore={this.dataStore}
          chartStore={this.powerLawChartStore}
        />

        <div className={styles.contentColumn}>
          <div className={styles.textBlock}>
            <p>If we plot the same values on linear scales, we can see Bitcoin's
            exponential growth within this corridor.</p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Linear Scales</h2>
            { linearScaleChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(linearScaleChartItem.date).format("MMM D, YYYY")}
                </div>
                <div>
                  Price: <span className={styles.chartPrice}>{moneyFormat(linearScaleChartItem.price)}</span>
                  Max: <span className={styles.chartPriceDeviation}>{moneyFormat(linearScaleChartData.regressionPriceMax)}</span>
                  Expected: <span className={styles.chartPriceExpected}>{moneyFormat(linearScaleChartData.regressionPrice)}</span>
                  Min: <span className={styles.chartPriceDeviation}>{moneyFormat(linearScaleChartData.regressionPriceMin)}</span>
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
                  <td>{moment(linearScaleChartItem.date).format("MMM D, YYYY")}</td>
                </tr>
                <tr>
                  <td>Price</td>
                  <td className={styles.chartPrice}>{moneyFormat(linearScaleChartItem.price)}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td className={styles.chartPriceDeviation}>{moneyFormat(linearScaleChartData.regressionPriceMax)}</td>
                </tr>
                <tr>
                  <td>Expected</td>
                  <td className={styles.chartPriceExpected}>{moneyFormat(linearScaleChartData.regressionPrice)}</td>
                </tr>
                <tr>
                  <td>Min</td>
                  <td className={styles.chartPriceDeviation}>{moneyFormat(linearScaleChartData.regressionPriceMin)}</td>
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
            <h2>Data Points</h2>
          </div>

          <Estimates
            dataStore={this.dataStore}
          />

          <ChartPageFooter
            sourceUrl="https://medium.com/coinmonks/bitcoins-natural-long-term-power-law-corridor-of-growth-649d0e9b3c94"
            sourceText="Original Article by Harold Christopher Burger"
          />
        </div>
      </div>
    );
  }
}

export default PowerLawCorridor;
