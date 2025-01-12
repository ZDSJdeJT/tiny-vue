import { Dep } from "./deps.js";

const targetMap = new WeakMap();

const getDep = (target, key) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
};

const reactiveHandlers = {
  get(target, key, receiver) {
    const dep = getDep(target, key);
    dep.depend();
    return Reflect.get(target, key, receiver);
  },

  set(target, key, value, receiver) {
    const dep = getDep(target, key);
    const result = Reflect.set(target, key, value, receiver);
    dep.notify();
    return result;
  },
};

export const reactive = (raw) => {
  return new Proxy(raw, reactiveHandlers);
};
