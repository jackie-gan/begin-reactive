import {
  isObject,
  isPlainObject
} from '../utils';
import Dep from './dep';

class Observer {
  constructor(obj) {
    if (Array.isArray(obj)) {
      this.observeArray(obj)
    } else {
      this.walk(obj);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  observeArray(array) {
    for (let i = 0, l = array.length; i < l; i++) {
      observe(array[i]);
    }
  }
}

export function observe(obj) {
  if (!obj || !isObject(obj)) return;
  
  if (Array.isArray(obj) || isPlainObject(obj)) {
    return new Observer(obj);
  }
}

export function defineReactive(obj, key, val) {
  const property = Object.getOwnPropertyDescriptor(obj, key);

  // 当属性不可配置时，返回
  if (property && property.configurable === false) return;

  // 订阅者容器对象
  const dep = new Dep();

  const getter = property && property.get;
  const setter = property && property.set; 

  // 若value是对象，则进行观察
  let childObj = observe(val);
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (newVal === value) return;

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childObj = observe(newVal);
      dep.notify();
    }
  });
}
