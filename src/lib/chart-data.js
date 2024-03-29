import { MaxDays, ChartTypes } from "lib/constants.js";
import mathTools from "lib/math-tools.js";
import moment from "moment";

// price-candles.json is in this format:
// [
//   1654387200,           // CloseTime
//   29672.77,             // OpenPrice
//   29952,                // HighPrice
//   29454.14,             // LowPrice
//   29843.18,             // ClosePrice
//   6390.75942952,        // Volume
//   189802823.4970840066  // QuoteVolume
// ]

const localHighs = [
  1307577600,
  1386115200,
  1513468800,
];

class ChartData {
  constructor(chartType, rawData) {
    this.chartType = chartType;
    this.data = rawData.candles.slice();
    this.formatData();
    this.regressionData = this.getRegressionData();
    this.standardDeviationNlb = this.getStandardDeviationNlb();
    this.standardDeviationPlc = this.getStandardDeviationPlc();

    // For debugging
    window.testData = this.data;
    window.testRegressionData = this.regressionData;
  }

  // Fill in missing days in the data. Copies previous day to fill gaps.
  fillMissingData() {
    const newData = [
      this.data[0],
    ];
    for (let i = 1; i < this.data.length; i++) {
      let previousItem = this.data[i - 1];
      let currentItem = this.data[i];
      let previousDay = moment(previousItem[0] * 1000);
      let currentDay = moment(currentItem[0] * 1000);
      const diff = currentDay.diff(previousDay, "days");

      if (diff > 1) {
        // missing diff-1 days
        for (let j = diff - 1; j > 0; j--) {
          newData.push(previousItem);
        }
      }
      newData.push(currentItem);
    }
    this.data = newData;
  }

  parseData() {
    // 4 is closes, 3 is lows
    const priceIndex = this.chartType == ChartTypes.closes ? 4 : 3;
    this.data.forEach((item, index) => this.data[index] = {
      date: new Date(item[0] * 1000),
      price: item[priceIndex],
      localHigh: localHighs.includes(item[0]),
    });
  }

  expandData() {
    this.data.forEach((item, index) => {
      item.index = index;
    });
  }

  addNLBData() {
    this.data.forEach(item => {
      const forwardData = this.data.slice(item.index);
      let min = item.price;
      forwardData.forEach(forwardItem => {
        if (forwardItem.price < min) {
          min = forwardItem.price;
        }
      });
      item.sqrtDaysPassed = Math.sqrt(item.index);
      item.forwardMinimumPrice = min;
      item.log10Price = Math.log10(item.price);
      item.log10forwardMinimumPrice = Math.log10(item.forwardMinimumPrice);
    });
  }

  addWMAData() {
    const weeks = 200;
    const days_per_week = 7;
    const wma_days = weeks * days_per_week;
    const values_to_average = [];
    this.data.forEach(item => {
      values_to_average.push(item.price);

      if (values_to_average.length > wma_days) {
        values_to_average.shift();
      }

      const average = mathTools.average(values_to_average);

      if (values_to_average.length < wma_days) {
        item.wma200week_prelim = average;
      }
      else {
        item.wma200week = average;
      }

      item.log10wma = Math.log10(item.wma200week || item.wma200week_prelim);
    });
  }

  setupRegressionFunctions() {
    // This is just a basic regression example for the actual price
    // plotted on linear axes
    this.regressionPriceFn = mathTools.linearRegression(
      this.data.map(i => i.index),
      this.data.map(i => i.price),
    );

    this.regressionNlbFn = mathTools.linearRegression(
      this.data.map(i => i.sqrtDaysPassed),
      this.data.map(i => i.log10forwardMinimumPrice),
    );

    // TODO: if this works, make Math.log10(i.price) a field
    this.regressionPlcFn = mathTools.linearRegression(
      this.data.map(i => i.sqrtDaysPassed),
      this.data.map(i => i.log10Price),
    );

    const plcTopData = this.data.filter(i => i.localHigh);

    this.regressionPlcTopFn = mathTools.linearRegression(
      plcTopData.map(i => i.sqrtDaysPassed),
      plcTopData.map(i => i.log10Price),
    );

    this.regressionWmaFn = mathTools.linearRegression(
      this.data.map(i => i.sqrtDaysPassed),
      this.data.map(i => i.log10wma),
    );
  }

  addRegressionFields() {
    this.data.forEach(item => {
      item.regressionPrice = this.regressionPriceFn(item.index);

      // Necessary on regular data for calculating standard deviations
      item.regressionNlb = this.regressionNlbFn(item.sqrtDaysPassed);
      item.regressionPlc = this.regressionPlcFn(item.sqrtDaysPassed);
      item.regressionWma = this.regressionWmaFn(item.sqrtDaysPassed);
    });
  }

  formatData() {
    this.fillMissingData();
    this.parseData();
    this.expandData();
    this.addNLBData();
    this.addWMAData();
    this.setupRegressionFunctions();
    this.addRegressionFields();
  }

  /* This is separate from the regular "data" in that it has more rows,
   * extrapolated on into the future. Some rows include original "data"
   * (non-extrapolated) fields, because it's easier in some cases to use
   * regressionData by itself for both, rather than regressionData + data.
   */
  getRegressionData() {
    return Array(MaxDays).fill(null).map((val, i) => {
      const index = i;
      const date = moment(this.data[0].date).add(i, "days").toDate();
      const price = this.data[i] && this.data[i].price;
      const forwardMinimumPrice = this.data[i] && this.data[i].forwardMinimumPrice;
      const sqrtDaysPassed = Math.sqrt(i);
      const regressionNlb = this.regressionNlbFn(sqrtDaysPassed);
      const regressionPlc = this.regressionPlcFn(sqrtDaysPassed);
      const regressionPlcTop = this.regressionPlcTopFn(sqrtDaysPassed);
      const regressionWma = this.regressionWmaFn(sqrtDaysPassed);

      return {
        index,
        date,
        price,
        forwardMinimumPrice,
        sqrtDaysPassed,
        regressionNlb,
        regressionPlc,
        regressionPlcTop,
        regressionWma,
      };
    });
  }

  getStandardDeviationNlb() {
    const vals1 = this.data.map(item => item.log10forwardMinimumPrice);
    const vals2 = this.data.map(item => item.regressionNlb);

    return mathTools.standardDeviation(vals1, vals2);
  }

  getStandardDeviationPlc() {
    const vals1 = this.data.map(item => item.log10Price);
    const vals2 = this.data.map(item => item.regressionPlc);

    return mathTools.standardDeviation(vals1, vals2);
  }
}

export default ChartData;
