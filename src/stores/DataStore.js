import { makeObservable, observable, runInAction } from "mobx";
import { ChartTypes } from "lib/constants";
import ChartData from "lib/chart-data.js";

class DataStore {
  data = null;
  @observable chartType = ChartTypes.closes;
  @observable chartData = null;

  constructor() {
    makeObservable(this);
    this.fetchData();
  }

  async fetchData() {
    const res = await fetch("/data/price-candles.json?");
    this.data = await res.json();
    runInAction(() =>
      this.chartData = new ChartData(this.chartType, this.data)
    );
  }

  changeChartType = () => {
    runInAction(() => {
      switch (this.chartType) {
        case ChartTypes.closes: this.chartType = ChartTypes.lows; break;
        case ChartTypes.lows: this.chartType = ChartTypes.closes; break;
      }
      this.chartData = new ChartData(this.chartType, this.data)
    })
  }
}

export default DataStore;
