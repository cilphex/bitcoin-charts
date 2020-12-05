import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Stores
import ChartStore from 'stores/ChartStore.js';

// Components
import BasicChart from './components/BasicChart';
import RegressionChart from './components/RegressionChart';
import LinearScaleChart from './components/LinearScaleChart';
import Estimates from './components/Estimates';
import ChartPageFooter from 'components/ChartPageFooter';

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
        <h1>Bitcoin's Never Look Back Price</h1>
        <p className={styles.intro}>
          As described in {' '}
          <a href="https://www.caneislandcrypto.com/blog/2019/10/5/why-bitcoin-is-never-looking-back">this article</a>
          {' '} by {' '}
          <a href="https://twitter.com/nsquaredcrypto">Timothy Peterson</a>
        </p>

        <div className={styles.chartHeader}>
          <h2>Basic NLB</h2>
          { basicChartItem && (
            <div className={styles.chartDataTop}>
              <div>
                {moment(basicChartItem.date).format('MMM D, YYYY')}
              </div>
              <div>
                Price: <span className={styles.price}>{moneyFormat(basicChartItem.price)}</span>
                NLB: <span className={styles.forwardMinPrice}>{moneyFormat(basicChartItem.forwardMinimumPrice)}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.chartDescription}>
          <div className={styles.quote}>&ldquo;</div>
          <div className={styles.inner}>
            <p>
              Bitcoin has a relatively unnoticed and &mdash; for most &mdash; unknown
              characteristic. I call it the &ldquo;Never Look Back Price.&rdquo; The NLB price is
              the last time bitcoin was at a particular price level. Once it reached
              that price, it only proceeded up, it never retraced to that value
              again.
            </p>
          </div>
        </div>

        <BasicChart
          dataStore={this.dataStore}
          chartStore={this.basicChartStore}
        />

        <div className={styles.chartHeader}>
          <h2>Regression</h2>
          { regressionChartItem && (
            <div className={styles.chartDataTop}>
              <div>
                {moment(regressionChartItem.date).format('MMM D, YYYY')}
              </div>
              <div>
                Price: <span className={styles.price}>
                  {regressionChartItem.forwardMinimumPrice && moneyFormat(regressionChartItem.forwardMinimumPrice) || '???'}
                </span>
                Max: <span className={styles.deviation}>{moneyFormat(regressionChartData.regressionPriceMax)}</span>
                Expected: <span className={styles.expected}>{moneyFormat(regressionChartData.regressionPrice)}</span>
                Min: <span className={styles.deviation}>{moneyFormat(regressionChartData.regressionPriceMin)}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.chartDescription}>
          <div className={styles.quote}>&ldquo;</div>
          <div className={styles.inner}>
            <p>
              I have plotted these NLB prices on a lognormal scale over
              time. The result was amazing. The horizontal scale is &ldquo;square root
              time&rdquo;, which is just regular time plotted on a different scale. It
              essentially equates traditional time-value of money concepts to
              bitcoin's adoption rate, and therefore price.
            </p>
          </div>
        </div>

        <RegressionChart
          dataStore={this.dataStore}
          chartStore={this.regressionChartStore}
        />

        <div className={styles.chartHeader}>
          <h2>Linear Scales</h2>
          { linearScaleChartItem && (
            <div className={styles.chartDataTop}>
              <div>
                {moment(linearScaleChartItem.date).format('MMM D, YYYY')}
              </div>
              <div>
                Price: <span className={styles.price}>
                  {linearScaleChartItem.price && moneyFormat(linearScaleChartItem.price) || '???'}
                </span>
                Max: <span className={styles.deviation}>{moneyFormat(linearScaleChartData.regressionPriceMax)}</span>
                Expected: <span className={styles.expected}>{moneyFormat(linearScaleChartData.regressionPrice)}</span>
                Min: <span className={styles.deviation}>{moneyFormat(linearScaleChartData.regressionPriceMin)}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.chartDescription}>
          <div className={styles.quote}>&ldquo;</div>
          <div className={styles.inner}>
            <p>
              The NLB price represents a floor value for bitcoin. The actual
              price could be higher, but significantly higher prices will fall
              back down to the floor value. The NLB price is a sustainable price
              over the long term.
            </p>
          </div>
        </div>

        <LinearScaleChart
          dataStore={this.dataStore}
          chartStore={this.linearScaleChartStore}
        />

        <div className={styles.chartHeader}>
          <h2>Data Points</h2>
        </div>

        <div className={styles.chartDescription}>
          <div className={styles.quote}>&ldquo;</div>
          <div className={styles.inner}>
            <p>
              Is this NLB price a trend that will continue? Like I mentioned before, we don't know
              what the next lowest price is until we hit that price. There will undoubtedly be
              skeptics who criticize this methodology, and healthy professional skepticism is
              beneficial because it keeps expectations realistic. On the other hand, would you bet
              money that the price will fall substantially, say, to $4,000, given the ten-year
              history of the Never Look Back price? I think that might take some guts, to say the least.
            </p>
          </div>
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
    );
  }
}

export default NeverLookBack;
