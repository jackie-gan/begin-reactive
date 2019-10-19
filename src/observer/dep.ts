interface Dep {
  subs: Array<any>
}
/**
 * 收集watcher
 */
class Dep {
  static target

  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    const subs = this.subs;
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

export default Dep;