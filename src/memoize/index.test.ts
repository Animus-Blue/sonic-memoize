import memoize from "./index";

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

test("returns correct cached value with one argument", () => {
  const cached = memoize(dateToMonth);
  const cachedArrow = memoize(dateToMonthArrow);
  for (let i = 0; i < 1000; i++) {
    cached(days[i]);
    cachedArrow(days[i]);
  }

  for (let i = 0; i < 1000; i++) {
    expect(cached(days[i])).toBe(dateToMonth(days[i]));
    expect(cachedArrow(days[i])).toBe(dateToMonth(days[i]));
  }
});

test("returns correct cached value with one non primitive argument", () => {
  function facultyMod100({ value }) {
    let result = 1;
    for (let i = 1; i <= value % 100; i++) {
      result *= i;
    }
    return result;
  }

  const facultyMod100Arrow = ({ value }) => {
    let result = 1;
    for (let i = 1; i <= value % 100; i++) {
      result *= i;
    }
    return result;
  };
  const cached = memoize(facultyMod100);
  const cachedArrow = memoize(facultyMod100Arrow);
  for (let i = 0; i < 1000; i++) {
    cached({ value: i });
    cachedArrow({ value: i });
  }

  for (let i = 0; i < 1000; i++) {
    expect(cached({ value: i })).toBe(facultyMod100({ value: i }));
    expect(cachedArrow({ value: i })).toBe(facultyMod100({ value: i }));
  }
});

test("returns correct cached value with two arguments", () => {
  function calculate(a, b) {
    return 3 * (a + b);
  }
  const calculateArrow = (a, b) => {
    return 3 * (a + b);
  };

  const cached = memoize(calculate);
  const cachedArrow = memoize(calculateArrow);
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

test("returns correct cached value with multiple non primitive arguments", () => {
  function add({ a, b, c }) {
    return a + b + c;
  }

  const addArrow = ({ a, b, c }) => {
    return a + b + c;
  };

  const cached = memoize(add);
  const cachedArrow = memoize(addArrow);
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

test("returns correct cached value with three arguments", () => {
  function calculate(a, b, c) {
    return 3 * a * b * c;
  }
  const calculateArrow = (a, b, c) => {
    return 3 * a * b * c;
  };

  const cached = memoize(calculate);
  const cachedArrow = memoize(calculateArrow);
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

test("works with promises", async () => {
  let answer = "answer: ";
  const func = (text) =>
    new Promise((res) => setTimeout(() => res(answer + text), 20));
  const memoized = memoize(func);

  const p1Memoized = await memoized("foo");
  const p1NotMemoized = await func("foo");
  expect(p1Memoized).toEqual("answer: foo");
  expect(p1NotMemoized).toEqual("answer: foo");
  answer = "new answer: ";
  const p1MemoizedV2 = await memoized("foo");
  const p1NotMemoizedV2 = await func("foo");
  expect(p1MemoizedV2).toEqual("answer: foo");
  expect(p1NotMemoizedV2).toEqual("new answer: foo");
});

test("throws error if provided argument is not a function", () => {
  expect(() => memoize({ func: dateToMonth } as any)).toThrowError(
    "Can only memoize functions"
  );
});
