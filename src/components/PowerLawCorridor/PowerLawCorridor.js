import React from "react"
import { observer } from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Stores
import ChartStore from 'stores/ChartStore';

// Components
import PowerLawChart from './components/PowerLawChart';
import LinearScaleChart from './components/LinearScaleChart';
import Estimates from './components/Estimates';
import ChartPageFooter from 'components/ChartPageFooter';

// Styles
import styles from 'app.scss';

@observer
class PowerLawCorridor extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.powerLawChartStore = new ChartStore();
    this.linearScaleChartStore = new ChartStore();
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
        <h1>Bitcoin's Power Law Corridor</h1>
        <p className={styles.intro}>
          As described in {' '}
          <a href="https://medium.com/coinmonks/bitcoins-natural-long-term-power-law-corridor-of-growth-649d0e9b3c94">this article</a>
          {' '} by {' '}
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
                {moment(powerLawChartItem.date).format('MMM D, YYYY')}
              </div>
              <div>
                Price: <span className={styles.price}>
                  {powerLawChartItem.price && moneyFormat(powerLawChartItem.price) || '???'}
                </span>
                Max: <span className={styles.deviation}>{moneyFormat(powerLawChartData.regressionPriceMax)}</span>
                Expected: <span className={styles.expected}>{moneyFormat(powerLawChartData.regressionPrice)}</span>
                Min: <span className={styles.deviation}>{moneyFormat(powerLawChartData.regressionPriceMin)}</span>
              </div>
            </div>
          )}
        </div>

        <PowerLawChart
          dataStore={this.dataStore}
          chartStore={this.powerLawChartStore}
        />

        <div className={styles.textBlock}>
          <p>If we plot the same values on linear scales, we can see Bitcoin's
          exponential growth within this corridor.</p>
        </div>

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

        <LinearScaleChart
          dataStore={this.dataStore}
          chartStore={this.linearScaleChartStore}
        />

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
    )
  }
}

export default PowerLawCorridor;