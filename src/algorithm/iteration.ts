/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * An object which traverses a collection of values.
 */
export
interface IIterator<T> {
  /**
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The cloned iterator can be consumed independently of the current
   * iterator. In essence, it is a copy of the iterator value stream
   * which starts at the current iterator location. This can be useful
   * for iterator lookahead and stream duplication.
   *
   * Most iterators can trivially support cloning. Those which cannot
   * (a single pass iterator) should throw an exception and document
   * that they cannot be cloned.
   */
  clone(): IIterator<T>;

  /**
   * Get the next value in the collection.
   *
   * @returns The next value in the collection, or `undefined` if the
   *   iterator is exhausted.
   *
   * #### Notes
   * The `undefined` value is used to signal the end of iteration and
   * should therefore not be used as a value in a collection.
   *
   * The use of the `undefined` sentinel is an explicit design choice
   * which favors performance over purity. The ES6 method of returning
   * a `{ value, done }` pair is undesirable as it requires an object
   * allocation on each iteration, and an `isDone()` method increases
   * implementation and runtime complexity.
   */
  next(): T;
}


/**
 * Invoke a function for each value in an iterator.
 *
 * @param iter - The iterator of values of interest.
 *
 * @param fn - The callback function to invoke for each value in the
 *   iterator. The return value is ignored.
 *
 * #### Notes
 * This greedily traverses the iterator.
 *
 * Iteration cannot be terminated early.
 */
export
function each<T>(iter: IIterator<T>, fn: (value: T) => void): void {
  while (true) {
    let value = iter.next();
    if (value === void 0) {
      return;
    }
    fn(value);
  }
}


/**
 * Test whether all values in a iterator satisfy a predicate.
 *
 * @param iter - The iterator of values of interest.
 *
 * @param fn - The predicate function to invoke for each value in the
 *   iterator. It returns whether the value passes the test.
 *
 * @returns `true` if all values pass the test, `false` otherwise.
 *
 * #### Notes
 * This greedily traverses the iterator.
 *
 * Iteration terminates on the first `false` test.
 */
export
function every<T>(iter: IIterator<T>, fn: (value: T) => boolean): boolean {
  while (true) {
    let value = iter.next();
    if (value === void 0) {
      return true;
    }
    if (!fn(value)) {
      return false;
    }
  }
}


/**
 * Test whether any value in a range satisfies a predicate.
 *
 * @param iter - The iterator of values of interest.
 *
 * @param fn - The predicate function to invoke for each value in the
 *   iterator. It returns whether the value passes the test.
 *
 * @returns `true` if any value passes the test, `false` otherwise.
 *
 * #### Notes
 * This greedily traverses the iterator.
 *
 * Iteration terminates on the first `true` test.
 */
export
function some<T>(iter: IIterator<T>, fn: (value: T) => boolean): boolean {
  while (true) {
    let value = iter.next();
    if (value === void 0) {
      return false;
    }
    if (fn(value)) {
      return true;
    }
  }
}


/**
 * Filter an iterator for values which pass a test.
 *
 * @param iter - The iterator of values of interest.
 *
 * @param fn - The predicate function to invoke for each value in the
 *   iterator. It returns whether the value passes the test.
 *
 * @returns An iterator which yields the values which pass the test.
 */
function filter<T>(iter: IIterator<T>, fn: (value: T) => boolean): FilterIterator<T> {
  return new FilterIterator<T>(iter, fn);
}


/**
 * An iterator which yields values which pass a test.
 */
export
class FilterIterator<T> implements IIterator<T> {
  /**
   * Construct a new filter iterator.
   *
   * @param iter - The iterator of values of interest.
   *
   * @param fn - The predicate function to invoke for each value in
   *   the iterator. It returns whether the value passes the test.
   */
  constructor(iter: IIterator<T>, fn: (value: T) => boolean) {
    this.source = iter;
    this.fn = fn;
  }

  /**
   * The source iterator for the filter iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>;

  /**
   * The predicate function for the filter iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  fn: (value: T) => boolean;

  /**
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The source iterator must be cloneable.
   *
   * The predicate function is shared among clones.
   */
  clone(): FilterIterator<T> {
    return new FilterIterator<T>(this.source.clone(), this.fn);
  }

  /**
   * Get the next value which passes the test.
   *
   * @returns The next value from the source iterator which passes
   *   the predicate, or `undefined` if the iterator is exhausted.
   */
  next(): T {
    let fn = this.fn;
    let iter = this.source;
    while (true) {
      let value = iter.next();
      if (value === void 0) {
        return void 0;
      }
      if (fn(value)) {
        return value;
      }
    }
  }
}


/**
 * Transform iterator values by applying a mapping function.
 *
 * @param iter - The iterator of values of interest.
 *
 * @param fn - The mapping function to invoke for each value in the
 *   iterator. It returns the transformed value.
 *
 * @returns An iterator which yields the transformed values.
 */
function map<T, U>(iter: IIterator<T>, fn: (value: T) => U): MapIterator<T, U> {
  return new MapIterator<T, U>(iter, fn);
}


/**
 * An iterator which transforms values using a mapping function.
 */
export
class MapIterator<T, U> implements IIterator<U> {
  /**
   * Construct a new map iterator.
   *
   * @param iter - The iterator of values of interest.
   *
   * @param fn - The mapping function to invoke for each value in the
   *   iterator. It returns the transformed value.
   */
  constructor(iter: IIterator<T>, fn: (value: T) => U) {
    this.source = iter;
    this.fn = fn;
  }

  /**
   * The source iterator for the map iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>;

  /**
   * The mapping function for the map iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  fn: (value: T) => U;

  /**
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The source iterator must be cloneable.
   *
   * The mapping function is shared among clones.
   */
  clone(): MapIterator<T, U> {
    return new MapIterator<T, U>(this.source.clone(), this.fn);
  }

  /**
   * Get the next mapped value from the source iterator.
   *
   * @returns The next value from the source iterator transformed
   *   by the mapper, or `undefined` if the iterator is exhausted.
   */
  next(): U {
    let value = this.source.next();
    if (value === void 0) return void 0;
    return this.fn.call(void 0, value);
  }
}


/**
 * Create an iterator of evenly spaced values.
 *
 * @param start - The starting value for the range, inclusive.
 *
 * @param stop - The stopping value for the range, exclusive.
 *
 * @param step - The distance between each generated value.
 *
 * @returns An iterator which generates evenly spaced values.
 *
 * #### Notes
 * In the single argument form of `range(stop)`, `start` defaults to
 * `0` and `step` defaults to `1`.
 *
 * In the two argument form of `range(start, stop)`, `step` defaults
 * to `1`.
 *
 * All values can be any real number, but `step` cannot be `0`.
 */
export
function range(start: number, stop?: number, step?: number): RangeIterator {
  if (stop === void 0) {
    stop = start;
    start = 0;
  }
  if (step === void 0) {
    step = 1;
  }
  return new RangeIterator(start, stop, step);
}


/**
 * An iterator which generates evenly spaced values.
 */
export
class RangeIterator implements IIterator<number> {
  /**
   * Get the number of steps needed to traverse a range.
   *
   * @param start - The starting value for the range, inclusive.
   *
   * @param stop - The stopping value for the range, exclusive.
   *
   * @param step - The non-zero distance between each value.
   *
   * @returns The number of steps need to traverse the range.
   */
  static stepCount(start: number, stop: number, step: number): number {
    if (start > stop && step > 0) {
      return 0;
    }
    if (start < stop && step < 0) {
      return 0;
    }
    return Math.ceil((stop - start) / step);
  }

  /**
   * Construct a new range iterator.
   *
   * @param start - The starting value for the range, inclusive.
   *
   * @param stop - The stopping value for the range, exclusive.
   *
   * @param step - The non-zero distance between each value.
   */
  constructor(start: number, stop: number, step: number) {
    if (step === 0) throw new Error('RangeIterator(): Step cannot be zero');
    this._index = 0;
    this._step = step;
    this._base = start;
    this._count = RangeIterator.stepCount(start, stop, step);
  }

  /**
   * Create an independent clone of the range iterator.
   *
   * @returns A new iterator starting with the current value.
   */
  clone(): RangeIterator {
    let start = this._base + this._step * this._index;
    let stop = this._base + this._step * this._count;
    return new RangeIterator(start, stop, this._step);
  }

  /**
   * Get the next value from the range.
   *
   * @returns The next value from the range, or `undefined` if the
   *   iterator is exhausted.
   */
  next(): number {
    if (this._index >= this._count) return void 0;
    return this._base + this._step * this._index++;
  }

  private _base: number;
  private _step: number;
  private _index: number;
  private _count: number;
}
