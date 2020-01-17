import React from 'react';
import moment from 'moment';
import { scalePower, scaleLog } from "@vx/scale";
import { min } from "d3-array";
import { format } from "d3-format";
import { observer } from 'mobx-react';
import ChartLoading from 'components/ChartLoading';
import chartStyles from 'styles/chart-styles.scss';
import { Group } from "@vx/group";
import { LinePath } from "@vx/shape";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { RectClipPath } from "@vx/clip-path";
import { Grid } from "@vx/grid";

const chartDimensions = (() => {
  const margin = { top: 20, right: 20, bottom: 35, left: 75 };
  const width = 800;
  const height = 400;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { margin, width, height, innerWidth, innerHeight };
})();

@observer
class RegressionChart extends React.Component {
  constructor(props) {
    super(props);

    this.dataStore = this.props.dataStore;
  }

  get loadingView() {
    return <ChartLoading />;
  }

  get chartView() {
    const { chartData } = this.dataStore;
    const {
      data,
      regressionData,
      standardDeviationNlb
    } = chartData;
    const { margin, width, height, innerWidth, innerHeight } = chartDimensions;
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

export default RegressionChart;