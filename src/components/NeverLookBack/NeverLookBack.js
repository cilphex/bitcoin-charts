import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import moment from "moment";
import { moneyFormat } from "lib/utils.js";

// Stores
import DataStore from "stores/DataStore.js";
import ChartStore from "stores/ChartStore.js";

// Components
import BasicChart from "./components/BasicChart/index.js";
import RegressionChart from "./components/RegressionChart/index.js";
import LinearScaleChart from "./components/LinearScaleChart/index.js";
import Estimates from "./components/Estimates/index.js";
import ChartPageFooter from "components/ChartPageFooter/index.js";

// Styles
import styles from "app.scss";

@observer
class NeverLookBack extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.basicChartStore = new ChartStore();
    this.regressionChartStore = new ChartStore();
    this.linearScaleChartStore = new ChartStore();
  }

  static get propTypes() {
    return {
      dataStore: PropTypes.instanceOf(DataStore),
    };
  }

  render() {
    const { hoverItem: basicChartItem } = this.basicChartStore;
    const {
      hoverData: regressionChartData,
      hoverItem: regressionChartItem,
    } = this.regressionChartStore;
    const {
      hoverData: linearScaleChartData,
      hoverItem: linearScaleChartItem,
    } = this.linearScaleChartStore;

    return (
      <div>
        <div className={styles.contentColumn}>
          <h1>Bitcoin's Never Look Back Price</h1>
          <p className={styles.intro}>
            As described in {" "}
            <a href="https://www.cane-island.digital/researchnotes/why-bitcoins-price-is-never-looking-back">this article</a>
            {" "} by {" "}
            <a href="https://twitter.com/nsquaredcrypto">Timothy Peterson</a>
          </p>

          <div className={styles.textBlock}>
            <p>
              Bitcoin has a relatively unnoticed and &mdash; for most &mdash; unknown
              characteristic. I call it the &ldquo;Never Look Back Price.&rdquo; The NLB price is
              the last time bitcoin was at a particular price level. Once it reached
              that price, it only proceeded up, it never retraced to that value
              again. <span className={styles.quote}>&mdash; Quote</span>
            </p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Basic NLB</h2>
            { basicChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(basicChartItem.date).format("MMM D, YYYY")}
                </div>
                <div>
                  Price: <span className={styles.chartPrice}>{moneyFormat(basicChartItem.price)}</span>
                  NLB: <span className={styles.chartPriceForwardMin}>{moneyFormat(basicChartItem.forwardMinimumPrice)}</span>
                </div>
              </div>
            )}
          </div>

          { basicChartItem && (
            <div className={styles.chartDataOverlay}>
              <table>
                <tbody>
                  <tr>
                    <td>Date</td>
                    <td>{moment(basicChartItem.date).format("MMM D, YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td className={styles.chartPrice}>{moneyFormat(basicChartItem.price)}</td>
                  </tr>
                  <tr>
                    <td>NLB</td>
                    <td className={styles.chartPriceForwardMin}>{moneyFormat(basicChartItem.forwardMinimumPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <BasicChart
          dataStore={this.dataStore}
          chartStore={this.basicChartStore}
        />

        <div className={styles.contentColumn}>
          <div className={styles.textBlock}>
            <p>
              I have plotted these NLB prices on a lognormal scale over
              time. The result was amazing. The horizontal scale is &ldquo;square root
              time&rdquo;, which is just regular time plotted on a different scale. It
              essentially equates traditional time-value of money concepts to
              bitcoin's adoption rate, and therefore price.
              <span className={styles.quote}>&mdash; Quote</span>
            </p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Regression</h2>
            { regressionChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(regressionChartItem.date).format("MMM D, YYYY")}
                </div>
                <div>
                  NLB: <span className={styles.chartPriceForwardMin}>{moneyFormat(regressionChartItem.forwardMinimumPrice)}</span>
                  Max: <span className={styles.chartPriceDeviation}>{moneyFormat(regressionChartData.regressionPriceMax)}</span>
                  Expected: <span className={styles.chartPriceExpected}>{moneyFormat(regressionChartData.regressionPrice)}</span>
                  Min: <span className={styles.chartPriceDeviation}>{moneyFormat(regressionChartData.regressionPriceMin)}</span>
                </div>
              </div>
            )}
          </div>

          { regressionChartItem && (
            <div className={styles.chartDataOverlay}>
              <table>
                <tbody>
                <tr>
                  <td>Date</td>
                  <td>{moment(regressionChartItem.date).format("MMM D, YYYY")}</td>
                </tr>
                <tr>
                  <td>NLB</td>
                  <td className={styles.chartPriceForwardMin}>{moneyFormat(regressionChartItem.forwardMinimumPrice)}</td>
                </tr>
                <tr>
                  <td>Max</td>
                  <td className={styles.chartPriceDeviation}>{moneyFormat(regressionChartData.regressionPriceMax)}</td>
                </tr>
                <tr>
                  <td>Expected</td>
                  <td className={styles.chartPriceExpected}>{moneyFormat(regressionChartData.regressionPrice)}</td>
                </tr>
                <tr>
                  <td>Min</td>
                  <td className={styles.chartPriceDeviation}>{moneyFormat(regressionChartData.regressionPriceMin)}</td>
                </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <RegressionChart
          dataStore={this.dataStore}
          chartStore={this.regressionChartStore}
        />

        <div className={styles.contentColumn}>
          <div className={styles.textBlock}>
            <p>
              The NLB price represents a floor value for bitcoin. The actual
              price could be higher, but significantly higher prices will fall
              back down to the floor value. The NLB price is a sustainable price
              over the long term.
              <span className={styles.quote}>&mdash; Quote</span>
            </p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Linear Scales</h2>
            { linearScaleChartItem && (
              <div className={styles.chartDataTop}>
                <div>
                  {moment(linearScaleChartItem.date).format("MMM D, YYYY")}
                </div>
                <div>
                  Price: <span className={styles.price}>{moneyFormat(linearScaleChartItem.price)}</span>
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
          <div className={styles.textBlock}>
            <p>
              Is this NLB price a trend that will continue? Like I mentioned before, we don't know
              what the next lowest price is until we hit that price. There will undoubtedly be
              skeptics who criticize this methodology, and healthy professional skepticism is
              beneficial because it keeps expectations realistic. On the other hand, would you bet
              money that the price will fall substantially, say, to $4,000, given the ten-year
              history of the Never Look Back price? I think that might take some guts, to say the least.
              <span className={styles.quote}>&mdash; Quote</span>
            </p>
          </div>

          <div className={styles.chartHeader}>
            <h2>Data Points</h2>
          </div>

          <Estimates
            dataStore={this.dataStore}
          />

          <ChartPageFooter
            sourceQuote="Bitcoin's Never Look Back price is a picture of bitcoin adoption."
            sourceUrl="https://static1.squarespace.com/static/5d580747908cdc0001e6792d/t/5e93243abadd4454b360bf18/1586701372057/research+note+4.12.pdf"
            sourceText="Original Article by Timothy Peterson"
          />
        </div>
      </div>
    );
  }
}

export default NeverLookBack;
