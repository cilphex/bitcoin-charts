import React from 'react';
import moment from 'moment';
import { moneyFormat } from 'lib/utils.js'

// Components
import BasicChart from './components/BasicChart';
import RegressionChart from './components/RegressionChart';

// Styles
import styles from "app.scss";

class NeverLookBack extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;

    this.basicDataRef = React.createRef();
    this.basicDateRef = React.createRef();
    this.basicPriceRef = React.createRef();
    this.basicForwardMinRef = React.createRef();

    this.regressionDataRef = React.createRef();
    this.regressionPriceRef = React.createRef();
    this.regressionMaxRef = React.createRef();
    this.regressionMinRef = React.createRef();
    this.regressionExpectedRef = React.createRef();
  }

  basicChartMouseOver() {
    this.basicDataRef.current.style.visibility = 'visible';
  }

  basicChartMouseOut() {
    this.basicDataRef.current.style.visibility = 'hidden';
  }

  basicChartMouseMove(item) {
    this.basicDateRef.current.textContent = moment(item.date).format('MMM D, YYYY');
    this.basicPriceRef.current.textContent = moneyFormat(item.price);
    this.basicForwardMinRef.current.textContent = moneyFormat(item.forwardMinimumPrice);
  }

  regressionChartMouseOver() {
    this.regressionDataRef.current.style.visibility = 'visible';
  }

  regressionChartMouseOut() {
    this.regressionDataRef.current.style.visibility = 'hidden';
  }

  regressionChartMouseMove(item) {
    this.regressionDateRef.current.textContent = moment(item.date).format('MMM D, YYYY');
  }

  render() {
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
          <div ref={this.basicDataRef} className={styles.chartDataTop}>
            <div ref={this.basicDateRef} />
            <div>
              Price: <span ref={this.basicPriceRef} className={styles.price} />
              NLB: <span ref={this.basicForwardMinRef} className={styles.forwardMinPrice} />
            </div>
          </div>
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
          onMouseOver={() => this.basicChartMouseOver()}
          onMouseOut={() => this.basicChartMouseOut()}
          onMouseMove={(item) => this.basicChartMouseMove(item)}
        />

        <div className={styles.chartHeader}>
          <h2>Regression</h2>
          <div ref={this.regressionDataRef} className={styles.chartDataTop}>
            <div ref={this.dateRef} />
            <div>
              Price: <span ref={this.regressionPriceRef} className={styles.price} />
              Max: <span ref={this.regressionMaxRef} className={styles.deviation} />
              Expected: <span ref={this.regressionExpectedRef} className={styles.expected} />
              Min: <span ref={this.regressionMinRef} className={styles.deviation} />
            </div>
          </div>
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
          onMouseOver={() => this.regressionChartMouseOver()}
          onMouseOut={() => this.regressionChartMouseOut()}
          onMouseMove={(item) => this.regressionChartMouseMove(item)}
        />
      </div>
    );
  }
}

export default NeverLookBack;