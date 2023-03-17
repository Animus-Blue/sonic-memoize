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

const memoizerificlru = memoizerificraw(numberOfDifferentValues);
const microlru = (func) => microraw(func, { maxSize: numberOfDifferentValues });
const moizelru = (func) => moizeraw(func, { maxSize: numberOfDifferentValues });
const soniclru = (func) => memoizeWithLimit(func, numberOfDifferentValues);
const memoizeelru = (func) => memoizee(func, { max: numberOfDifferentValues });

async function runSingleNumberBenchmark(lru: boolean = false) {
  function fakultyOfMod100(n: number) {
    let m = n % 100;
    if (m === 0) {
      return 1;
    }
    return m * fakultyOfMod100(m - 1);
  }

  const bench = new Bench();
  if (lru) {
    const memoizedSonic = soniclru(fakultyOfMod100);
    const memoizee = memoizeelru(fakultyOfMod100);
    const memoizerific = memoizerificlru(fakultyOfMod100);
    const moize = moizelru(fakultyOfMod100);
    const micro = microlru(fakultyOfMod100);

    bench
      .add("sonic-memoize (lru)", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedSonic(i);
        }
      })
      .add("memoizee (lru)", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizee(i);
        }
      })
      .add("memoizerific", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizerific(i);
        }
      })
      .add("moize", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          moize(i);
        }
      })
      .add("micro-memoize", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          micro(i);
        }
      });
  } else {
    const memoizedSonic = sonic(fakultyOfMod100);
    const memoizedNano = nano(fakultyOfMod100);
    const memoizedFast = fast(fakultyOfMod100);
    const memoizedMemoizee = memoizee(fakultyOfMod100);
    const memoizedLodash = lodash(fakultyOfMod100);
    const memoizedMem = mem(fakultyOfMod100);

    bench
      .add("lodash.memoize", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedLodash(i);
        }
      })
      .add("nano-memoize", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedNano(i);
        }
      })
      .add("fast-memoize", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedFast(i);
        }
      })
      .add("sonic-memoize", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedSonic(i);
        }
      })
      .add("memoizee", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedMemoizee(i);
        }
      })
      .add("mem", () => {
        for (let i = 0; i < numberOfDifferentValues; i++) {
          memoizedMem(i);
        }
      });
  }

  await bench.run();
  console.log(`Results for function with single parameter of type number:`);
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

async function runSingleStringBenchmark(lru: boolean = false) {
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

  const bench = new Bench();
  if (lru) {
    const memoizedSonic = soniclru(dateToWeekDay);
    const memoizee = memoizeelru(dateToWeekDay);
    const memoizerific = memoizerificlru(dateToWeekDay);
    const moize = moizelru(dateToWeekDay);
    const micro = microlru(dateToWeekDay);

    bench
      .add("sonic-memoize (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(days[i]);
        }
      })
      .add("memoizee (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizee(days[i]);
        }
      })
      .add("memoizerific", () => {
        for (let i = 0; i < days.length; i++) {
          memoizerific(days[i]);
        }
      })
      .add("moize", () => {
        for (let i = 0; i < days.length; i++) {
          moize(days[i]);
        }
      })
      .add("micro-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          micro(days[i]);
        }
      });
  } else {
    const memoizedSonic = sonic(dateToWeekDay);
    const memoizedNano = nano(dateToWeekDay);
    const memoizedFast = fast(dateToWeekDay);
    const memoizedMemoizee = memoizee(dateToWeekDay);
    const memoizedLodash = lodash(dateToWeekDay);
    const memoizedMem = mem(dateToWeekDay);

    bench
      .add("lodash.memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedLodash(days[i]);
        }
      })
      .add("nano-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedNano(days[i]);
        }
      })
      .add("fast-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedFast(days[i]);
        }
      })
      .add("sonic-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(days[i]);
        }
      })
      .add("memoizee", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedMemoizee(days[i]);
        }
      })
      .add("mem", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedMem(days[i]);
        }
      });
  }
  await bench.run();
  console.log(`Results for function with single parameter of type string:`);
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

async function runSingleNonPrimitiveBenchmark(lru: boolean = false) {
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

  const bench = new Bench();
  if (lru) {
    const memoizedSonic = soniclru(dateToWeekDay);
    const memoizee = memoizeelru(dateToWeekDay);
    const memoizerific = memoizerificlru(dateToWeekDay);
    const moize = moizelru(dateToWeekDay);
    const micro = microlru(dateToWeekDay);

    bench
      .add("sonic-memoize (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(days[i]);
        }
      })
      .add("memoizee (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizee(days[i]);
        }
      })
      .add("memoizerific", () => {
        for (let i = 0; i < days.length; i++) {
          memoizerific(days[i]);
        }
      })
      .add("moize", () => {
        for (let i = 0; i < days.length; i++) {
          moize(days[i]);
        }
      })
      .add("micro-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          micro(days[i]);
        }
      });
  } else {
    const memoizedSonic = sonic(dateToWeekDay);
    const memoizedNano = nano(dateToWeekDay);
    const memoizedFast = fast(dateToWeekDay);
    const memoizedMemoizee = memoizee(dateToWeekDay);
    const memoizedLodash = lodash(dateToWeekDay);
    const memoizedMem = mem(dateToWeekDay);

    bench
      .add("lodash.memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedLodash(days[i]);
        }
      })
      .add("nano-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedNano(days[i]);
        }
      })
      .add("fast-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedFast(days[i]);
        }
      })
      .add("sonic-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(days[i]);
        }
      })
      .add("memoizee", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedMemoizee(days[i]);
        }
      })
      .add("mem", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedMem(days[i]);
        }
      });
  }
  await bench.run();
  console.log(`Results for function with single non primitive parameter:`);
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

async function runMultiplePrimitiveBenchmark(lru: boolean = false) {
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

  const bench = new Bench();
  if (lru) {
    const memoizedSonic = soniclru(dateToWeekDay);
    const memoizee = memoizeelru(dateToWeekDay);
    const memoizerific = memoizerificlru(dateToWeekDay);
    const moize = moizelru(dateToWeekDay);
    const micro = microlru(dateToWeekDay);

    bench
      .add("sonic-memoize (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(...days[i]);
        }
      })
      .add("memoizee (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizee(...days[i]);
        }
      })
      .add("memoizerific", () => {
        for (let i = 0; i < days.length; i++) {
          memoizerific(...days[i]);
        }
      })
      .add("moize", () => {
        for (let i = 0; i < days.length; i++) {
          moize(...days[i]);
        }
      })
      .add("micro-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          micro(...days[i]);
        }
      });
  } else {
    const memoizedSonic = sonic(dateToWeekDay);
    const memoizedNano = nano(dateToWeekDay);
    const memoizedFast = fast(dateToWeekDay);
    const memoizedMemoizee = memoizee(dateToWeekDay);

    bench
      .add("nano-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedNano(...days[i]);
        }
      })
      .add("fast-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedFast(...days[i]);
        }
      })
      .add("sonic-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(...days[i]);
        }
      })
      .add("memoizee", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedMemoizee(...days[i]);
        }
      });
  }
  await bench.run();
  console.log(`Results for function with multiple primitive parameters:`);
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

async function runMultipleNonPrimitiveBenchmark(lru: boolean = false) {
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

  const bench = new Bench();
  if (lru) {
    const memoizedSonic = soniclru(dateToWeekDay);
    const memoizee = memoizeelru(dateToWeekDay);
    const memoizerific = memoizerificlru(dateToWeekDay);
    const moize = moizelru(dateToWeekDay);
    const micro = microlru(dateToWeekDay);

    bench
      .add("sonic-memoize (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(...days[i]);
        }
      })
      .add("memoizee (lru)", () => {
        for (let i = 0; i < days.length; i++) {
          memoizee(...days[i]);
        }
      })
      .add("memoizerific", () => {
        for (let i = 0; i < days.length; i++) {
          memoizerific(...days[i]);
        }
      })
      .add("moize", () => {
        for (let i = 0; i < days.length; i++) {
          moize(...days[i]);
        }
      })
      .add("micro-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          micro(...days[i]);
        }
      });
  } else {
    const memoizedSonic = sonic(dateToWeekDay);
    const memoizedNano = nano(dateToWeekDay);
    const memoizedFast = fast(dateToWeekDay);
    const memoizedMemoizee = memoizee(dateToWeekDay);

    bench
      .add("nano-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedNano(...days[i]);
        }
      })
      .add("fast-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedFast(...days[i]);
        }
      })
      .add("sonic-memoize", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedSonic(...days[i]);
        }
      })
      .add("memoizee", () => {
        for (let i = 0; i < days.length; i++) {
          memoizedMemoizee(...days[i]);
        }
      });
  }
  await bench.run();
  console.log(`Results for function with multiple non primitive parameters:`);
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
  await runSingleStringBenchmark();
  await runSingleNumberBenchmark();
  await runSingleNonPrimitiveBenchmark();
  console.log(
    "\n",
    "Benchmarking memoization with multiple function parameters without Cache size limit:",
    "\n"
  );
  await runMultiplePrimitiveBenchmark();
  await runMultipleNonPrimitiveBenchmark();
  console.log(
    "\n",
    "Benchmarking memoization with one function parameter with LRU Cache size limit:",
    "\n"
  );
  await runSingleStringBenchmark(true);
  await runSingleNumberBenchmark(true);
  await runSingleNonPrimitiveBenchmark(true);
  console.log(
    "\n",
    "Benchmarking memoization with multiple function parameters with LRU Cache size limit:",
    "\n"
  );
  await runMultiplePrimitiveBenchmark(true);
  await runMultipleNonPrimitiveBenchmark(true);
}

runBenchmarks();
