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
If you need to set a max size on the cache that is being used by sonic-memoize, see the section on [setting a size limit on the cache](#setting-a-size-limit-on-the-cache)

## Benchmarks

We implemented benchmarking with realistic test cases that should give you a good impression on how well the memoization will perform in real life situations.

### Benchmarking memoization with one function parameter without Cache size limit:

Results for function with single parameter of type number:

| Task Name      | Average Time (ps) |
| -------------- | ----------------- |
| sonic-memoize  | 4.8               |
| fast-memoize   | 10.8              |
| nano-memoize   | 11.5              |
| mem            | 13.2              |
| lodash.memoize | 22.2              |
| memoizee       | 422.0             |

Results for function with single parameter of type string:

| Task Name      | Average Time (ps) |
| -------------- | ----------------- |
| sonic-memoize  | 13.1              |
| mem            | 18.0              |
| lodash.memoize | 50.9              |
| nano-memoize   | 54.1              |
| fast-memoize   | 311.2             |
| memoizee       | 458.7             |

Results for function with single non primitive parameter:

| Task Name      | Average Time (ps) |
| -------------- | ----------------- |
| sonic-memoize  | 5.1               |
| mem            | 13.0              |
| lodash.memoize | 33.0              |
| nano-memoize   | 49.2              |
| memoizee       | 208.8             |
| fast-memoize   | 408.9             |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly. That makes for a realistic scenario.<br>
[benchmarking code](./benchmark/index.ts)

### Benchmarking memoization with multiple function parameters without Cache size limit:

Results for function with multiple primitive parameters:

| Task Name     | Average Time (ps) |
| ------------- | ----------------- |
| sonic-memoize | 45.4              |
| memoizee      | 99.4              |
| fast-memoize  | 509.8             |
| nano-memoize  | 1645.0            |

Results for function with multiple non primitive parameters:

| Task Name     | Average Time (ps) |
| ------------- | ----------------- |
| sonic-memoize | 52.3              |
| memoizee      | 260.6             |
| fast-memoize  | 833.6             |
| nano-memoize  | 3208.2            |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly. That makes for a realistic scenario.
We excluded memoization libraries that cannot memoize functions with multiple arguments at all or without further configuration.<br>
[benchmarking code](./benchmark/index.ts)

## Setting a size limit on the cache

You can use sonic-memoize with the option of limiting the internal cache size to a specific number of cached results. sonic-memoize will use an LRU caching strategy, which means that the least recently used function call will be deleted from the cache if the max size is reached.
Note that limiting the size of the cache comes at a (small) performance cost and is probably unnecessary if you dont have tough memory usage restrictions or call your memoized functions with many millions of different arguments.

```js
import { memoizeWithLimit } from "sonic-memoize";

const memoized = memoizeWithLimit(function (arg1, arg2, arg3) {
  // expensive computation here
}, 50000); // The second argument (50000 in this case) specifies the cache size limit

// After 50000 calls with different arguments sonic-memoize will start
// deleting the least recently used function call from cache

memoized(3, 4, 5); // First call with these arguments is expensive
memoized(3, 4, 5); // Cache hit, the value was returned instantly
```

## Benchmarks on LRU memoization

See below benchmarks with different memoization libraries that use LRU caching strategies.

### Benchmarking memoization with one function parameter with LRU Cache size limit:

Results for function with single parameter of type number:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 19.4              |
| memoizee (lru)      | 727.6             |
| memoizerific        | 1280.2            |
| moize               | 3349.8            |
| micro-memoize       | 7803.8            |

Results for function with single parameter of type string:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 36.4              |
| memoizerific        | 1499.8            |
| memoizee (lru)      | 1805.9            |
| moize               | 13177.2           |
| micro-memoize       | 13198.3           |

Results for function with single non primitive parameter:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 25.1              |
| memoizee (lru)      | 531.3             |
| memoizerific        | 1439.2            |
| micro-memoize       | 9233.5            |
| moize               | 9257.8            |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly, while the size limits of the caches were set to 1000 as well. That makes for a realistic scenario in which the cache size is big enough to handle most function calls.<br>
[benchmarking code](./benchmark/index.ts)

### Benchmarking memoization with multiple function parameters with LRU Cache size limit:

Results for function with multiple primitive parameters:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 54.0              |
| memoizee (lru)      | 445.0             |
| memoizerific        | 1196.6            |
| moize               | 6449.3            |
| micro-memoize       | 11386.6           |

Results for function with multiple non primitive parameters:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 62.6              |
| memoizee (lru)      | 593.2             |
| memoizerific        | 1232.2            |
| micro-memoize       | 9629.9            |
| moize               | 10163.9           |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly, while the size limits of the caches were set to 1000 as well. That makes for a realistic scenario in which the cache size is big enough to handle most function calls.<br>
[benchmarking code](./benchmark/index.ts)

## License

[MIT](./LICENSE)
