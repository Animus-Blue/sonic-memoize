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

Results for function with single parameter of type string:

| Task Name      | Average Time (ps) |
| -------------- | ----------------- |
| sonic-memoize  | 8.5               |
| mem            | 11.2              |
| lodash.memoize | 22.2              |
| nano-memoize   | 43.8              |
| fast-memoize   | 279.3             |
| memoizee       | 410.5             |

Results for function with single parameter of type number:

| Task Name      | Average Time (ps) |
| -------------- | ----------------- |
| nano-memoize   | 4.4               |
| sonic-memoize  | 4.4               |
| fast-memoize   | 4.7               |
| mem            | 5.1               |
| lodash.memoize | 29.3              |
| memoizee       | 385.3             |

Results for function with single non primitive parameter:

| Task Name      | Average Time (ps) |
| -------------- | ----------------- |
| sonic-memoize  | 4.4               |
| mem            | 6.7               |
| lodash.memoize | 19.6              |
| nano-memoize   | 40.2              |
| memoizee       | 193.7             |
| fast-memoize   | 372.1             |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly. That makes for a realistic scenario.<br>
[benchmarking code](./benchmark/index.ts)

### Benchmarking memoization with multiple function parameters without Cache size limit:

Results for function with multiple primitive parameters:

| Task Name     | Average Time (ps) |
| ------------- | ----------------- |
| sonic-memoize | 41.0              |
| memoizee      | 84.5              |
| fast-memoize  | 464.5             |
| nano-memoize  | 1550.5            |

Results for function with multiple non primitive parameters:

| Task Name     | Average Time (ps) |
| ------------- | ----------------- |
| sonic-memoize | 46.2              |
| memoizee      | 242.6             |
| fast-memoize  | 788.2             |
| nano-memoize  | 3049.0            |

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

Results for function with single parameter of type string:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 30.1              |
| memoizerific        | 1236.1            |
| memoizee (lru)      | 1754.9            |
| moize               | 7598.9            |
| micro               | 8030.6            |

Results for function with single parameter of type number:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 16.0              |
| memoizee (lru)      | 692.3             |
| memoizerific        | 1257.8            |
| moize               | 4978.3            |
| micro               | 8117.5            |

Results for function with single non primitive parameter:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 16.0              |
| memoizee (lru)      | 501.6             |
| memoizerific        | 1172.7            |
| micro               | 8872.3            |
| moize               | 8897.8            |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly, while the size limits of the caches were set to 1000 as well. That makes for a realistic scenario in which the cache size is big enough to handle most function calls.<br>
[benchmarking code](./benchmark/index.ts)

### Benchmarking memoization with multiple function parameters with LRU Cache size limit:

Results for function with multiple primitive parameters:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 51.5              |
| memoizee (lru)      | 419.2             |
| memoizerific        | 1129.6            |
| moize               | 6083.2            |
| micro               | 10822.4           |

Results for function with multiple non primitive parameters:

| Task Name           | Average Time (ps) |
| ------------------- | ----------------- |
| sonic-memoize (lru) | 56.2              |
| memoizee (lru)      | 563.9             |
| memoizerific        | 1122.1            |
| micro               | 9310.0            |
| moize               | 9521.1            |

The benchmarks were being run on sample sets of 1000 different arguments repeatedly, while the size limits of the caches were set to 1000 as well. That makes for a realistic scenario in which the cache size is big enough to handle most function calls.<br>
[benchmarking code](./benchmark/index.ts)

## License

[MIT](./LICENSE)
