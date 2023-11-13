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

  get defaultRangeValues() {
    return {
      min: 150,
      max: 10000 - 1,
    }
  }

  onRangeChange(e) {
    // Invert the value so that the chart pulls in the same direction as the slider
    const maxDays = this.defaultRangeValues.max - e.target.value + this.defaultRangeValues.min;
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
