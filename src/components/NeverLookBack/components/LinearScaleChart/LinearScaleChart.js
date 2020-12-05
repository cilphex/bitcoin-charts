import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as d3 from 'd3';
import { scaleTime, scaleLinear } from '@vx/scale';

import Chart from 'components/Chart';
import chartStyles from 'styles/chart-styles.scss';
import {Group} from "@vx/group";
import {Grid} from "@vx/grid";

@observer
class LinearScaleChart extends Chart {
  constructor(props) {
    super(props);

    this.state = {
      maxDays: null,
    };
  }

  // TODO: memoize this
  get priceToRegressionRatio() {
    const { chartData } = this.dataStore;
    const { data } = chartData;
    const origMaxPrice = d3.max(data, (d) => d.price);
    const origMaxRegressionNlb = Math.pow(10, data[data.length-1].regressionNlb);
    const ratio = origMaxPrice / origMaxRegressionNlb;
    return ratio;
  }

  onMouseOver() {
    this.chartStore.hovering = true;
  }

  onMouseOut() {
    this.chartStore.hovering = false;
  }

  onMouseMove() {

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

  get scales() {
    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
    } = chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    const maxDays = this.state.maxDays || data.length - 1;
    const maxRegressionNlb = regressionData[maxDays].regressionNlb;
    const maxDayRegressionNlb = Math.pow(10, maxRegressionNlb);
    const maxPrice = maxDayRegressionNlb * this.priceToRegressionRatio;

    // Memoize, so we're re-evaluating on scale sliding but not on
    // every mouse move
    if (maxDays == this.prevMaxDays) {
      return this._scales;
    }

    this.prevMaxDays = maxDays;
    this._scales = {
      xScale: scaleTime({
        range: [0, innerWidth],
        domain: [data[0].date, moment(data[0].date).add(maxDays, 'days').toDate()],
      }),
      yScale: scaleLinear({
        range: [innerHeight, 0],
        domain: [0, maxPrice]
      })
    };

    return this._scales;
  }

  get chartView() {
    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
      standardDeviationNlb
    } = chartData;
    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;
    const { xScale, yScale } = this.scales;

    const rowTickValues = Array(9).fill(null).map((val, i) => Math.pow(10, i-1));
    const colTickValues = regressionData
      .filter(i => i.date.getMonth() == 0 && i.date.getDate() == 1)
      .map(i => i.index);

    return (
      <div>
        <svg className={chartStyles.chartSvg} width={800} height={400} viewBox={`0 0 ${width} ${height}`}>

        </svg>

        <div className={chartStyles.rangeWrapper}>
          <input
            type="range"
            min={0}
            max={150}
            defaultValue={100}
            onChange={(e) => this.onRangeChange(e)}
          />
        </div>
      </div>
    );
  }
}

export default LinearScaleChart;