import { makeObservable, observable } from 'mobx';
import ChartData from 'lib/chart-data.js';

class DataStore {
  @observable chartData = null;

  constructor() {
    makeObservable(this);
    this.fetchData();
  }

  async fetchData() {
    const res = await fetch('/data/price-data.json')
    const data = await res.json();
    this.chartData = new ChartData(data);
  }
}

export default DataStore;