import React from 'react';
import { scaleLinear, scaleTime } from "@vx/scale";
import { extent } from "d3-array";
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import { LinePath } from "@vx/shape";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { localPoint } from "@vx/event";
import { observer } from 'mobx-react';
import ChartLoading from 'components/ChartLoading';
import chartStyles from 'styles/chart-styles.scss';
import { bisector } from 'd3-array';

const bisectDate = bisector((d) => d.date).right;

const chartDimensions = (() => {
  const margin = { top: 20, right: 20, bottom: 35, left: 75 };
  const width = 800;
  const height = 400;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { margin, width, height, innerWidth, innerHeight };
})();

@observer
class BasicChart extends React.Component {
  constructor(props) {
    super(props);

    this.lineRef = React.createRef();
    this.dataStore = this.props.dataStore;
  }

  onMouseOver() {
    this.lineRef.current.setAttribute('visibility', 'visible')

    if (this.props.onMouseOver) {
      this.props.onMouseOver();
    }
  }

  onMouseOut() {
    this.lineRef.current.setAttribute('visibility', 'hidden')

    if (this.props.onMouseOut) {
      this.props.onMouseOut();
    }
  }

  onMouseMove(e, data, xScale) {
    const { margin } = chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = xScale.invert(x);
    const index = bisectDate(data, date, 1); // get the index for the domain value
    const item = data[index];
    const xPos = xScale(date);

    this.lineRef.current.setAttribute('transform', `translate(${xPos}, 0)`)

    if (this.props.onMouseMove) {
      this.props.onMouseMove(item);
    }
  }

  get loadingView() {
    return (
      <ChartLoading />
    );
  }

  get chartView() {
    const { chartData } = this.dataStore;
    const { data } = chartData;
    const { margin, width, height, innerWidth, innerHeight } = chartDimensions;

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
            visibility="hidden"
            className={chartStyles.mouseLine}
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
            onMouseMove={(e) => this.onMouseMove(e, data, xScale)}
          />
        </Group>
      </svg>
    );
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

export default BasicChart;