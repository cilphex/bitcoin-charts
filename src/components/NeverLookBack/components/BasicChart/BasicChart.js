import React from "react";
import { observer } from "mobx-react";
import * as d3 from "d3";
import { scaleLinear, scaleTime } from "@vx/scale";
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import { LinePath } from "@vx/shape";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { localPoint } from "@vx/event";

import { bisector } from "d3-array";

import Chart from "components/Chart/index.js";
import chartStyles from "styles/chart.scss";

const bisectDate = bisector((d) => d.date).right;

@observer
class BasicChart extends Chart {
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
    const yPosForwardMin = item && yScale(item.forwardMinimumPrice);

    this.chartStore.setData({
      xPos,
      yPosPrice,
      yPosForwardMin,
    });

    this.chartStore.setItem(item);
  }

  get scales() {
    const { data } = this.dataStore.chartData;
    const { innerWidth, innerHeight } = this.chartDimensions;
    return {
      xScale: scaleTime({
        range: [0, innerWidth],
        domain: d3.extent(data, (d) => d.date),
      }),
      yScale: scaleLinear({
        range: [innerHeight, 0],
        domain: d3.extent(data, (d) => d.price),
      }),
    };
  }

  get chartView() {
    const { data } = this.dataStore.chartData;
    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;
    const { xScale, yScale } = this.scales;

    const { hoverData } = this.chartStore;
    const {
      xPos,
      yPosPrice,
      yPosForwardMin,
    } = hoverData;

    return (
      <svg className={chartStyles.chartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <Group top={margin.top} left={margin.left}>
          {/* Background grid */}
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
          />

          {/* The bitcoin price line */}
          <LinePath
            data={data}
            x={(d) => xScale(d.date)}
            y={(d) => yScale(d.price)}
            className={`${chartStyles.pathLine} ${chartStyles.pathPrice}`}
          />

          {/* The NLB price line */}
          <LinePath
            data={data}
            x={(d) => xScale(d.date)}
            y={(d) => yScale(d.forwardMinimumPrice)}
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

              <circle
                cx={xPos}
                cy={yPosPrice}
                className={`${chartStyles.mouseCircle} ${chartStyles.mouseCirclePrice}`}
              />

              <circle
                cx={xPos}
                cy={yPosForwardMin}
                className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleForwardMin}`}
              />
            </Group>
          )}

          {/* Left axis */}
          <AxisLeft
            scale={yScale}
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
    );
  }
}

export default BasicChart;
