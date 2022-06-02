import { makeObservable, observable, computed, runInAction } from "mobx";
import moment from "moment";

class EstimatesStore {
  @observable today;
  @observable years;
  @observable magnitudes;

  chartData = null;

  constructor(chartData) {
    makeObservable(this);
    this.chartData = chartData;
    this.processData();
  }

  @computed get ready() {
    return !!(this.today && this.years && this.magnitudes);
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
    const { regressionData, standardDeviationPlc } = this.chartData;

    const todayData = regressionData.find(i =>
      moment(i.date).isSame(moment(), "day"),
    );

    const { regressionPlc, regressionPlcTop } = todayData;
    const expected = Math.round(Math.pow(10, regressionPlc));
    const min = Math.round(Math.pow(10, regressionPlc - standardDeviationPlc));
    const max = Math.round(Math.pow(10, regressionPlcTop));

    const today = {
      expected,
      min,
      max,
    };

    // this.today = today;

    runInAction(() => this.today = today);
  };

  processYears = async() => {
    await new Promise(resolve => setTimeout(resolve, 0));
    const { regressionData } = this.chartData;

    const years = Array(5).fill(null)
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

    const magnitudes = Array(5).fill(null)
      .map((val, i) => Math.pow(10, i+3)) // 10,000 to 100,000,000
      .map(price =>
        regressionData.find(dataItem =>
          Math.pow(10, dataItem.regressionPlc) > price,
        ),
      );

    // this.magnitudes = magnitudes;

    runInAction(() => this.magnitudes = magnitudes);
  };
}

export default EstimatesStore;
