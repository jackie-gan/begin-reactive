export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
}

export const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
}