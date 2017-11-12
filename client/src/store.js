import { observable, computed } from 'mobx';
import qs from 'qs';

export default class Store {
  @observable query = { q: '' };
  @observable search = '';
  @observable results = [];
  @observable sortBy = 'id';
  @observable sortDir = false; // false <-> descending
  @observable requesting = false;

  @computed get queryString() {
    return qs.stringify(this.query);
  }

  set queryString(str) {
    this.query = qs.parse(str);
  }
}

Store.prototype.progress = function (req = true) {
  this.requesting = req;
};
