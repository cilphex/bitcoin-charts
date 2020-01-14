// import React from 'react';
// import * as d3 from 'd3';
// import moment from 'moment';
// import rawData from 'lib/data.js';
// import ChartData from 'lib/chart-data.js'
// import chartStyles from 'styles/chart-styles.scss'
//
// class BasicChart extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.containerElement = '#basic_chart'
//     this.chartData = new ChartData(rawData);
//   }
//
//   componentDidMount() {
//     this.drawChart()
//   }
//
//   drawChart() {
//     const data = this.chartData.data
//
//     // Vars for dimensions
//     const margin = { top: 20, right: 20, bottom: 35, left: 75 }
//     const width = 800
//     const height = 400
//     const innerWidth = width - margin.left - margin.right
//     const innerHeight = height - margin.top - margin.bottom
//
//     // Clear the container
//     document.querySelector(this.containerElement).innerHTML = ''
//
//     // Create the chart SVG
//     const svg = d3.select(this.containerElement)
//       .append('svg')
//       .attr('viewBox', `0 0 ${width} ${height}`)
//       .attr('preserveAspectRatio', 'xMidYMid meet')
//       .attr('class', chartStyles.chartSvg)
//
//     // Create and append the main group
//     var g = svg.append('g')
//       .attr('transform', `translate(${margin.left}, ${margin.top})`)
//
//     // Create scales
//     var xScale = d3.scaleTime().rangeRound([0, innerWidth])
//     var yScale = d3.scaleLinear().rangeRound([innerHeight, 0])
//
//     xScale.domain(d3.extent(data, (d) => d.date))
//     yScale.domain(d3.extent(data, (d) => d.price))
//
//     // Create price line
//     var priceLine = d3.line()
//       .x(d => xScale(d.date))
//       .y(d => yScale(d.price))
//
//     // Create forward minimum line
//     var forwardMinLine = d3.line()
//       .x(d => xScale(d.date))
//       .y(d => yScale(d.forwardMinimumPrice))
//
//     // X gridlines - Draw gridlines first to put beneath axis
//     g.append('g')
//       .attr('transform', `translate(0, ${innerHeight})`)
//       .attr('class', chartStyles.grid)
//       .call(
//           d3.axisBottom(xScale)
//           .tickSize(-innerHeight)
//           .tickFormat('')
//       )
//
//     // Y gridlines
//     g.append('g')
//       .attr('class', chartStyles.grid)
//       .call(
//           d3.axisLeft(yScale)
//           .tickSize(-innerWidth)
//           .tickFormat('')
//       )
//
//     // Bottom axis - Date
//     g.append('g')
//       .attr('transform', `translate(0, ${innerHeight})`)
//       .call(d3.axisBottom(xScale))
//
//     // Left axis - Price
//     g.append('g')
//       .call(d3.axisLeft(yScale))
//       .append('text')
//       .attr('class', chartStyles.axisText)
//       .attr('transform', 'rotate(-90)')
//       .attr('y', 6)
//       .attr('dy', '0.71em')
//       .attr('text-anchor', 'end')
//       .text('Price ($)')
//
//     // Append the price line
//     g.append('path')
//       .datum(data)
//       .attr('class', `${chartStyles.pathLine} ${chartStyles.pathPrice}`)
//       .attr('d', priceLine)
//
//     // Append the forward minimum price line
//     g.append('path')
//       .datum(data)
//       .attr('class', `${chartStyles.pathLine} ${chartStyles.pathForwardMinPrice}`)
//       .attr('d', forwardMinLine)
//   }
//
//   get chart() {
//     // Vars for dimensions
//     const margin = { top: 20, right: 20, bottom: 35, left: 75 };
//     const width = 800;
//     const height = 400;
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;
//
//     // Create scales
//     var xScale = d3.scaleTime().rangeRound([0, innerWidth]);
//     var yScale = d3.scaleLinear().rangeRound([innerHeight, 0]);
//
//     xScale.domain(d3.extent(data, (d) => d.date));
//     yScale.domain(d3.extent(data, (d) => d.price));
//
//     // Create price line
//     var priceLine = d3.line()
//       .x(d => xScale(d.date))
//       .y(d => yScale(d.price));
//
//     // Create forward minimum line
//     var forwardMinLine = d3.line()
//       .x(d => xScale(d.date))
//       .y(d => yScale(d.forwardMinimumPrice));
//
//     return (
//       <svg
//           viewBox={`0 0 ${width} ${height}`}
//           preserveAspectRatio="xMidYMid meet"
//           className={chartStyles.chartSvg}
//       >
//         <g transform={`translate(${margin.left}, ${margin.top})`}>
//
//           {/* X gridlines - Draw gridlines first to put beneath axis */}
//           <g>
//
//           </g>
//
//
//           // X gridlines - Draw gridlines first to put beneath axis
//           g.append('g')
//           .attr('transform', `translate(0, ${innerHeight})`)
//           .attr('class', chartStyles.grid)
//           .call(
//           d3.axisBottom(xScale)
//           .tickSize(-innerHeight)
//           .tickFormat('')
//           )
//
//           // Y gridlines
//           g.append('g')
//           .attr('class', chartStyles.grid)
//           .call(
//           d3.axisLeft(yScale)
//           .tickSize(-innerWidth)
//           .tickFormat('')
//           )
//
//           // Bottom axis - Date
//           g.append('g')
//           .attr('transform', `translate(0, ${innerHeight})`)
//           .call(d3.axisBottom(xScale))
//
//           // Left axis - Price
//           g.append('g')
//           .call(d3.axisLeft(yScale))
//           .append('text')
//           .attr('class', chartStyles.axisText)
//           .attr('transform', 'rotate(-90)')
//           .attr('y', 6)
//           .attr('dy', '0.71em')
//           .attr('text-anchor', 'end')
//           .text('Price ($)')
//
//           // Append the price line
//           g.append('path')
//           .datum(data)
//           .attr('class', `${chartStyles.pathLine} ${chartStyles.pathPrice}`)
//           .attr('d', priceLine)
//
//           // Append the forward minimum price line
//           g.append('path')
//           .datum(data)
//           .attr('class', `${chartStyles.pathLine} ${chartStyles.pathForwardMinPrice}`)
//           .attr('d', forwardMinLine)
//
//
//
//
//
//         </g>
//       </svg>
//     );
//   }
//
//   render() {
//     return (
//       <div id="basic_chart">
//         <div className={chartStyles.chartHeader}>
//           <h2>Basic NLB</h2>
//           <div className={`${chartStyles.chartData} ${chartStyles.chartDataTop}`}>
//             <div className="date" />
//             <div>
//               Price: <span className="price" />
//               NLB: <span className="forward-minimum" />
//             </div>
//           </div>
//         </div>
//         <div className={chartStyles.description}>
//           <div className={chartStyles.quote}>&ldquo;</div>
//           <div className={chartStyles.inner}>
//             <p>
//               Bitcoin has a relatively unnoticed and &mdash; for most &mdash; unknown
//               characteristic. I call it the &ldquo;Never Look Back Price.&rdquo; The NLB price is
//               the last time bitcoin was at a particular price level. Once it reached
//               that price, it only proceeded up, it never retraced to that value
//               again.
//             </p>
//           </div>
//         </div>
//         <div className={chartStyles.chartWrapper}>
//           <table className={`${chartStyles.chartData} ${chartStyles.chartDataOverlay}`}>
//             <tbody>
//               <tr>
//                 <td>Date</td>
//                 <td className="date" />
//               </tr>
//               <tr>
//                 <td>Price</td>
//                 <td className="price" />
//               </tr>
//               <tr>
//                 <td>NLB</td>
//                 <td className="forward-minimum" />
//               </tr>
//             </tbody>
//           </table>
//           <div id="basic_chart" className={chartStyles.chart}>
//             <div className={chartStyles.chartLoading}>
//               <div>Loading&hellip;</div>
//             </div>
//           </div>
//
//           <div className={chartStyles.chart}>
//             {this.chart}
//           </div>
//         </div>
//       </div>
//     )
//   }
// }
//
// export default BasicChart