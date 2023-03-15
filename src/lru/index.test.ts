import { memoizeWithLimit } from ".";

function dateToMonth(date) {
  const d = new Date(date);
  return d.getMonth();
}

const dateToMonthArrow = (date) => {
  const d = new Date(date);
  return d.getMonth();
};

const days = ["2023-01-01"];
const date = new Date(days[0]);
for (let i = 0; i < 1000; i++) {
  date.setDate(date.getDate() + 1);
  days.push(date.toISOString().slice(0, 10));
}

test("returns correct cached value with one parameter", () => {
  const cached = memoizeWithLimit(dateToMonth, 2000);
  const cachedArrow = memoizeWithLimit(dateToMonthArrow, 2000);
  for (let i = 0; i < 1000; i++) {
    cached(days[i]);
    cachedArrow(days[i]);
  }

  for (let i = 0; i < 1000; i++) {
    expect(cached(days[i])).toBe(dateToMonth(days[i]));
    expect(cachedArrow(days[i])).toBe(dateToMonth(days[i]));
  }
});

test("returns correct cached value with one optional parameter", () => {
  function a(number?: number) {
    return number || 42;
  }
  const cached = memoizeWithLimit(a, 2000);
  const cachedArrow = memoizeWithLimit(a, 2000);

  expect(cached(36)).toBe(36);
  expect(cached(36)).toBe(36);
  expect(cachedArrow(36)).toBe(36);
  expect(cachedArrow(36)).toBe(36);
  expect(cached()).toBe(42);
  expect(cached()).toBe(42);
  expect(cachedArrow()).toBe(42);
  expect(cachedArrow()).toBe(42);
  expect(cached(3)).toBe(3);
  expect(cached(3)).toBe(3);
  expect(cached(36)).toBe(36);
  expect(cachedArrow(36)).toBe(36);
});

test("returns correct cached value with one default parameter", () => {
  function a(number: number = 42) {
    return number;
  }
  const cached = memoizeWithLimit(a, 2000);
  const cachedArrow = memoizeWithLimit(a, 2000);

  expect(cached(36)).toBe(36);
  expect(cached(36)).toBe(36);
  expect(cachedArrow(36)).toBe(36);
  expect(cachedArrow(36)).toBe(36);
  expect(cached()).toBe(42);
  expect(cached()).toBe(42);
  expect(cachedArrow()).toBe(42);
  expect(cachedArrow()).toBe(42);
  expect(cached(3)).toBe(3);
  expect(cached(3)).toBe(3);
  expect(cached(36)).toBe(36);
  expect(cachedArrow(36)).toBe(36);
});

test("returns correct cached value with one optional parameter amongst other parameters", () => {
  function a(x: number, y: number, z?: number) {
    return x + y + (z || 42);
  }
  const cached = memoizeWithLimit(a, 2000);
  const cachedArrow = memoizeWithLimit(a, 2000);

  expect(cached(1, 2, 3)).toBe(6);
  expect(cached(1, 2, 3)).toBe(6);
  expect(cachedArrow(1, 2, 3)).toBe(6);
  expect(cachedArrow(1, 2, 3)).toBe(6);
  expect(cached(1, 2)).toBe(45);
  expect(cached(1, 2)).toBe(45);
  expect(cachedArrow(1, 2)).toBe(45);
  expect(cachedArrow(1, 2)).toBe(45);
  expect(cached(1, 2, 4)).toBe(7);
  expect(cached(1, 2, 4)).toBe(7);
  expect(cachedArrow(1, 2, 4)).toBe(7);
  expect(cachedArrow(1, 2, 4)).toBe(7);
  expect(cached(1, 2)).toBe(45);
  expect(cachedArrow(1, 2)).toBe(45);
  expect(cached(2, 2)).toBe(46);
  expect(cached(2, 2)).toBe(46);
  expect(cachedArrow(2, 2)).toBe(46);
  expect(cachedArrow(2, 2)).toBe(46);
  expect(cached(1, 2, 3)).toBe(6);
  expect(cachedArrow(1, 2, 3)).toBe(6);
});

test("returns correct cached value with one default parameter amongst other parameters", () => {
  function a(x: number, y: number, z: number = 42) {
    return x + y + z;
  }
  const cached = memoizeWithLimit(a, 2000);
  const cachedArrow = memoizeWithLimit(a, 2000);

  expect(cached(1, 2, 3)).toBe(6);
  expect(cached(1, 2, 3)).toBe(6);
  expect(cachedArrow(1, 2, 3)).toBe(6);
  expect(cachedArrow(1, 2, 3)).toBe(6);
  expect(cached(1, 2)).toBe(45);
  expect(cached(1, 2)).toBe(45);
  expect(cachedArrow(1, 2)).toBe(45);
  expect(cachedArrow(1, 2)).toBe(45);
  expect(cached(1, 2, 4)).toBe(7);
  expect(cached(1, 2, 4)).toBe(7);
  expect(cachedArrow(1, 2, 4)).toBe(7);
  expect(cachedArrow(1, 2, 4)).toBe(7);
  expect(cached(1, 2)).toBe(45);
  expect(cachedArrow(1, 2)).toBe(45);
  expect(cached(2, 2)).toBe(46);
  expect(cached(2, 2)).toBe(46);
  expect(cachedArrow(2, 2)).toBe(46);
  expect(cachedArrow(2, 2)).toBe(46);
  expect(cached(1, 2, 3)).toBe(6);
  expect(cachedArrow(1, 2, 3)).toBe(6);
});

test("returns correct cached value with one parameter if cache is too small", () => {
  const cached = memoizeWithLimit(dateToMonth, 800);
  const cachedArrow = memoizeWithLimit(dateToMonthArrow, 800);
  for (let i = 0; i < 1000; i++) {
    cached(days[i]);
    cachedArrow(days[i]);
  }

  for (let i = 0; i < 1000; i++) {
    expect(cached(days[i])).toBe(dateToMonth(days[i]));
    expect(cachedArrow(days[i])).toBe(dateToMonth(days[i]));
  }
});

function getRandomIndizes(length: number) {
  const array: number[] = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  array.sort(() => Math.random() - 0.5);
  return array;
}

test("returns correct cached value with one parameter if cache is too small with random order", () => {
  const cached = memoizeWithLimit(dateToMonth, 800);
  const cachedArrow = memoizeWithLimit(dateToMonthArrow, 800);
  const randomIndizes = getRandomIndizes(1000);
  for (let i = 0; i < 1000; i++) {
    cached(days[randomIndizes[i]]);
    cachedArrow(days[randomIndizes[i]]);
  }

  for (let i = 0; i < 1000; i++) {
    expect(cached(days[i])).toBe(dateToMonth(days[i]));
    expect(cachedArrow(days[i])).toBe(dateToMonth(days[i]));
  }
});

test("returns correct cached value with two parameters", () => {
  function calculate(a, b) {
    return 3 * (a + b);
  }
  const calculateArrow = (a, b) => {
    return 3 * (a + b);
  };

  const cached = memoizeWithLimit(calculate, 20000);
  const cachedArrow = memoizeWithLimit(calculateArrow, 20000);
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      cached(a, b);
      cachedArrow(a, b);
    }
  }

  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      expect(cached(a, b)).toBe(calculate(a, b));
      expect(cachedArrow(a, b)).toBe(calculate(a, b));
    }
  }
});

test("returns correct cached value with multiple non primitive parameters", () => {
  function add({ a, b, c }) {
    return a + b + c;
  }

  const addArrow = ({ a, b, c }) => {
    return a + b + c;
  };

  const cached = memoizeWithLimit(add, 20000);
  const cachedArrow = memoizeWithLimit(addArrow, 20000);
  for (let a = 0; a < 20; a++) {
    for (let b = 0; b < 20; b++) {
      for (let c = 0; c < 20; c++) {
        cached({ a, b, c });
        cachedArrow({ a, b, c });
      }
    }
  }

  for (let a = 0; a < 20; a++) {
    for (let b = 0; b < 20; b++) {
      for (let c = 0; c < 20; c++) {
        expect(cached({ a, b, c })).toBe(add({ a, b, c }));
        expect(cachedArrow({ a, b, c })).toBe(add({ a, b, c }));
      }
    }
  }
});

test("returns correct cached value with three parameters", () => {
  function calculate(a, b, c) {
    return 3 * a * b * c;
  }
  const calculateArrow = (a, b, c) => {
    return 3 * a * b * c;
  };

  const cached = memoizeWithLimit(calculate, 64000);
  const cachedArrow = memoizeWithLimit(calculateArrow, 64000);
  for (let a = 0; a < 40; a++) {
    for (let b = 0; b < 40; b++) {
      for (let c = 0; c < 40; c++) {
        cached(a, b, c);
        cachedArrow(a, b, c);
      }
    }
  }

  for (let a = 0; a < 40; a++) {
    for (let b = 0; b < 40; b++) {
      for (let c = 0; c < 40; c++) {
        expect(cached(a, b, c)).toBe(calculate(a, b, c));
        expect(cachedArrow(a, b, c)).toBe(calculate(a, b, c));
      }
    }
  }
});

test("returns correct cached value with three parameters if cache is too small", () => {
  function calculate(a, b, c) {
    return 3 * a * b * c;
  }
  const calculateArrow = (a, b, c) => {
    return 3 * a * b * c;
  };

  const cached = memoizeWithLimit(calculate, 20000);
  const cachedArrow = memoizeWithLimit(calculateArrow, 20000);
  for (let a = 0; a < 40; a++) {
    for (let b = 0; b < 40; b++) {
      for (let c = 0; c < 40; c++) {
        cached(a, b, c);
        cachedArrow(a, b, c);
      }
    }
  }

  for (let a = 0; a < 40; a++) {
    for (let b = 0; b < 40; b++) {
      for (let c = 0; c < 40; c++) {
        expect(cached(a, b, c)).toBe(calculate(a, b, c));
        expect(cachedArrow(a, b, c)).toBe(calculate(a, b, c));
      }
    }
  }
});

test("does not call function when return value is cached", () => {
  const spy = jest.fn();
  const func = (i) => spy(i);
  const cached = memoizeWithLimit(func, 1000);

  for (let i = 0; i < 1000; i++) {
    cached(i);
  }
  cached(0);
  cached(1);
  cached(2);
  cached(42);
  cached(999);
  cached(1000);
  cached(4);
  cached(3);
  cached(2);
  cached(1);
  cached(0);

  expect(spy).toHaveBeenCalledTimes(1002);
  expect(spy).toHaveBeenLastCalledWith(3);
});

test("does not call function when return value is cached with one parameter and many different arguments", () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const func1 = (i) => spy1(i);
  const func2 = (i) => spy2(i);
  const cached = memoizeWithLimit(func1, 800);
  const cachedArrow = memoizeWithLimit(func2, 800);
  const randomIndizes = getRandomIndizes(1000);
  for (let i = 0; i < 1000; i++) {
    cached(randomIndizes[i]);
    cachedArrow(randomIndizes[i]);
  }

  for (let i = 200; i < 1000; i++) {
    cached(randomIndizes[i]);
    cachedArrow(randomIndizes[i]);
  }
  expect(spy1).toHaveBeenCalledTimes(1000);
  expect(spy1).toHaveBeenLastCalledWith(randomIndizes[999]);
  expect(spy2).toHaveBeenCalledTimes(1000);
  expect(spy2).toHaveBeenLastCalledWith(randomIndizes[999]);

  for (let i = 0; i < 200; i++) {
    cached(randomIndizes[i]);
    cachedArrow(randomIndizes[i]);
    expect(spy1).toHaveBeenLastCalledWith(randomIndizes[i]);
    expect(spy2).toHaveBeenLastCalledWith(randomIndizes[i]);
  }
});

test("does not call function when return value is cached with two parameters and many different arguments", () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const func1 = (a, b) => spy1(a, b);
  const func2 = (a, b) => spy2(a, b);
  const cached = memoizeWithLimit(func1, 800);
  const cachedArrow = memoizeWithLimit(func2, 800);
  const randomIndizes = getRandomIndizes(1000);
  for (let i = 0; i < 1000; i++) {
    const index = randomIndizes[i];
    cached(index, index + 1337);
    cachedArrow(index, index + 1337);
  }

  for (let i = 200; i < 1000; i++) {
    const index = randomIndizes[i];
    cached(index, index + 1337);
    cachedArrow(index, index + 1337);
  }
  expect(spy1).toHaveBeenCalledTimes(1000);
  expect(spy1).toHaveBeenLastCalledWith(
    randomIndizes[999],
    randomIndizes[999] + 1337
  );
  expect(spy2).toHaveBeenCalledTimes(1000);
  expect(spy2).toHaveBeenLastCalledWith(
    randomIndizes[999],
    randomIndizes[999] + 1337
  );

  for (let i = 0; i < 200; i++) {
    const index = randomIndizes[i];
    cached(index, index + 1337);
    cachedArrow(index, index + 1337);
    expect(spy1).toHaveBeenLastCalledWith(index, index + 1337);
    expect(spy2).toHaveBeenLastCalledWith(index, index + 1337);
  }
});

test("does not call function when return value is cached with three parameters and many different arguments", () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const func1 = (a, b, c) => spy1(a, b, c);
  const func2 = (a, b, c) => spy2(a, b, c);
  const cached = memoizeWithLimit(func1, 800);
  const cachedArrow = memoizeWithLimit(func2, 800);
  const randomIndizes = getRandomIndizes(1000);
  for (let i = 0; i < 1000; i++) {
    const index = randomIndizes[i];
    cached(index, index + 1337, index - 42);
    cachedArrow(index, index + 1337, index - 42);
  }

  for (let i = 200; i < 1000; i++) {
    const index = randomIndizes[i];
    cached(index, index + 1337, index - 42);
    cachedArrow(index, index + 1337, index - 42);
  }
  expect(spy1).toHaveBeenCalledTimes(1000);
  expect(spy1).toHaveBeenLastCalledWith(
    randomIndizes[999],
    randomIndizes[999] + 1337,
    randomIndizes[999] - 42
  );
  expect(spy2).toHaveBeenCalledTimes(1000);
  expect(spy2).toHaveBeenLastCalledWith(
    randomIndizes[999],
    randomIndizes[999] + 1337,
    randomIndizes[999] - 42
  );

  for (let i = 0; i < 200; i++) {
    const index = randomIndizes[i];
    cached(index, index + 1337, index - 42);
    cachedArrow(index, index + 1337, index - 42);
    expect(spy1).toHaveBeenLastCalledWith(index, index + 1337, index - 42);
    expect(spy2).toHaveBeenLastCalledWith(index, index + 1337, index - 42);
  }
});

test("returns correct value after deleting entry and calling function again", () => {
  const func = (i) => i;
  const cached = memoizeWithLimit(func, 1000);

  for (let i = 0; i < 1000; i++) {
    cached(i);
  }
  cached(0);
  cached(1);
  cached(2);
  cached(42);
  cached(999);
  cached(1000);
  cached(4);
  cached(3);
  cached(2);
  cached(1);
  cached(0);

  for (let i = 0; i < 1000; i++) {
    if (i !== 5) {
      expect(cached(i)).toEqual(i);
    }
  }
});

test("returns correct value after deleting entry and calling function again with two parameters", () => {
  const func = (a, b) => a + b;
  const cached = memoizeWithLimit(func, 1000);

  for (let i = 0; i < 1000; i++) {
    cached(i, i + 1);
  }
  cached(0, 1);
  cached(1, 2);
  cached(2, 3);
  cached(42, 43);
  cached(999, 1000);
  cached(1000, 1001);
  cached(4, 5);
  cached(3, 4);
  cached(2, 3);
  cached(1, 2);
  cached(0, 1);

  for (let i = 0; i < 1000; i++) {
    if (i !== 5) {
      expect(cached(i, i + 1)).toEqual(2 * i + 1);
    }
  }
});

test("removes least recently used element from cache if not used", () => {
  const spy = jest.fn();
  const func = (i) => spy(i);
  const cached = memoizeWithLimit(func, 1000);

  cached(42);
  for (let i = 0; i < 1000; i++) {
    if (i !== 42) {
      cached(i);
    }
  }

  cached(1000);
  for (let i = 1; i <= 999; i++) {
    cached(i);
  }

  expect(spy).toHaveBeenCalledTimes(1002);
  expect(spy).toHaveBeenLastCalledWith(42);
});

test("removes least recently used element from cache if not used", () => {
  const spy = jest.fn();
  const func = (i) => spy(i);
  const cached = memoizeWithLimit(func, 1000);

  for (let i = 0; i < 1000; i++) {
    cached(i);
  }

  cached(1000);
  for (let i = 0; i < 1000; i++) {
    cached(i);
    expect(spy).toHaveBeenLastCalledWith(i);
  }

  expect(spy).toHaveBeenCalledTimes(2001);
});

test("throws error if provided argument is not a function", () => {
  expect(() => memoizeWithLimit({ func: dateToMonth } as any, 42)).toThrowError(
    "Can only memoize functions"
  );
});

test("throws error if max size is not provided", () => {
  expect(() => (memoizeWithLimit as any)(dateToMonth)).toThrowError(
    "Need max size parameter to initialize memoization with limit"
  );
});

test("throws error if function contains rest parameter", () => {
  function withRestParam1(...args) {
    return args;
  }
  function withRestParam2(a, ...args) {
    return args;
  }
  const withRestParam3 = (...args) => {
    return args;
  };
  const withRestParam4 = (a, ...args) => {
    return args;
  };
  expect(() => memoizeWithLimit(withRestParam1, 42)).toThrowError(
    "Rest parameters are not supported"
  );
  expect(() => memoizeWithLimit(withRestParam2, 42)).toThrowError(
    "Rest parameters are not supported"
  );
  expect(() => memoizeWithLimit(withRestParam3, 42)).toThrowError(
    "Rest parameters are not supported"
  );
  expect(() => memoizeWithLimit(withRestParam4, 42)).toThrowError(
    "Rest parameters are not supported"
  );
});
