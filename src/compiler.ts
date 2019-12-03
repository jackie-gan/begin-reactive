import Watcher from './observer/watcher';
import { isElementNode, isTextNode, isPlainObject, peelValue } from './utils/index';

interface Compiler {
  $el: any,
  $vm: any
}

/*匹配{{}} */
const textRE = /\{\{(.*)\}\}/;
/*匹配v-、@以及:*/
const dirRE = /^v-|^@|^:/;
/*匹配v-bind以及:*/
const bindRE = /^:|^v-bind:/;
/*匹配@以及v-on，绑定事件 */
const onRE = /^@|^v-on:/;
/*匹配v- */
const normalDirRE = /^v-/;

class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;

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
        this.compileText(node, node.textContent.match(textRE)[1]);
      }
    });
  }

  handleElement(node) {
    const cloneNode = node.cloneNode(true);

    Array.from(cloneNode.attributes, (attr: any) => {
      const value = attr.value;
      const attrName = attr.name;

      if (dirRE.test(attrName)) {
        if (bindRE.test(attrName)) {
          createWatcher(node, this.$vm, peelValue(attrName, attrName.match(bindRE)[0]), value);
        } else if (onRE.test(attrName)) {
          bindEvent(node, this.$vm, peelValue(attrName, attrName.match(onRE)[0]), value);
        } else if (normalDirRE.test(attrName)) {
          this.handleDirective(node, peelValue(attrName, attrName.match(normalDirRE)[0]), value);
        }
        node.removeAttirbute(attrName);
      }
    })
  }

  /**
   * 编译Text： {{}}， v-text
   * @param node 目标节点
   * @param exp 属性名，此属性名已经剥离了前缀如v-,@ ,: 等等
   */
  compileText(node, exp) {
    createWatcher(node, this.$vm, 'text', exp);
  }

  /**
   * 处理普通的vue 内置v-model指令
   * @param node 需要修改的节点
   * @param exp 已经观察的属性名，此属性名已经剥离了前缀如v-,@ ,: 等等
   */
  compileModel(node, exp) {
    createWatcher(node, this.$vm, 'model', exp);

    let oldValue = getProxyValue(this.$vm, exp);

    node.addEventListener('input', (ev) => {
      const newValue = ev.target.value;

      if (newValue === oldValue) return;

      setProxyVal(this.$vm, exp, newValue);

      oldValue = newValue;
    }, false)
  }
  
  /**
   * 处理普通的vue 内置指令，并分别处理，如：v-text, v-model
   * @param node 需要修改的节点
   * @param type 类型
   * @param exp 属性名，此属性名已经剥离了前缀如v-,@ ,: 等等
   */
  handleDirective(node, type, exp) {
    if (type === 'text') {
      this.compileText(node, exp);
    } else if (type === 'model') {
      this.compileModel(node, exp);
    }
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

  updaterFn && updaterFn(node, getProxyValue(vm, exp));

  new Watcher(vm, exp, function(newValue, oldValue) {
    updaterFn && updaterFn(node, newValue, oldValue);
  });
}

/**
 * 获取 $vm上代理的值
 * @param obj 当前vue对象
 * @param exp 属性名
 */
function getProxyValue(obj, exp) {
  exp = exp.split('.');
  exp.forEach((key) => {
    obj = obj[key];
  });
  return obj;
}

/**
 * 设置 $vm上代理的值
 * @param obj 当前vue对象
 * @param exp 属性名 
 * @param newValue 新值
 */
function setProxyVal(obj, exp, newValue) {
  exp = exp.split('.');
  exp.forEach((key, index) => {
    if (index < exp.length - 1) {
      obj = obj[key];
    } else {
      obj[key] = newValue;
    }
  })
}

/**
 * 绑定事件
 * @param node 
 * @param vm 
 * @param ev 
 * @param exp 
 */
function bindEvent(node, vm, ev, exp) {
  const fn = vm.$options.methods && vm.$options.methids[exp];

  if (fn) {
    node.addEventListener(ev, fn.bind(vm), false);
  }
}

const updater = {
  text(node, newValue) {
    node.textContent = typeof newValue === 'undefined' ? '' : newValue;
  },
  class(node, newValue, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, '');
    node.className = `${className ? className.trim() + ' ' : ''}${newValue}`;
  },
  style(node, newValue, oldValue) {
    const style = node.style;
    if (isPlainObject(oldValue)) {
      Object.keys(oldValue).forEach((key) => {
        style[key] = '';
      });
    }
    if (isPlainObject(newValue)) {
      Object.keys(newValue).forEach((key) => {
        node.style[key] = newValue[key];
      });
    }
  },
  model(node, newValue) {
    node.value = typeof newValue === 'undefined' ? '' : newValue;
  }
}

export default Compiler;