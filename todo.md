## TODO

- add datalabel component...
- data : test avoid realloc array (benchmark)...

- zoom limits

## ChartHTML

- get tests from ChartHTML ?
- Update ChartHTML

## Clean

- fix parent (?).
- use WeakRef array (cf below)
- use asserts...
- move merge into WebMisc...

```ts
class WeakRefArray {
  #refs = [];

  add(object) {
    if (typeof object !== 'object' || object === null) {
      throw new TypeError('WeakRefArray only supports non-null objects.');
    }
    this.#refs.push(new WeakRef(object));
  }

  cleanup() {
    this.#refs = this.#refs.filter(ref => ref.deref() !== undefined);
  }

  forEach(callback) {
    let hasDeadRef = false;

    for (const ref of this.#refs) {
      const value = ref.deref();

      if (value === undefined) {
        hasDeadRef = true;
        continue;
      }

      callback(value);
    }

    if (hasDeadRef) {
      this.cleanup();
    }
  }

  size() {
    this.cleanup();
    return this.#refs.length;
  }

  [Symbol.iterator]() {
    this.cleanup();
    return this.#refs
      .map(ref => ref.deref()) // Toutes sont vivantes après cleanup()
      [Symbol.iterator]();
  }
}
```