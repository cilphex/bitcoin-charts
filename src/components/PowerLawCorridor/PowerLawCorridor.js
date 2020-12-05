import React from "react"
import {observer} from 'mobx-react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Stores
import ChartStore from 'stores/ChartStore';

// Components
import PowerLawChart from './components/PowerLawChart';
import ChartPageFooter from 'components/ChartPageFooter';

// Styles
import styles from "app.scss";

@observer
class PowerLawCorridor extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.powerLawChartStore = new ChartStore();
  }

  render() {
    const {
      hoverData: powerLawChartData,
      hoverItem: powerLawChartItem,
    } = this.powerLawChartStore;

    return (
      <div>
        <h1>Bitcoin's Power Law Corridor</h1>
        <p className={styles.intro}>
          As described in {' '}
          <a href="https://medium.com/coinmonks/bitcoins-natural-long-term-power-law-corridor-of-growth-649d0e9b3c94">this article</a>
          {' '} by {' '}
          <a href="https://twitter.com/hcburger1">Harold Christopher Burger</a>
        </p>

        <div className={styles.chartDescription}>
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
        
        <ChartPageFooter
          sourceUrl="https://medium.com/coinmonks/bitcoins-natural-long-term-power-law-corridor-of-growth-649d0e9b3c94"
          sourceText="Original Article by Harold Christopher Burger"
        />
      </div>
    )
  }
}

export default PowerLawCorridor;