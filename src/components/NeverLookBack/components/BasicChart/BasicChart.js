import React from 'react';
import { observer } from 'mobx-react';
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "@vx/scale";
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import { LinePath, Circle } from "@vx/shape";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { localPoint } from "@vx/event";

import { bisector } from 'd3-array';

import Chart from 'components/Chart';
import chartStyles from 'styles/chart-styles.scss';

const bisectDate = bisector((d) => d.date).right;

@observer
class BasicChart extends Chart {
  constructor(props) {
    super(props);

    this.lineRef = React.createRef();
    this.priceCircleRef = React.createRef();
    this.forwardMinCircleRef = React.createRef();
  }

  onMouseOver() {
    this.lineRef.current.setAttribute('visibility', 'visible')
    this.priceCircleRef.current.setAttribute('visibility', 'visible')
    this.forwardMinCircleRef.current.setAttribute('visibility', 'visible')

    if (this.props.onMouseOver) {
      this.props.onMouseOver();
    }
  }

  onMouseOut() {
    this.lineRef.current.setAttribute('visibility', 'hidden')
    this.priceCircleRef.current.setAttribute('visibility', 'hidden')
    this.forwardMinCircleRef.current.setAttribute('visibility', 'hidden')

    if (this.props.onMouseOut) {
      this.props.onMouseOut();
    }
  }

  onMouseMove(e, data, xScale, yScale) {
    const { margin } = this.chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = xScale.invert(x);
    const index = bisectDate(data, date, 1); // get the index for the domain value
    const item = data[index];
    const xPos = xScale(date);

    const yPosPrice = yScale(item.price);
    const yPosForwardMin = yScale(item.forwardMinimumPrice);

    this.lineRef.current.setAttribute('transform', `translate(${xPos}, 0)`)
    this.priceCircleRef.current.setAttribute('transform', `translate(${xPos}, ${yPosPrice})`)
    this.forwardMinCircleRef.current.setAttribute('transform', `translate(${xPos}, ${yPosForwardMin})`)

    if (this.props.onMouseMove) {
      this.props.onMouseMove(item);
    }
  }

  get chartView() {
    const { chartData } = this.dataStore;
    const { data } = chartData;
    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;

    const xScale = scaleTime({
      range: [0, innerWidth],
      domain: extent(data, (d) => d.date)
    });

    const yScale = scaleLinear({
      range: [innerHeight, 0],
      domain: extent(data, (d) => d.price)
    });

    return (
      <svg className={chartStyles.chartSvg} width={800} height={400} viewBox={`0 0 ${width} ${height}`}>
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

          {/* The vertical line that follows the cursor when hovering */}
          <line
            ref={this.lineRef}
            x1={0}
            y1={0}
            x2={0}
            y2={innerHeight}
            className={chartStyles.mouseLine}
            visibility="hidden"
          />

          <circle
            ref={this.priceCircleRef}
            className={`${chartStyles.mouseCircle} ${chartStyles.mouseCirclePrice}`}
            visibility="hidden"
          />

          <circle
            ref={this.forwardMinCircleRef}
            className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleForwardMin}`}
            visibility="hidden"
          />

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
            onMouseMove={(e) => this.onMouseMove(e, data, xScale, yScale)}
          />
        </Group>
      </svg>
    );
  }
}

export default BasicChart;