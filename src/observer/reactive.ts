function reactive(obj, property, val) {
  Object.defineProperty(obj, property, {
    configurable: true,
    enumerable: true,
    get() {
      console.log('val is get');
      return val;
    },
    set(newVal) {
      console.log('val is set');
      val = newVal;
    }
  });
}

export default reactive;