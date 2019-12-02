import Dep from './dep';

export default class Watcher {
  vm: any
  value: any
  cb: Function
  getter: Function
  depIds: Set<number>

  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.cb = cb;
    this.depIds = new Set();
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = this.parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function() {};
      }
    }
    this.value = this.get();
  }

  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      dep.addSub(this);
      this.depIds.add(id);
    }
  }

  update() {
    const oldValue = this.value;
    const newValue = this.get();
    if (oldValue === newValue) return;

    this.value = newValue;

    this.cb.call(this.vm, newValue, oldValue);
  }

  get() {
    Dep.target = this;
    const value = this.getter.call(this.vm, this.vm);
    Dep.target = null;
    return value;
  }

  parsePath(exp): any {
    // 不是合法字符返回
    if (/[^\w.$]/.test(exp)) {
      return;
    }

    const segments = exp.split('.')
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }
}