import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { min } from "d3-array";
import { format } from "d3-format";
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

    this.lineRef = React.createRef();
    this.forwardMinCircleRef = React.createRef();
    this.regressionCircleRef = React.createRef();
    this.regressionCircleTopRef = React.createRef();
    this.regressionCircleBottomRef = React.createRef();
  }

  onMouseOver() {
    [
      this.lineRef,
      this.forwardMinCircleRef,
      this.regressionCircleRef,
      this.regressionCircleTopRef,
      this.regressionCircleBottomRef
    ].forEach(ref =>
      ref.current.setAttribute('visibility', 'visible')
    )
  }

  onMouseOut() {
    [
      this.lineRef,
      this.forwardMinCircleRef,
      this.regressionCircleRef,
      this.regressionCircleTopRef,
      this.regressionCircleBottomRef
    ].forEach(ref =>
      ref.current.setAttribute('visibility', 'hidden')
    )
  }

  onMouseMove(e, xScale, yScale) {
    const {
      regressionData,
      standardDeviationNlb
    } = this.dataStore.chartData;
    const { margin } = this.chartDimensions;
    const point = localPoint(e);
    const x = point.x - margin.left;
    const date = xScale.invert(x);
    const index = Math.round(date);
    const item = regressionData[index];
    const xPos = xScale(index);

    this.lineRef.current.setAttribute('transform', `translate(${xPos}, 0)`)

    if (item.forwardMinimumPrice) {
      const yPosForwardMin = yScale(item.forwardMinimumPrice);
      this.forwardMinCircleRef.current.setAttribute('visibility', 'visible')
      this.forwardMinCircleRef.current.setAttribute('transform', `translate(${xPos}, ${yPosForwardMin})`)
    }
    else {
      this.forwardMinCircleRef.current.setAttribute('visibility', 'hidden')
    }

    const regressionPrice = Math.pow(10, item.regressionNlb)
    const regressionPriceMax = Math.pow(10, item.regressionNlb + standardDeviationNlb)
    const regressionPriceMin = Math.pow(10, item.regressionNlb - standardDeviationNlb)

    const yPosRegression = yScale(regressionPrice)
    const yPosRegressionMax = yScale(regressionPriceMax)
    const yPosRegressionMin = yScale(regressionPriceMin)

    this.regressionCircleRef.current.setAttribute('transform', `translate(${xPos}, ${yPosRegression})`)
    this.regressionCircleTopRef.current.setAttribute('transform', `translate(${xPos}, ${yPosRegressionMax})`)
    this.regressionCircleBottomRef.current.setAttribute('transform', `translate(${xPos}, ${yPosRegressionMin})`)
  }

  get chartView() {
    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
      standardDeviationNlb
    } = chartData;
    const { margin, width, height, innerWidth, innerHeight } = this.chartDimensions;
    const maxDays = data.length - 1;
    const maxRegressionNlb = regressionData[data.length-1].regressionNlb;

    const xScale = scalePower({
      range: [0, innerWidth],
      domain: [0, maxDays],
      exponent: 0.5
    });

    const yScale = scaleLog({
      range: [innerHeight, 0],
      domain: [
        min(data, (d) => d.forwardMinimumPrice),
        Math.pow(10, maxRegressionNlb)
      ]
    });

    const rowTickValues = Array(9).fill(null).map((val, i) => Math.pow(10, i-1));
    const colTickValues = regressionData
      .filter(i => i.date.getMonth() == 0 && i.date.getDate() == 1)
      .map(i => i.index);

    return (
      <div>
        <svg className={chartStyles.chartSvg} width={800} height={400} viewBox={`0 0 ${width} ${height}`}>
          <Group top={margin.top} left={margin.left}>
            {/* Background grid */}
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={innerWidth}
              height={innerHeight}
              rowTickValues={rowTickValues}
              columnTickValues={colTickValues}
            />

            {/* Forward min line */}
            <LinePath
              data={data}
              x={(d) => xScale(d.index)}
              y={(d) => yScale(d.forwardMinimumPrice)}
              className={`${chartStyles.pathLine} ${chartStyles.pathForwardMinPrice}`}
            />

            {/* Clip path for lines */}
            <RectClipPath
              id="regression_chart_clip"
              x={0}
              y={0 - margin.top}
              width={innerWidth + margin.right}
              height={innerHeight + margin.top}
            />

            {/* Regression line */}
            <LinePath
              data={data}
              x={(d) => xScale(d.index)}
              y={(d) => yScale(Math.pow(10, d.regressionNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegression}`}
              clipPath="url(#regression_chart_clip)"
            />

            {/* Regression line top deviation */}
            <LinePath
              data={data}
              x={(d) => xScale(d.index)}
              y={(d) => yScale(Math.pow(10, d.regressionNlb + standardDeviationNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegressionStdDev}`}
              clipPath="url(#regression_chart_clip)"
            />

            {/* Regression line bottom deviation */}
            <LinePath
              data={data}
              x={(d) => xScale(d.index)}
              y={(d) => yScale(Math.pow(10, d.regressionNlb - standardDeviationNlb))}
              className={`${chartStyles.pathLine} ${chartStyles.pathRegressionStdDev}`}
              clipPath="url(#regression_chart_clip)"
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
              ref={this.forwardMinCircleRef}
              className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleForwardMin}`}
              visibility="hidden"
            />

            <circle
              ref={this.regressionCircleRef}
              className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleRegression}`}
              visibility="hidden"
            />

            <circle
              ref={this.regressionCircleTopRef}
              className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleDeviation}`}
              visibility="hidden"
            />

            <circle
              ref={this.regressionCircleBottomRef}
              className={`${chartStyles.mouseCircle} ${chartStyles.mouseCircleDeviation}`}
              visibility="hidden"
            />

            {/* Left axis */}
            <AxisLeft
              scale={yScale}
              tickValues={rowTickValues}
              tickFormat={format(",.1f")}
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
              onMouseMove={(e) => this.onMouseMove(e, xScale, yScale)}
            />
          </Group>
        </svg>

        <div className={chartStyles.rangeWrapper}>
          <input
            type="range"
            min={0}
            max={150}
            defaultValue={100}
            onChange={() => console.log('change')}
          />
        </div>
      </div>
    );
  }
}

export default RegressionChart;