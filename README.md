# sonic-memoize

Ultra fast, zero config memoization of functions.

```bash
npm install sonic-memoize
```

## Usage

```js
import memoize from "sonic-memoize";

const memoized = memoize(function (arg1, arg2, arg3) {
  // expensive computation here
});

memoized(3, 4, 5); // First call with these arguments is expensive
memoized(3, 4, 5); // Cache hit, the value was returned instantly
```

sonic-memoize is zero config and will memoize your function calls out of the box without limitation on how many calls with different arguments will be cached.

## Single Parameter Benchmark

Benchmark results for memoization with single parameter of type number:

| (index) | Task Name      | Average Time (ps) | Variance (ps) |
| ------- | -------------- | ----------------- | ------------- |
| 0       | sonic-memoize  | 4.5               | 0.0           |
| 1       | fast-memoize   | 10.4              | 0.0           |
| 2       | nano-memoize   | 10.8              | 0.0           |
| 3       | mem            | 11.6              | 0.0           |
| 4       | lodash.memoize | 22.4              | 0.1           |
| 5       | memoizee       | 390.7             | 2.0           |
| 6       | memoizerific   | 1137.9            | 194.5         |
| 7       | moize          | 3336.7            | 71.8          |
| 8       | micro-memoize  | 7312.8            | 93.4          |

Benchmark results for memoization with single parameter of type string:

| (index) | Task Name      | Average Time (ps) | Variance (ps) |
| ------- | -------------- | ----------------- | ------------- |
| 0       | sonic-memoize  | 13.0              | 0.0           |
| 1       | mem            | 17.7              | 0.0           |
| 2       | lodash.memoize | 48.4              | 0.1           |
| 3       | nano-memoize   | 51.2              | 0.2           |
| 4       | fast-memoize   | 284.1             | 0.9           |
| 5       | memoizee       | 425.0             | 1.3           |
| 6       | memoizerific   | 1342.3            | 300.0         |
| 7       | micro-memoize  | 10238.0           | 132.4         |
| 8       | moize          | 10848.8           | 166.2         |

Benchmark results for memoization with single non primitive parameter:

| (index) | Task Name      | Average Time (ps) | Variance (ps) |
| ------- | -------------- | ----------------- | ------------- |
| 0       | sonic-memoize  | 4.8               | 0.0           |
| 1       | mem            | 12.5              | 0.0           |
| 2       | lodash.memoize | 29.3              | 0.0           |
| 3       | nano-memoize   | 46.9              | 0.0           |
| 4       | memoizee       | 200.5             | 0.3           |
| 5       | fast-memoize   | 378.4             | 0.9           |
| 6       | memoizerific   | 1087.3            | 170.1         |
| 7       | micro-memoize  | 8900.9            | 105.6         |
| 8       | moize          | 8932.9            | 102.5         |

The benchmarks are being run on sample sets of data where each memoized function is being called 1000 times with different arguments. That makes for a realistic scenario.<br>
[benchmarking code](./benchmark/index.ts)

## Multiple Parameters Benchmark

Benchmark results for memoization with multiple primitive parameters:

| (index) | Task Name     | Average Time (ps) | Variance (ps) |
| ------- | ------------- | ----------------- | ------------- |
| 0       | sonic-memoize | 47.4              | 0.1           |
| 1       | memoizee      | 85.1              | 0.3           |
| 2       | fast-memoize  | 462.0             | 1.8           |
| 3       | memoizerific  | 1137.0            | 174.1         |
| 4       | nano-memoize  | 1548.1            | 27.7          |
| 5       | moize         | 6188.2            | 75.9          |
| 6       | micro-memoize | 10784.8           | 172.8         |

Benchmark results for memoization with multiple non primitive parameters:

| (index) | Task Name     | Average Time (ps) | Variance (ps) |
| ------- | ------------- | ----------------- | ------------- |
| 0       | sonic-memoize | 56.7              | 0.1           |
| 1       | memoizee      | 245.9             | 1.4           |
| 2       | fast-memoize  | 753.3             | 2.9           |
| 3       | memoizerific  | 1050.9            | 127.7         |
| 4       | nano-memoize  | 2955.3            | 44.2          |
| 5       | micro-memoize | 9365.5            | 104.2         |
| 6       | moize         | 9828.9            | 147.8         |

The benchmarks are being run on sample sets of data where each memoized function is being called 1000 times with different sets of arguments. That makes for a realistic scenario.
We excluded memoization libraries that cannot memoize functions with multiple arguments at all or without further configuration.<br>
[benchmarking code](./benchmark/index.ts)

## License

[MIT](./LICENSE)
