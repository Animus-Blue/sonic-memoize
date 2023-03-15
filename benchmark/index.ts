import { Bench } from "tinybench";
import sonic from "../src/memoize";
import { memoizeWithLimit } from "../src/lru";
import nano from "nano-memoize";
import microraw from "micro-memoize";
import fast from "fast-memoize";
import moizeraw from "moize";
import memoizee from "memoizee";
import mem from "mem";
import lodash from "lodash.memoize";
import memoizerificraw from "memoizerific";

const numberOfDifferentValues = 1000;

const memoizerific = memoizerificraw(numberOfDifferentValues);
const micro = (func) => microraw(func, { maxSize: numberOfDifferentValues });
const moize = (func) => moizeraw(func, { maxSize: numberOfDifferentValues });
const soniclru = (func) => memoizeWithLimit(func, numberOfDifferentValues);
const memoizeelru = (func) => memoizee(func, { max: numberOfDifferentValues });

function memoizeStringParameter(
  numberOfDifferentValues: number
): (func: (...args: any[]) => any) => (...args: any[]) => any {
  function dateToWeekDay(date) {
    const d = new Date(date);
    return d.getDay();
  }

  const days: string[] = [];
  const date = new Date("2023-01-01");
  for (let i = 0; i < numberOfDifferentValues; i++) {
    date.setDate(date.getDate() + 1);
    days.push(date.toISOString().slice(0, 10));
  }

  return function (func: (...args: any[]) => any): (...args: any[]) => any {
    const memoized = func(dateToWeekDay);
    return () => {
      for (let i = 0; i < days.length; i++) {
        memoized(days[i]);
      }
    };
  };
}

function memoizeNumberParameter(
  numberOfDifferentValues: number
): (func: (...args: any[]) => any) => (...args: any[]) => any {
  function fakultyOfMod100(n: number) {
    let m = n % 100;
    if (m === 0) {
      return 1;
    }
    return m * fakultyOfMod100(m - 1);
  }

  return function (func: (...args: any[]) => any): (...args: any[]) => any {
    const memoized = func(fakultyOfMod100);
    return () => {
      for (let i = 0; i < numberOfDifferentValues; i++) {
        memoized(i);
      }
    };
  };
}

function memoizeMultiplePrimitiveParameters(
  numberOfDifferentValues: number
): (func: (...args: any[]) => any) => (...args: any[]) => any {
  function dateToWeekDay(year, month, day) {
    const d = new Date(Date.UTC(year, month, day));
    return d.getDay();
  }

  const days: [number, number, number][] = [];
  const date = new Date(Date.UTC(2023, 0, 1));
  for (let i = 0; i < numberOfDifferentValues; i++) {
    date.setDate(date.getDate() + 1);
    days.push([date.getFullYear(), date.getMonth(), date.getDate()]);
  }

  return function (func: (...args: any[]) => any): (...args: any[]) => any {
    const memoized = func(dateToWeekDay);
    return () => {
      for (let i = 0; i < days.length; i++) {
        memoized(...days[i]);
      }
    };
  };
}

function memoizeNonPrimitiveParameter(
  numberOfDifferentValues: number
): (func: (...args: any[]) => any) => (...args: any[]) => any {
  function dateToWeekDay({ date }) {
    const d = new Date(date);
    return d.getDay();
  }

  const days: { date: string }[] = [];
  const date = new Date("2023-01-01");
  for (let i = 0; i < numberOfDifferentValues; i++) {
    date.setDate(date.getDate() + 1);
    days.push({ date: date.toISOString().slice(0, 10) });
  }

  return function (func: (...args: any[]) => any): (...args: any[]) => any {
    const memoized = func(dateToWeekDay);
    return () => {
      for (let i = 0; i < days.length; i++) {
        memoized(days[i]);
      }
    };
  };
}

function memoizeMultipleNonPrimitiveParameters(
  numberOfDifferentValues: number
): (func: (...args: any[]) => any) => (...args: any[]) => any {
  function dateToWeekDay({ year }, { month }, { day }) {
    const d = new Date(Date.UTC(year, month, day));
    return d.getDay();
  }

  const days: [{ year: number }, { month: number }, { day: number }][] = [];
  const date = new Date(Date.UTC(2023, 0, 1));
  for (let i = 0; i < numberOfDifferentValues; i++) {
    date.setDate(date.getDate() + 1);
    days.push([
      { year: date.getFullYear() },
      { month: date.getMonth() },
      { day: date.getDate() },
    ]);
  }

  return function (func: (...args: any[]) => any): (...args: any[]) => any {
    const memoized = func(dateToWeekDay);
    return () => {
      for (let i = 0; i < days.length; i++) {
        memoized(...days[i]);
      }
    };
  };
}

async function runBenchmark(
  name: string,
  memoize: (func: (...args: any) => any) => (...args: any) => any,
  multipleArguments: boolean = false
) {
  const bench = new Bench();
  if (multipleArguments) {
    bench
      .add("sonic-memoize", memoize(sonic))
      .add("nano-memoize", memoize(nano))
      .add("fast-memoize", memoize(fast))
      .add("memoizee", memoize(memoizee));
  } else {
    bench
      .add("sonic-memoize", memoize(sonic))
      .add("lodash.memoize", memoize(lodash))
      .add("nano-memoize", memoize(nano))
      .add("fast-memoize", memoize(fast))
      .add("memoizee", memoize(memoizee))
      .add("mem", memoize(mem));
  }
  await bench.run();
  console.log(`Results for function with ${name}:`);
  const tasks = [...bench.tasks];
  tasks.sort((a, b) => a.result!.mean - b.result!.mean);
  console.table(
    tasks.map(({ name, result }) => ({
      "Task Name": name,
      "Average Time (ps)": (result!.mean * 1000).toFixed(1),
      "Variance (ps)": (result!.variance * 1000).toFixed(1),
    }))
  );
  console.log("\n");
}

async function runLRUBenchmark(
  name: string,
  memoize: (func: (...args: any) => any) => (...args: any) => any,
  multipleArguments: boolean = false
) {
  const bench = new Bench();
  if (multipleArguments) {
    bench
      .add("sonic-memoize (lru)", memoize(soniclru))
      .add("memoizee (lru)", memoize(memoizeelru))
      .add("moize", memoize(moize))
      .add("memoizerific", memoize(memoizerific))
      .add("micro-memoize", memoize(micro));
  } else {
    bench
      .add("sonic-memoize (lru)", memoize(soniclru))
      .add("memoizee (lru)", memoize(memoizeelru))
      .add("moize", memoize(moize))
      .add("memoizerific", memoize(memoizerific))
      .add("micro-memoize", memoize(micro));
  }
  await bench.run();
  console.log(`Results for function with ${name}:`);
  const tasks = [...bench.tasks];
  tasks.sort((a, b) => a.result!.mean - b.result!.mean);
  console.table(
    tasks.map(({ name, result }) => ({
      "Task Name": name,
      "Average Time (ps)": (result!.mean * 1000).toFixed(1),
      "Variance (ps)": (result!.variance * 1000).toFixed(1),
    }))
  );
  console.log("\n");
}

async function runBenchmarks() {
  console.log(
    "\n",
    "Benchmarking memoization with one function parameter without Cache size limit:",
    "\n"
  );
  await runBenchmark(
    "single parameter of type number",
    memoizeNumberParameter(numberOfDifferentValues)
  );
  await runBenchmark(
    "single parameter of type string",
    memoizeStringParameter(numberOfDifferentValues)
  );
  await runBenchmark(
    "single non primitive parameter",
    memoizeNonPrimitiveParameter(numberOfDifferentValues)
  );
  console.log(
    "\n",
    "Benchmarking memoization with multiple function parameters without Cache size limit:",
    "\n"
  );
  await runBenchmark(
    "multiple primitive parameters",
    memoizeMultiplePrimitiveParameters(numberOfDifferentValues),
    true
  );
  await runBenchmark(
    "multiple non primitive parameters",
    memoizeMultipleNonPrimitiveParameters(numberOfDifferentValues),
    true
  );
  console.log(
    "\n",
    "Benchmarking memoization with one function parameter with LRU Cache size limit:",
    "\n"
  );
  await runLRUBenchmark(
    "single parameter of type number",
    memoizeNumberParameter(numberOfDifferentValues)
  );
  await runLRUBenchmark(
    "single parameter of type string",
    memoizeStringParameter(numberOfDifferentValues)
  );
  await runLRUBenchmark(
    "single non primitive parameter",
    memoizeNonPrimitiveParameter(numberOfDifferentValues)
  );
  console.log(
    "\n",
    "Benchmarking memoization with multiple function parameters with LRU Cache size limit:",
    "\n"
  );
  await runLRUBenchmark(
    "multiple primitive parameters",
    memoizeMultiplePrimitiveParameters(numberOfDifferentValues),
    true
  );
  await runLRUBenchmark(
    "multiple non primitive parameters",
    memoizeMultipleNonPrimitiveParameters(numberOfDifferentValues),
    true
  );
}

runBenchmarks();
