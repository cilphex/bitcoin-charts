import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Stores
import ChartStore from 'stores/ChartStore.js';

// Components
import BasicChart from './components/BasicChart';
import RegressionChart from './components/RegressionChart';

// Styles
import styles from "app.scss";

@observer
class NeverLookBack extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.basicChartStore = new ChartStore();
    this.regressionChartStore = new ChartStore();
  }

  render() {
    const { hoverItem: basicChartItem } = this.basicChartStore;
    const {
      hoverData: regressionChartData,
      hoverItem: regressionChartItem,
    } = this.regressionChartStore;

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
              I have plotted these NLB prices on a lognormal scale over
              time. The result was amazing. The horizontal scale is &ldquo;square root
              time&rdquo;, which is just regular time plotted on a different scale. It
              essentially equates traditional time-value of money concepts to
              bitcoin's adoption rate, and therefore price.
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
                Price: <span className={styles.price}>{moneyFormat(regressionChartItem.forwardMinimumPrice)}</span>
                Max: <span className={styles.deviation}>{moneyFormat(regressionChartData.regressionPrice)}</span>
                Expected: <span className={styles.expected}>{moneyFormat(regressionChartData.regressionPriceMax)}</span>
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
      </div>
    );
  }
}

export default NeverLookBack;
