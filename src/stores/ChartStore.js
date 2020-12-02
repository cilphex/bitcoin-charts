import { observable, computed } from 'mobx';

class ChartStore {
  @observable hovering = false;
  @observable data = {};
  @observable item = {};

  @computed get hoverData() {
    return this.hovering && this.data;
  }

  @computed get hoverItem() {
    return this.hovering && this.item;
  }
}

export default ChartStore;