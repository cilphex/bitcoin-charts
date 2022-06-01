import React from 'react';
import { observer } from 'mobx-react';
import * as d3 from 'd3';
import { Group } from '@vx/group';
import { RectClipPath } from '@vx/clip-path';
import { Grid } from '@vx/grid';
import { scalePower, scaleLog } from '@vx/scale';
import { LinePath } from '@vx/shape';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { localPoint } from '@vx/event';
import { bisector } from 'd3-array';

import Chart from 'components/Chart';
import chartStyles from 'styles/chart.scss';
import moment from "moment";

@observer
class PowerLawScaleChart extends Chart {
  constructor(props) {
    super(props);
  }

  onMouseOver() {
    this.chartStore.setHovering(true);
  }

  onMouseOut() {
    this.chartStore.setHovering(false);
  }

  onMouseMove(e) {
    const { regressionData } = this.dataStore.chartData;
    const { xScale, yScale } = this.scales;
    const { margin } = this.chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = xScale.invert(x);
    const index = Math.round(date)
    const item = regressionData[index];
    const xPos = xScale(index);

    // Basic chart data does not have regression predictions so item may not exist
    // if we hover past the current day. (Hence "item &&".)
    const yPosPrice = item.price && yScale(item.price)
    const yPosRegression = yScale(Math.pow(10, item.regressionWma))

    this.chartStore.setData({
      xPos,
      yPosPrice,
      yPosRegression,
    });

    this.chartStore.setItem(item);
  }

  get scales() {
    const {
      data,
      regressionData,
    } = this.dataStore.chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    const maxDays = this.state.maxDays || data.length;
    const maxRegressionWma = regressionData[maxDays].regressionWma;

    return {
      xScale: scalePower({
        range: [0, innerWidth],
        domain: [0, maxDays],
        exponent: 0.5
      }),
      yScale: scaleLog({
        range: [innerHeight, 0],
        domain: [
          d3.min(data, (d) => d.price),
          Math.pow(10, maxRegressionWma) * 3 // Pull the top down a bit with the *3
        ]
      })
    }
  }

  get chartView() {
    const {
      data,
      regressionData,
    } = this.dataStore.chartData;

    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;
    const { xScale, yScale } = this.scales;

    const rowTickValues = Array(9).fill(null).map((val, i) => Math.pow(10, i-1));
    const colTickValues = regressionData
      .filter(i => i.date.getMonth() == 0 && i.date.getDate() == 1)
      .map(i => i.index);

    const { hoverData } = this.chartStore;
    const {
      xPos,
      yPosPrice,
      yPosRegression,
    } = hoverData;

    return <>
      <svg className={chartStyles.chartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <Group top={margin.top} left={margin.left}>
          {/* Clip path for lines */}
          <RectClipPath
            id="line_of_best_fit_clip"
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
            rowTickValues={rowTickValues}
            columnTickValues={colTickValues}
          />

          {/* Price line */}
          {/* TODO: Why index + 1 on x scale? */}
          <LinePath
            data={data}
            x={(d) => xScale(d.index + 1)}
            y={(d) => yScale(d.price)}
            className={`${chartStyles.pathLine} ${chartStyles.pathPrice}`}
          />

          {/* Regression line */}
          <LinePath
            data={regressionData}
            x={(d) => xScale(d.index + 1)}
            y={(d) => yScale(Math.pow(10, d.regressionWma))}
            className={`${chartStyles.pathLine} ${chartStyles.solidBlueStroke}`}
            clipPath="url(#line_of_best_fit_clip)"
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

              { yPosPrice && (
                <circle
                  cx={xPos}
                  cy={yPosPrice}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCirclePrice}`}
                />
              )}

              { yPosRegression && (
                <circle
                  cx={xPos}
                  cy={yPosRegression}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCirclePrice}`}
                />
              )}
            </Group>
          )}

          {/* Left axis */}
          <AxisLeft
            scale={yScale}
            tickValues={rowTickValues}
            tickFormat={d3.format(",.1f")}
          />

          {/* Bottom axis */}
          <AxisBottom
            scale={xScale}
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
    </>;
  }
}

export default PowerLawScaleChart;
