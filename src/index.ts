import reactive from './observer/reactive';

function Begin(options) {
  const obj = options.obj;

  for (const key in obj) {
    reactive(obj, key, obj[key]);
  }
}

export default Begin;