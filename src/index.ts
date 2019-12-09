import Compiler from './compiler';
import { isPlainObject } from './utils';
import { observe } from './observer/reactive';
import Watcher from './observer/watcher';
import Dep from './observer/dep';

const noop = function() {};

function Begin(options) {
  this._init(options);
}

Begin.prototype._init = function(options) {
  this.$options = options;
  const data = this.$options.data;
  this._data = typeof data === 'function' ? this.getData(data, this) : data || {};
  this._computed = this.$options.computed;
  this._watch = this.$options.watch;
  this._initData();
  this._initComputed();

  observe(this._data);

  this._initWatch();

  new Compiler(this.$options.el, this);
};

Begin.prototype._initData = function() {
  Object.keys(this._data).forEach((key) => {
    proxy(this, '_data', key);
  });
}

Begin.prototype._initComputed = function() {
  const watchers = this._computedWatchers = Object.create(null);

  const computed = this._computed;

  if (computed && isPlainObject(computed)) {
    Object.keys(computed).forEach((key) => {
      const userDef = computed[key];
      const getter = typeof userDef === 'function' ? userDef : userDef.get;

      watchers[key] = new Watcher(this, getter || noop, function() {
        console.log('computed update here');
      }, { lazy: true });

      if (!(key in this)) {
        let proxyGetter;
        let proxySetter;
        if (typeof userDef === 'function') {
          proxyGetter = createComputedGetter(this, key);
          proxySetter = noop;
        } else {
          proxyGetter = userDef.get ? (userDef.cache !== false ? createComputedGetter(this, key) : userDef.get) : noop;
          proxySetter = userDef.set ? userDef.set : noop;
        }

        proxy(this, '_computed', key, proxyGetter, proxySetter);
      }
    });
  }
}

Begin.prototype._initWatch = function() {
  const watch = this._watch;

  if (watch && isPlainObject(watch)) {
    Object.keys(watch).forEach((key) => {
      if (this._data[key]) {
        const cb = watch[key];

        new Watcher(this, key, cb);
      }
    });
  }
}

Begin.prototype.getData = function(data, vm) {
  try {
    return data.call(vm);
  } catch (e) {
    return {};
  }
};

const sharedPropertyDefinition = {
  configurable: true,
  enumerable: true,
  get: noop,
  set: noop
};

/**
 * 将数据挂载到vm上，使其可以通过this直接访问
 */
function proxy(vm, initialKey, newKey, getter?, setter?) {
  sharedPropertyDefinition.get = getter || function proxyGetter() {
    return vm[initialKey][newKey];
  };
  sharedPropertyDefinition.set = setter || function proxySetter(val) {
    vm[initialKey][newKey] = val;
  }

  Object.defineProperty(vm, newKey, sharedPropertyDefinition);
}

function createComputedGetter(vm, key) {
  return function computedGetter() {
    const watcher = vm._computedWatchers && vm._computedWatchers[key];

    if (watcher) {
      console.log('watch', watcher.dirty);
      if (watcher.dirty) {
        watcher.evaluate();
      }

      return watcher.value;
    }
  }
}

export default Begin;