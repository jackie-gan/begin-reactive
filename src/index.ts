import { defineReactive } from './observer/reactive';
import nodeToFragment from './compiler';

function Begin(options) {
  this.data = options.data;
  const el = options.el;

  for (const key in this.data) {
    defineReactive(this, key, this.data[key]);
  }

  const node = document.getElementById(el);
  if (node) {
    const dom = nodeToFragment(node, this);

    node.appendChild(dom);
  }
}

export default Begin;