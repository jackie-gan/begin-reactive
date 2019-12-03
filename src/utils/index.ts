export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
}

export const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export const isElementNode = (node) => {
  return node.nodeType === 1;
}

export const isTextNode = (node) => {
  return node.nodeType === 3;
}

export function peelValue(value, peel) {
  return value.replace(peel, '');
}