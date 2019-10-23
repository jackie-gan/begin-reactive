import Dep from './dep';

export default class Watcher {
  vm: any
  node: any
  name: string
  value: any

  constructor(vm, node, name) {
    Dep.target = this;
    this.vm = vm;
    this.node = node;
    this.name = name;
    this.update();
    Dep.target = null;
  }

  addDep(dep) {
    dep.addSub(this)
  }

  update() {
    this.get();
    this.node.nodeValue = this.value;
  }

  get() {
    this.value =  this.vm.data[this.name];
  }
}