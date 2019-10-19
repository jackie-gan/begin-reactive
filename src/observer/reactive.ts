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

function observe(obj) {
  if (!isObject(obj)) return
  
  if (Array.isArray(obj) || isPlainObject(obj)) {
    new Observer(obj);
  }
}

export function defineReactive(obj, key, val) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) return;

  const getter = property && property.get;
  const setter = property && property.set; 

  observe(val);
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
      if (newVal === value) return

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal;
      }
    }
  });
}
