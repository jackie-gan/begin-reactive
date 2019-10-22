import Watcher from './observer/watcher';

function compile(node, vm) {
  const reg = /\{\{(.*)\}\}/;

  if (node.nodeType === 3) {
    if (reg.test(node.nodeValue)) {
      console.log(111);
      const name = node.nodeValue.match(reg)[1].trim();

      new Watcher(vm, node, name);
    }
  }
}

export default function nodeToFragment(node, vm) {
  const fragment = document.createDocumentFragment();

  let child;
  while (child = node.firstChild) {
    compile(child, vm);
    fragment.appendChild(child);
  }

  return fragment;
}