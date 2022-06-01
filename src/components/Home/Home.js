import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { moneyFormat } from 'lib/utils';
import appStyles from 'app.scss';
import styles from './Home.scss';

function Home(props) {
  const { chartData } = props.dataStore;

  let data;
  let standardDeviationNlb;
  let standardDeviationPlc;
  let lowestNlb;
  let lowestPlc;
  let lowestWma;
  let nlbGrowth;
  let plcGrowth;
  let wmaGrowth;

  if (chartData) {
    data = chartData && chartData.data;
    standardDeviationNlb = chartData.standardDeviationNlb;
    standardDeviationPlc = chartData.standardDeviationPlc;
    const lastItem = data[data.length - 1];
    const previousItem = data[data.length - 2];

    lowestNlb = Math.pow(10, lastItem.regressionNlb - standardDeviationNlb);
    lowestPlc = Math.pow(10, lastItem.regressionPlc - standardDeviationPlc);
    lowestWma = Math.pow(10, lastItem.regressionWma);

    const prevLowestNlb = Math.pow(10, previousItem.regressionNlb - standardDeviationNlb);
    const prevLowestPlc = Math.pow(10, previousItem.regressionPlc - standardDeviationPlc);
    const prevLowestWma = Math.pow(10, previousItem.regressionWma);

    nlbGrowth = Math.floor(lowestNlb - prevLowestNlb);
    plcGrowth = Math.floor(lowestPlc - prevLowestPlc);
    wmaGrowth = Math.floor(lowestWma - prevLowestWma);
  }

  return (
    <div className={appStyles.contentColumn}>
      <h1>Bitcoin Charts</h1>
      <div className={appStyles.textBlock}>
        <p>Money is a self-organizing system of resource management.</p>
        <p>Bitcoin is better money, because it allows for more pure
        self-organization as a result of its money supply being predetermined by
        hard-coded, low-inflation algorithm &mdash; rather than by fiat decree.</p>
      </div>

      <div className={styles.links}>
        <dl className={styles.columnTitles}>
          <dd></dd>
          <dd>Min price</dd>
          <dd>Growth/day</dd>
        </dl>
        <Link to="/never-look-back">
          <dl>
            <dd>Never Look Back Price</dd>
            <dd>{lowestNlb && (<>{moneyFormat(lowestNlb)}</>)}</dd>
            <dd>{nlbGrowth && (<>{moneyFormat(nlbGrowth)}</>)}</dd>
          </dl>
        </Link>
        <Link to="/power-law-corridor">
          <dl>
            <dd>Power Law Corridor</dd>
            <dd>{lowestPlc && (<>{moneyFormat(lowestPlc)}</>)}</dd>
            <dd>{plcGrowth && (<>{moneyFormat(plcGrowth)}</>)}</dd>
          </dl>
        </Link>
        <Link to="/weekly-moving-average">
          <dl>
            <dd>200-Week Moving Average</dd>
            <dd>{lowestWma && (<>{moneyFormat(lowestWma)}</>)}</dd>
            <dd>{wmaGrowth && (<>{moneyFormat(wmaGrowth)}</>)}</dd>
          </dl>
        </Link>
      </div>
    </div>
  )
}

export default observer(Home);
