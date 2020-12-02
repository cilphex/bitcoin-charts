import React from 'react';
import dimensions from './dimensions.js';
import ChartLoading from './components/ChartLoading';
import chartStyles from 'styles/chart-styles.scss';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
    this.chartStore = this.props.chartStore;

    this.fetchData();
  }

  async fetchData() {
    await this.dataStore.fetchData();
    this.gotData();
  }

  gotData() {
    // Override me in subclasses
  }

  get chartDimensions() {
    return dimensions;
  }

  get loadingView() {
    return <ChartLoading />;
  }

  get chartView() {
    return <div>No chart defined.</div>;
  }

  render() {
    const { chartData } = this.dataStore;
    const view = chartData
      ? this.chartView
      : this.loadingView;

    return (
      <div className={chartStyles.chart}>
        {view}
      </div>
    );
  }
}

export default Chart;