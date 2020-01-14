import React from "react";
import moment from "moment";
import rawData from 'lib/data.js';
import ChartData from 'lib/chart-data.js'
import { extent } from 'd3-array';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath } from '@vx/shape';
import styles from "./NeverLookBack.scss";

class NeverLookBack extends React.Component {
  constructor(props) {
    super(props);

    this.chartData = new ChartData(rawData);

    window.data = this.chartData.data;
  }

  componentDidMount() {
  }

  get ticks() {
    const dates = [
      "2010-01-01",
      "2011-01-01",
      "2012-01-01",
      "2013-01-01",
      "2014-01-01",
      "2015-01-01",
      "2016-01-01",
      "2017-01-01",
      "2018-01-01",
      "2019-01-01",
      "2020-01-01",
      "2021-01-01"
    ];

    return dates.map(i => moment(i).unix() * 1000);
  }

  render() {
    const { data } = this.chartData;

    // Vars for dimensions
    const margin = { top: 20, right: 20, bottom: 35, left: 75 };
    const width = 800;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime({
      range: [0, innerWidth],
      domain: extent(data, (d) => d.date)
    });

    const yScale = scaleLinear({
      range: [innerHeight, 0],
      domain: extent(data, (d) => d.price)
    });

    return (
      <div>
        <h1>Bitcoin's Never Look Back Price</h1>
        <p className="intro">
          As described in {' '}
          <a href="https://www.caneislandcrypto.com/blog/2019/10/5/why-bitcoin-is-never-looking-back">this article</a>
          {' '} by {' '}
          <a href="https://twitter.com/nsquaredcrypto">Timothy Peterson</a>
        </p>

        <svg width={800} height={400}>
          <Group top={margin.top} left={margin.left}>
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={innerWidth}
              height={innerHeight}
            />

            <LinePath
              data={data}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.price)}
              className={`${styles['path-line']} ${styles['path-price']}`}
            />

            <LinePath
              data={data}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.forwardMinimumPrice)}
              className={`${styles['path-line']} ${styles['path-forward-min-price']}`}
            />

            <AxisLeft
              scale={yScale}
            />

            <AxisBottom
              scale={xScale}
              top={innerHeight}
            />
          </Group>
        </svg>

      </div>
    )
  }
}

export default NeverLookBack;