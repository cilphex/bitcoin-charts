import { makeObservable, observable, computed, runInAction } from "mobx";
import moment from "moment";

class EstimatesStore {
  @observable chartType;
  @observable today;
  @observable years;
  @observable magnitudes;

  chartData = null;

  constructor(chartData, chartType) {
    makeObservable(this);
    this.chartData = chartData;
    this.chartType = chartType;

    if (this.chartTypeIsValid) {
      this.processData();
    }
  }

  @computed get chartTypeIsValid() {
    const validChartTypes = ["nlb", "plc", "wma"];
    return validChartTypes.indexOf(this.chartType) >= 0;
  }

  @computed get ready() {
    return !!(this.today && this.years && this.magnitudes);
  }

  @computed get regressionVariables() {
    if (this._regressionVariables) {
      return this._regressionVariables;
    }

    let regressionType, standardDeviationType;

    switch (this.chartType) {
      case "nlb":
        regressionType = "regressionNlb";
        standardDeviationType = "standardDeviationNlb";
        break;
      case "plc":
        regressionType = "regressionPlc";
        standardDeviationType = "standardDeviationPlc";
        break;
      case "wma":
        regressionType = "regressionWma";
        break;
    }

    return this._regressionVariables = {
      regressionType,
      standardDeviationType,
    };
  }

  // An async function needs to 'await' something to yield, so just await a
  // setTimeout
  processData = async() => {
    await this.processToday();
    await this.processYears();
    await this.processMagnitudes();
  };

  processToday = async() => {
    await new Promise(resolve => setTimeout(resolve, 0));
    const { regressionData } = this.chartData;
    const { regressionType, standardDeviationType } = this.regressionVariables;

    const todayData = regressionData.find(i =>
      moment(i.date).isSame(moment(), "day"),
    );

    const regression = todayData[regressionType];
    const expected = Math.round(Math.pow(10, regression));
    let min, max;

    if (standardDeviationType) {
      const standardDeviation = this.chartData[standardDeviationType];
      min = Math.round(Math.pow(10, regression - standardDeviation));
      max = Math.round(Math.pow(10, regression + standardDeviation));
    }

    const today = {
      expected,
      min,
      max,
    };

    runInAction(() => this.today = today);
  };

  processYears = async() => {
    await new Promise(resolve => setTimeout(resolve, 0));
    const { regressionData } = this.chartData;

    const years = Array(5)
      .fill(null)
      .map((item, i) => moment().year() + i)
      .map(year =>
        regressionData.find(dataItem =>
          moment(dataItem.date).isSame(moment(`${year}-01-01`), "day"),
        ),
      );

    runInAction(() => this.years = years);
  };

  processMagnitudes = async() => {
    await new Promise(resolve => setTimeout(resolve, 0));
    const { regressionData } = this.chartData;
    const { regressionType, standardDeviationType } = this.regressionVariables;
    const standardDeviation = this.chartData[standardDeviationType] || 0;

    const magnitudes = Array(5)
      .fill(null)
      .map((val, i) => Math.pow(10, i+3)) // 10,000 to 100,000,000
      .map(price =>
        regressionData.find(dataItem =>
          Math.pow(10, dataItem[regressionType] - standardDeviation) > price,
        ),
      );

    runInAction(() => this.magnitudes = magnitudes);
  };
}

export default EstimatesStore;
