import Constants from './constants.js'
import mathTools from './math-tools.js'
import moment from 'moment'

class ChartData {
  constructor(rawData) {
    this.data = rawData.slice()
    this.formatData()
    this.regressionData = this.getRegressionData()
    this.standardDeviationNlb = this.getStandardDeviationNlb()
    this.standardDeviationPlc = this.getStandardDeviationPlc()

    // For debugging
    window.testData = this.data
  }

  reverseData() {
    this.data.reverse()
  }

  parseData() {
    this.data.forEach((item, index) => this.data[index] = {
      date: new Date(item.date),
      price: parseFloat(item.price.replace(/,/g, '')),
      localHigh: !!item.localHigh
    })
  }

  expandData() {
    this.data.forEach((item, index) => {
      item.index = index
    })
  }

  addNLBData() {
    this.data.forEach(item => {
      const forwardData = this.data.slice(item.index)
      let min = item.price
      forwardData.forEach(forwardItem => {
        if (forwardItem.price < min) {
          min = forwardItem.price
        }
      })
      item.sqrtDaysPassed = Math.sqrt(item.index)
      item.forwardMinimumPrice = min
      item.log10Price = Math.log10(item.price)
      item.log10forwardMinimumPrice = Math.log10(item.forwardMinimumPrice)
    })
  }

  addWMAData() {
    const weeks = 200;
    const days_per_week = 7;
    const wma_days = weeks * days_per_week;
    const values_to_average = [];
    this.data.forEach(item => {
      values_to_average.push(item.price)

      if (values_to_average.length > wma_days) {
        values_to_average.shift()
      }

      const average = mathTools.average(values_to_average)

      if (values_to_average.length < wma_days) {
        item.wma200week_prelim = average
      }
      else {
        item.wma200week = average
      }
    })
  }

  setupRegressionFunctions() {
    // This is just a basic regression example for the actual price
    // plotted on linear axes
    this.regressionPriceFn = mathTools.linearRegression(
      this.data.map(i => i.index),
      this.data.map(i => i.price)
    )

    this.regressionNlbFn = mathTools.linearRegression(
      this.data.map(i => i.sqrtDaysPassed),
      this.data.map(i => i.log10forwardMinimumPrice)
    )

    // TODO: if this works, make Math.log10(i.price) a field
    this.regressionPlcFn = mathTools.linearRegression(
      this.data.map(i => i.sqrtDaysPassed),
      this.data.map(i => i.log10Price)
    )

    const plcTopData = this.data.filter(i => i.localHigh)

    this.regressionPlcTopFn = mathTools.linearRegression(
      plcTopData.map(i => i.sqrtDaysPassed),
      plcTopData.map(i => i.log10Price)
    )
  }

  addRegressionFields() {
    this.data.forEach(item => {
      item.regressionPrice = this.regressionPriceFn(item.index)

      // Necessary on regular data for calculating standard deviations
      item.regressionNlb = this.regressionNlbFn(item.sqrtDaysPassed)
      item.regressionPlc = this.regressionPlcFn(item.sqrtDaysPassed)
    })
  }

  formatData() {
    this.reverseData()
    this.parseData()
    this.expandData()
    this.addNLBData()
    this.addWMAData()
    this.setupRegressionFunctions()
    this.addRegressionFields()
  }

  /* This is separate from the regular "data" in that it has more rows,
   * extrapolated on into the future. Some rows include original "data"
   * (non-extrapolated) fields, because it's easier in some cases to use
   * regressionData by itself for both, rather than regressionData + data.
   */
  getRegressionData() {
    const { maxDays } = Constants.regressionData

    return Array(maxDays).fill(null).map((val, i) => {
      const index = i
      const date = moment(this.data[0].date).add(i, 'days').toDate()
      const price = this.data[i] && this.data[i].price
      const forwardMinimumPrice = this.data[i] && this.data[i].forwardMinimumPrice
      const sqrtDaysPassed = Math.sqrt(i)
      const regressionNlb = this.regressionNlbFn(sqrtDaysPassed)
      const regressionPlc = this.regressionPlcFn(sqrtDaysPassed)
      const regressionPlcTop = this.regressionPlcTopFn(sqrtDaysPassed)

      return {
        index,
        date,
        price,
        forwardMinimumPrice,
        sqrtDaysPassed,
        regressionNlb,
        regressionPlc,
        regressionPlcTop
      }
    })
  }

  getStandardDeviationNlb() {
    const vals1 = this.data.map(item => item.log10forwardMinimumPrice)
    const vals2 = this.data.map(item => item.regressionNlb)

    return mathTools.standardDeviation(vals1, vals2)
  }

  getStandardDeviationPlc() {
    const vals1 = this.data.map(item => item.log10Price)
    const vals2 = this.data.map(item => item.regressionPlc)

    return mathTools.standardDeviation(vals1, vals2)
  }
}

export default ChartData
