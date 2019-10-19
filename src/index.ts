import { defineReactive } from './observer/reactive';

function Begin(options) {
  const obj = options.obj;

  for (const key in obj) {
    defineReactive(obj, key, obj[key]);
  }
}

export default Begin;