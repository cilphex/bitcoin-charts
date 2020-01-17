import { observable } from 'mobx';
import ChartData from 'lib/chart-data.js';

class DataStore {
  @observable chartData = null;

  constructor() {
    this.fetchData();
  }

  fetchData() {
    fetch('/data/price-data.json')
      .then(res => res.json())
      .then(this.gotData);
  }

  gotData = (rawData) => {
    this.chartData = new ChartData(rawData);
  }
}

export default DataStore;