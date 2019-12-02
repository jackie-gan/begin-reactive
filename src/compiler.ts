import Watcher from './observer/watcher';
import { isElementNode, isTextNode } from './utils/index';

interface Compiler {
  $el: any,
  vm: any

}

/*匹配{{}} */
const textRE = /\{\{(.*)\}\}/;

class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.vm = vm;

    if (this.$el) {
      this.init();
    }
  }

  init() {
    this.parseChildren(this.$el);
  }

  parseChildren(el) {
    Array.from(el.childNodes, (node: any) => {
      if (isElementNode(node)) {
        this.handleElement(node);
        if (node.childNodes && node.childNodes.length) {
          this.parseChildren(node);
        }
      } else if (isTextNode(node) && textRE.test(node.textContent)) {
        this.compileText(node);
      }
    });
  }

  handleElement(node) {

  }

  /**
   * 编译Text： {{}}， v-text
   * @param node 目标节点
   * @param exp 属性名，此属性名已经剥离了前缀如v-,@ ,: 等等
   */
  compileText(node, exp) {
    createWatcher();
  }
}

/**
 * 创建一个订阅者
 * @param node 需要修改的节点
 * @param name 订阅者回调函数名称
 * @param exp 已经观察的属性名，此属性名已经剥离了前缀如v-,@ ,: 等等
 */
function createWatcher(node, vm, name, exp) {
  const updaterFn = updater[name];

  new Watcher(vm, exp, function(newValue, oldValue) {
    updaterFn && updaterFn(node, newValue, oldValue);
  });
}

const updater = {
  text(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },

}

export default Compiler;