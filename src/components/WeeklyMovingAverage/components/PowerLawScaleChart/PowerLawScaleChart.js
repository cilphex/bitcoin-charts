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

const bisectDate = bisector((d) => d.date).right;

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
    const { data } = this.dataStore.chartData;
    const { xScale, yScale } = this.scales;
    const { margin } = this.chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = xScale.invert(x);
    const index = Math.round(date)
    const item = data[index];
    const xPos = xScale(index);

    // Basic chart data does not have regression predictions so item may not exist
    // if we hover past the current day. (Hence "item &&".)
    const yPosPrice = item && yScale(item.price);
    const yPosWMA200Week = item && yScale(item.wma200week);

    this.chartStore.setData({
      xPos,
      yPosPrice,
      yPosWMA200Week,
    });

    this.chartStore.setItem(item);
  }

  get scales() {
    const {
      data,
      regressionData,
    } = this.dataStore.chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    const maxDays = data.length
    const maxRegressionPlc = regressionData[maxDays].regressionPlc;

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
          Math.pow(10, maxRegressionPlc)
        ]
      })
    }
  }

  get chartView() {
    const {
      data,
      regressionData,
    } = this.dataStore.chartData;

    // wmaData is data with the starting values that don't have 200 weeks of
    // history sliced out
    const wmaData = data.slice(
      data.findIndex(item => !!item.wma200week)
    )

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
      yPosWMA200Week,
    } = hoverData;

    return <>
      <svg className={chartStyles.chartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <Group top={margin.top} left={margin.left}>
          {/* Clip path for lines */}
          <RectClipPath
            id="linear_scale_chart"
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

          {/* 200 WMA line */}
          <LinePath
            data={wmaData}
            x={(d) => xScale(d.index + 1)}
            y={(d) => yScale(d.wma200week)}
            className={`${chartStyles.pathLine} ${chartStyles.pathForwardMinPrice}`}
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

              { yPosWMA200Week && (
                <circle
                  cx={xPos}
                  cy={yPosWMA200Week}
                  className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleForwardMin}`}
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
    </>;
  }
}

export default PowerLawScaleChart;
