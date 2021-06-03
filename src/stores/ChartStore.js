import {makeObservable, observable, computed, runInAction} from 'mobx';

class ChartStore {
  @observable hovering = false;
  @observable data = {};
  @observable item = {};

  constructor() {
    makeObservable(this);
  }

  @computed get hoverData() {
    return this.hovering && this.data;
  }

  @computed get hoverItem() {
    return this.hovering && this.item;
  }

  setHovering = (value) => {
    runInAction(() => this.hovering = value);
  }

  setData = (data) => {
    runInAction(() => this.data = data);
  }

  assignData = (data) => {
    runInAction(() => Object.assign(this.data, data));
  }

  setItem = (item) => {
    runInAction(() => this.item = item);
  }
}

export default ChartStore;