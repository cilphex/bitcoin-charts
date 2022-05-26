import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as d3 from 'd3';
import { scaleTime, scaleLinear } from '@vx/scale';
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import { RectClipPath } from "@vx/clip-path";
import { LinePath } from "@vx/shape";
import { localPoint } from "@vx/event";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { bisector } from 'd3-array';

import Chart from 'components/Chart';
import chartStyles from 'styles/chart.scss';

const bisectDate = bisector((d) => d.date).right;

@observer
class LinearScaleChart extends Chart {
  constructor(props) {
    super(props);
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
    this.chartStore.setHovering(true);
  }

  onMouseOut() {
    this.chartStore.setHovering(false);
  }

  onMouseMove(e) {
    const {
      regressionData,
      standardDeviationNlb
    } = this.dataStore.chartData;
    const { xScale, yScale } = this.scales;

    const { margin } = this.chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = xScale.invert(x)
    const index = bisectDate(regressionData, date, 1);
    const item = regressionData[index];
    const xPos = xScale(date);

    const yPosPrice = yScale(item.price);
    const regressionPrice = Math.pow(10, item.regressionNlb)
    const regressionPriceMax = Math.pow(10, item.regressionNlb + standardDeviationNlb)
    const regressionPriceMin = Math.pow(10, item.regressionNlb - standardDeviationNlb)

    const yPosRegression = yScale(regressionPrice)
    const yPosRegressionMax = yScale(regressionPriceMax)
    const yPosRegressionMin = yScale(regressionPriceMin)

    this.chartStore.assignData({
      regressionPrice,
      regressionPriceMax,
      regressionPriceMin,
      xPos,
      yPosPrice,
      yPosRegression,
      yPosRegressionMax,
      yPosRegressionMin,
    });

    this.chartStore.setItem(item);
  }

  get scales() {
    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
    } = chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    const maxDays = this.state.maxDays || data.length;
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
        domain: [
          data[0].date,
          moment(data[0].date).add(maxDays, 'days').toDate()
        ],
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

    const { hoverData } = this.chartStore;
    const {
      xPos,
      yPosPrice,
      yPosRegression,
      yPosRegressionMax,
      yPosRegressionMin,
    } = hoverData;

    return (
      <div>
        <svg className={chartStyles.chartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <Group top={margin.top} left={margin.left}>
            {/* Clip path for lines */}
            <RectClipPath
              id="linear_scales_chart_clip"
              x={0}
              y={0 - margin.top}
              width={innerWidth + margin.right}
              height={innerHeight + margin.top}
            />

            {/* Background grid */}
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={innerWidth}
              height={innerHeight}
            />

            {/* Price line */}
            <LinePath
              data={data}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.price)}
              className={`${chartStyles.pathLine} ${chartStyles.pathPrice}`}
            />

            {/* Regression line */}
            <LinePath
              data={regressionData}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(Math.pow(10, d.regressionNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegression}`}
              clipPath="url(#linear_scales_chart_clip)"
            />

            {/* Regression line max */}
            <LinePath
              data={regressionData}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(Math.pow(10, d.regressionNlb + standardDeviationNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegressionStdDev}`}
              clipPath="url(#linear_scales_chart_clip)"
            />

            {/* Regression line min */}
            <LinePath
              data={regressionData}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(Math.pow(10, d.regressionNlb - standardDeviationNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegressionStdDev}`}
              clipPath="url(#linear_scales_chart_clip)"
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
                { yPosPrice && (
                  <circle
                    cx={xPos}
                    cy={yPosPrice}
                    className={`${chartStyles.mouseCircle} ${chartStyles.mouseCirclePrice}`}
                  />
                )}

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
              scale={yScale}
              tickFormat={d3.format(",.1f")}
            />

            {/* Bottom axis */}
            <AxisBottom
              scale={xScale}
              top={innerHeight}
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

export default LinearScaleChart;
