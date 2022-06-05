import { makeObservable, observable, runInAction } from "mobx";
import ChartData from "lib/chart-data.js";

class DataStore {
  @observable chartData = null;

  constructor() {
    makeObservable(this);
    this.fetchData();
  }

  async fetchData() {
    const res = await fetch("/data/price-candles.json?");
    const data = await res.json();
    runInAction(() => this.chartData = new ChartData(data));
  }
}

export default DataStore;
