import { getParameterCount } from "../memoize/utils";

function memoizeWithLimit<F extends (...args: any[]) => any>(
  func: F,
  maxSize: number
): F {
  if (typeof func !== "function") {
    throw new TypeError("Can only memoize functions");
  }
  if (typeof maxSize !== "number") {
    throw new TypeError(
      "Need max size parameter to initialize memoization with limit"
    );
  }
  let size = 0;

  const parameterCount = getParameterCount(func);
  const lastIndex = parameterCount - 1;
  const cache: Map<any, any> = new Map();
  const prev: number[] = new Array(maxSize + 2);
  const args: any[] = new Array(maxSize + 2);
  const value: any[] = new Array(maxSize + 2);
  const next: number[] = new Array(maxSize + 2);
  const head: number = maxSize + 1;
  prev[head] = 0;
  next[0] = head;
  let node: number;
  if (parameterCount === 1) {
    return function (arg: any) {
      if (cache.has(arg)) {
        node = cache.get(arg);
        next[prev[node]] = next[node];
        prev[next[node]] = prev[node];
        next[prev[head]] = node;
        prev[node] = prev[head];
        next[node] = head;
        prev[head] = node;
        return value[node];
      }
      if (size === maxSize) {
        cache.delete(args[next[0]]);
        node = next[0];
        next[0] = next[node];
        prev[next[0]] = 0;
      } else {
        size++;
        node = size;
      }
      prev[node] = prev[head];
      args[node] = arg;
      value[node] = func(arg);
      next[node] = head;
      next[prev[head]] = node;
      prev[head] = node;
      cache.set(arg, node);
      return value[node];
    } as F;
  }
  const deleteFromCache: any = getDeleteFromCache(parameterCount);
  const deleteEntry = (deleteArgs: any[]) => deleteFromCache(cache, deleteArgs);
  function getOnLeaf(cache: Map<any, any>, thisArgs: any[]) {
    const arg = thisArgs[lastIndex];
    let deleteArgs: any[] | null = null;
    if (cache.has(arg)) {
      node = cache.get(arg);
      next[prev[node]] = next[node];
      prev[next[node]] = prev[node];
      next[prev[head]] = node;
      prev[node] = prev[head];
      next[node] = head;
      prev[head] = node;
      return value[node];
    }
    if (size === maxSize) {
      deleteArgs = args[next[0]];
      node = next[0];
      next[0] = next[node];
      prev[next[0]] = 0;
    } else {
      size++;
      node = size;
    }
    prev[node] = prev[head];
    args[node] = thisArgs;
    value[node] = func(...thisArgs);
    next[node] = head;
    next[prev[head]] = node;
    prev[head] = node;
    cache.set(arg, node);
    if (deleteArgs !== null) {
      deleteEntry(deleteArgs);
    }
    return value[node];
  }
  return getget(cache, parameterCount, getOnLeaf);
}

function getget(
  cache: Map<any, any>,
  argsCount: number,
  getOnLeaf: (cache: Map<any, any>, arg: any) => any
): any {
  let get: (cache: Map<any, any>, args: any[]) => any = getOnLeaf;
  for (let i = argsCount - 2; i >= 1; i--) {
    get = getOnNode(i, get);
  }
  return function (...args: any[]) {
    const arg = args[0];
    if (!cache.has(arg)) {
      cache.set(arg, new Map());
    }
    return get(cache.get(arg), args);
  };
}

function getOnNode(
  index: number,
  nextGet: (cache: Map<any, any>, args: any[]) => any
) {
  return function (cache: Map<any, any>, args: any[]) {
    const arg = args[index];
    if (!cache.has(arg)) {
      cache.set(arg, new Map());
    }
    return nextGet(cache.get(arg), args);
  };
}

function getDeleteFromCache(
  argsCount: number
): (cache: Map<any, any>, deleteArgs: any[]) => boolean {
  const lastIndex = argsCount - 1;
  let deleteFromCache: (cache: Map<any, any>, deleteArgs: any[]) => boolean = (
    cache,
    deleteArgs
  ) => {
    cache.delete(deleteArgs[lastIndex]);
    return cache.size === 0;
  };
  for (let i = argsCount - 2; i >= 0; i--) {
    deleteFromCache = deleteFromNode(i, deleteFromCache);
  }
  return deleteFromCache;
}

function deleteFromNode(
  index: number,
  nextDelete: (cache: Map<any, any>, arg: any) => boolean
): (cache: Map<any, any>, arg: any) => boolean {
  return function (cache: Map<any, any>, deleteArgs: any[]) {
    const arg = deleteArgs[index];
    if (nextDelete(cache.get(arg), deleteArgs)) {
      cache.delete(arg);
    }
    return cache.size === 0;
  };
}

export { memoizeWithLimit };
