import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as d3 from 'd3';
import { scalePower, scaleLog } from "@vx/scale";
import { Group } from "@vx/group";
import { LinePath } from "@vx/shape";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { RectClipPath } from "@vx/clip-path";
import { Grid } from "@vx/grid";
import { localPoint } from "@vx/event";

import Chart from 'components/Chart';
import chartStyles from 'styles/chart-styles.scss';

@observer
class RegressionChart extends Chart {
  constructor(props) {
    super(props);

    this.state = {};
  }

  gotData() {
    const { chartData } = this.dataStore;
    const { data } = chartData;

    this.setScales(data.length - 1);
  }

  onMouseOver() {
    this.chartStore.hovering = true;
  }

  onMouseOut() {
    this.chartStore.hovering = false;
  }

  onMouseMove(e) {
    const {
      regressionData,
      standardDeviationNlb
    } = this.dataStore.chartData;
    const { margin } = this.chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = this.state.xScale.invert(x);
    const index = Math.round(date);
    const item = regressionData[index];
    const xPos = this.state.xScale(index);

    let yPosForwardMin;
    if (item.forwardMinimumPrice) {
      yPosForwardMin = this.state.yScale(item.forwardMinimumPrice);
    }

    const regressionPrice = Math.pow(10, item.regressionNlb)
    const regressionPriceMax = Math.pow(10, item.regressionNlb + standardDeviationNlb)
    const regressionPriceMin = Math.pow(10, item.regressionNlb - standardDeviationNlb)

    const yPosRegression = this.state.yScale(regressionPrice)
    const yPosRegressionMax = this.state.yScale(regressionPriceMax)
    const yPosRegressionMin = this.state.yScale(regressionPriceMin)

    Object.assign(this.chartStore.data, {
      regressionPrice,
      regressionPriceMax,
      regressionPriceMin,
      xPos,
      yPosForwardMin,
      yPosRegression,
      yPosRegressionMax,
      yPosRegressionMin,
    });

    this.chartStore.item = item;
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

    this.setScales(maxDays);
  }

  setScales(maxDays) {
    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
    } = chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    const maxRegressionNlb = regressionData[maxDays].regressionNlb;

    this.setState({
      xScale: scalePower({
        range: [0, innerWidth],
        domain: [0, maxDays],
        exponent: 0.5
      }),
      yScale: scaleLog({
        range: [innerHeight, 0],
        domain: [
          d3.min(data, (d) => d.forwardMinimumPrice),
          Math.pow(10, maxRegressionNlb)
        ]
      })
    });
  }

  get chartView() {
    if (!this.state.xScale || !this.state.yScale) {
      return <div>Scaling...</div>;
    }

    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
      standardDeviationNlb
    } = chartData;
    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;

    const rowTickValues = Array(9).fill(null).map((val, i) => Math.pow(10, i-1));
    const colTickValues = regressionData
      .filter(i => i.date.getMonth() == 0 && i.date.getDate() == 1)
      .map(i => i.index);

    const { hoverData } = this.chartStore;
    const {
      xPos,
      yPosForwardMin,
      yPosRegression,
      yPosRegressionMax,
      yPosRegressionMin,
    } = hoverData;

    return (
      <div>
        <svg className={chartStyles.chartSvg} width={800} height={400} viewBox={`0 0 ${width} ${height}`}>
          <Group top={margin.top} left={margin.left}>
            {/* Clip path for lines */}
            <RectClipPath
              id="regression_chart_clip"
              x={0}
              y={0 - margin.top}
              width={innerWidth + margin.right}
              height={innerHeight + margin.top}
            />

            {/* Background grid */}
            <Grid
              xScale={this.state.xScale}
              yScale={this.state.yScale}
              width={innerWidth}
              height={innerHeight}
              rowTickValues={rowTickValues}
              columnTickValues={colTickValues}
              className={'something'}
            />

            {/* Forward min line */}
            <LinePath
              data={data}
              x={(d) => this.state.xScale(d.index)}
              y={(d) => this.state.yScale(d.forwardMinimumPrice)}
              className={`${chartStyles.pathLine} ${chartStyles.pathForwardMinPrice}`}
            />

            {/* Regression line */}
            <LinePath
              data={data}
              x={(d) => this.state.xScale(d.index)}
              y={(d) => this.state.yScale(Math.pow(10, d.regressionNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegression}`}
              clipPath="url(#regression_chart_clip)"
            />

            {/* Regression line top deviation */}
            <LinePath
              data={data}
              x={(d) => this.state.xScale(d.index)}
              y={(d) => this.state.yScale(Math.pow(10, d.regressionNlb + standardDeviationNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegressionStdDev}`}
              clipPath="url(#regression_chart_clip)"
            />

            {/* Regression line bottom deviation */}
            <LinePath
              data={data}
              x={(d) => this.state.xScale(d.index)}
              y={(d) => this.state.yScale(Math.pow(10, d.regressionNlb - standardDeviationNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegressionStdDev}`}
              clipPath="url(#regression_chart_clip)"
            />

            { hoverData && (
              <Group>
                {/* The vertical line that follows the cursor when hovering */}
                <line
                  x1={xPos}
                  y1={0}
                  x2={xPos}
                  y2={innerHeight}
                  className={chartStyles.mouseLine}
                />

                {/* Forward min circle */}
                <circle
                  cx={xPos}
                  cy={yPosForwardMin}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleForwardMin}`}
                />

                {/* Regression circle */}
                <circle
                  cx={xPos}
                  cy={yPosRegression}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleRegression}`}
                />

                {/* Regression circle max/top */}
                <circle
                  cx={xPos}
                  cy={yPosRegressionMax}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleDeviation}`}
                />

                {/* Regression circle min/bottom */}
                <circle
                  cx={xPos}
                  cy={yPosRegressionMin}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleDeviation}`}
                />
              </Group>
            )}

            {/* Left axis */}
            <AxisLeft
              scale={this.state.yScale}
              tickValues={rowTickValues}
              tickFormat={d3.format(",.1f")}
            />

            {/* Bottom axis */}
            <AxisBottom
              scale={this.state.xScale}
              top={innerHeight}
              tickValues={colTickValues}
              tickFormat={i => moment(data[0].date).add(i, 'days').format('`YY')}
            />

            {/* Hover detection area */}
            <rect
              width={innerWidth}
              height={innerHeight}
              className={chartStyles.mouseOverlay}
              onMouseOver={() => this.onMouseOver()}
              onMouseOut={() => this.onMouseOut()}
              onMouseMove={(e) => this.onMouseMove(e)}
            />
          </Group>
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

export default RegressionChart;