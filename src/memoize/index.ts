import { getParameterCount } from "./utils";

function memoize(func: (...args: any[]) => any) {
  if (typeof func !== "function") {
    throw new TypeError("Can only memoize functions");
  }
  const parameterCount = getParameterCount(func);
  const cache: Map<any, any> = new Map();
  let uncached: any;
  if (parameterCount === 1) {
    return function (arg: any) {
      if (cache.has(arg)) {
        return cache.get(arg);
      }
      uncached = func(arg);
      cache.set(arg, uncached);
      return uncached;
    };
  }
  return getOrCreate(cache, parameterCount, func);
}

function getOrCreate(
  cache: Map<any, any>,
  argsCount: number,
  func: (...args: any[]) => any
) {
  const lastIndex = argsCount - 1;
  let get: (cache: Map<any, any>, args: any[]) => any = (cache, args) =>
    getOrCreateOnLeaf(cache, args, args[lastIndex], func);
  for (let i = argsCount - 2; i >= 1; i--) {
    get = getOrCreateOnNode(i, get);
  }
  return function (...args: any[]) {
    const arg = args[0];
    if (!cache.has(arg)) {
      cache.set(arg, new Map());
    }
    return get(cache.get(arg), args);
  };
}

function getOrCreateOnLeaf(
  cache: Map<any, any>,
  args: any[],
  arg: any,
  func: (...args: any[]) => any
) {
  if (cache.has(arg)) {
    return cache.get(arg);
  }
  const uncached = func(...args);
  cache.set(arg, uncached);
  return uncached;
}

function getOrCreateOnNode(
  index: number,
  nextCreate: (cache: Map<any, any>, args: any[]) => any
) {
  return function (cache: Map<any, any>, args: any[]) {
    const arg = args[index];
    if (!cache.has(arg)) {
      cache.set(arg, new Map());
    }
    return nextCreate(cache.get(arg), args);
  };
}

export default memoize;
