import React from 'react';
import { observer } from 'mobx-react';
import * as d3 from 'd3';
import { Group } from '@vx/group';
import { RectClipPath } from '@vx/clip-path';
import { Grid } from '@vx/grid';
import { scaleLinear, scaleTime } from '@vx/scale';
import { LinePath } from '@vx/shape';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { localPoint } from '@vx/event';
import { bisector } from 'd3-array';

import Chart from 'components/Chart';
import chartStyles from 'styles/chart.scss';

const bisectDate = bisector((d) => d.date).right;

@observer
class LinearScaleChart extends Chart {
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
    const index = bisectDate(data, date, 1); // get the index for the domain value
    const item = data[index];
    const xPos = xScale(date);

    // Basic chart data does not have regression predictions so item may not exist
    // if we hover past the current day. (Hence "item &&".)
    const yPosPrice = item && yScale(item.price);

    this.chartStore.setData({
      xPos,
      yPosPrice,
    });

    this.chartStore.setItem(item);
  }

  get scales() {
    const { data } = this.dataStore.chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    return {
      xScale: scaleTime({
        range: [0, innerWidth],
        domain: d3.extent(data, (d) => d.date)
      }),
      yScale: scaleLinear({
        range: [innerHeight, 0],
        domain: d3.extent(data, (d) => d.price)
      }),
    }
  }

  get chartView() {
    const { data } = this.dataStore.chartData;

    // wmaData is data with the starting values that don't have 200 weeks of
    // history sliced out
    const wmaData = data.slice(
      data.findIndex(item => !!item.wma200week)
    )
    const wmaDataPrelim = data.slice(
      0, data.findIndex(item => !!item.wma200week)
    )

    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;
    const { xScale, yScale } = this.scales;

    const { hoverData } = this.chartStore;
    const {
      xPos,
      yPosPrice,
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
          />

          {/* Price line */}
          <LinePath
            data={data}
            x={(d) => xScale(d.date)}
            y={(d) => yScale(d.price)}
            className={`${chartStyles.pathLine} ${chartStyles.pathPrice}`}
          />

          {/* 200 WMA line - Preliminary, for dates w/o full 200-week history */}
          <LinePath
            data={wmaDataPrelim}
            x={(d) => xScale(d.date)}
            y={(d) => yScale(d.wma200week_prelim)}
            className={`${chartStyles.pathLine} ${chartStyles.lightBlue}`}
          />

          {/* 200 WMA line */}
          <LinePath
            data={wmaData}
            x={(d) => xScale(d.date)}
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
    </>;
  }
}

export default LinearScaleChart;
