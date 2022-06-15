import React from "react";
import PropTypes from "prop-types";
import dimensions from "./dimensions.js";

import DataStore from "stores/DataStore.js";
import ChartStore from "stores/ChartStore.js";

import ChartLoading from "./components/ChartLoading.js";
import chartStyles from "styles/chart.scss";

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxDays: null,
    };

    this.dataStore = this.props.dataStore;
    this.chartStore = this.props.chartStore;
  }

  static get propTypes() {
    return {
      dataStore: PropTypes.instanceOf(DataStore),
      chartStore: PropTypes.instanceOf(ChartStore),
    };
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

  mapInputRangeToDays(rangeValue) {
    rangeValue = 100 - rangeValue;
    const { chartData } = this.dataStore;
    const min = chartData.data.length;
    const max = 10000 - 1;
    const rangeDiff = max - min;
    const percent = rangeValue / 100;
    const offset = rangeDiff * percent;
    const pos = min + offset;
    return Math.round(pos);
  }

  onRangeChange(e) {
    const maxDays = this.mapInputRangeToDays(e.target.value);
    this.setState({ maxDays });
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
