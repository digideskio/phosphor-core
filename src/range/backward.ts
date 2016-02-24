/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IBidirectionalRange, IMutableBidirectionalRange, IMutableRandomAccessRange,
  IRandomAccessRange
} from './interfaces';


/**
 * Iterate a bidirectional range in reverse order.
 *
 * @param range - The bidirectional range of interest.
 *
 * @returns A range which iterates the given range in reverse.
 *
 * #### Notes
 * If a random access range is provided, the returned range will also
 * support random access.
 */
export
function backward<T>(range: IRandomAccessRange<T>): backward.RandomRange<T>;
export
function backward<T>(range: IBidirectionalRange<T>): backward.Range<T>;
export
function backward<T>(range: any): any {
  if (typeof range.at === 'function') {
    return new backward.RandomRange<T>(range);
  }
  return new backward.Range<T>(range);
}


/**
 * The namespace which holds the backward range implementations.
 */
export
namespace backward {
  /**
   * A bidirectional backward range.
   *
   * #### Notes
   * This range iterates a bidirectional source range in reverse order.
   */
  export
  class Range<T> implements IBidirectionalRange<T> {
    /**
     * Construct a new backward range.
     *
     * @param source - The bidirectional range to iterate.
     */
    constructor(source: IBidirectionalRange<T>) {
      this.source = source;
    }

    /**
     * The source range for the backward range.
     */
    source: IBidirectionalRange<T>;

    /**
     * Test whether the range is empty.
     *
     * @returns `true` if the range is empty, `false` otherwise.
     *
     * #### Notes
     * This is equivalent to `isEmpty()` on the source range.
     */
    isEmpty(): boolean {
      return this.source.isEmpty();
    }

    /**
     * Get the value at the front of the range.
     *
     * @returns The value at the front of the range.
     *
     * #### Notes
     * This is equivalent to `back()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    front(): T {
      return this.source.back();
    }

    /**
     * Get the value at the back of the range.
     *
     * @returns The value at the back of the range.
     *
     * #### Notes
     * This is equivalent to `front()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    back(): T {
      return this.source.front();
    }

    /**
     * Drop the value at the front of the range.
     *
     * #### Notes
     * This is equivalent to `dropBack()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    dropFront(): void {
      this.source.dropBack();
    }

    /**
     * Drop the value at the back of the range.
     *
     * #### Notes
     * This is equivalent to `dropFront()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    dropBack(): void {
      this.source.dropFront();
    }

    /**
     * Create an independent slice of the range.
     *
     * @returns A new slice of the current range.
     */
    slice(): Range<T> {
      return new Range<T>(this.source.slice());
    }
  }

  /**
   * A random access backward range.
   *
   * #### Notes
   * This range iterates a random access source range in reverse order.
   */
  export
  class RandomRange<T> extends Range<T> implements IRandomAccessRange<T> {
    /**
     * Construct a new random access backward range.
     *
     * @param source - The random access range to iterate.
     */
    constructor(source: IRandomAccessRange<T>) {
      super(source);
    }

    /**
     * The source range for the backward range.
     */
    source: IRandomAccessRange<T>;

    /**
     * Get the current length of the range.
     *
     * @returns The current length of the range.
     *
     * #### Notes
     * This is equivalent to `length()` on the source range.
     *
     * If the range is iterated when empty, the behavior is undefined.
     */
    length(): number {
      return this.source.length();
    }

    /**
     * Get the value at a specific index in the range.
     *
     * @param index - The index of the value of interest. Negative
     *   indices are not supported.
     *
     * @returns The value at the specified index.
     *
     * #### Notes
     * If the index is out of range, the behavior is undefined.
     *
     * If the range is empty, the behavior is undefined.
     */
    at(index: number): T {
      return this.source.at(this.source.length() - index - 1);
    }

    /**
     * Create an independent slice of the range.
     *
     * @param start - The starting index of the slice, inclusive.
     *   The default is zero. Negative indices are not supported.
     *
     * @param stop - The ending index of the slice, exclusive. The
     *   default is the length of the range. Negative indices are
     *   not supported.
     *
     * @returns A new slice of the current range.
     *
     * #### Notes
     * If the start index is out of range, the behavior is undefined.
     *
     * If the stop index out of range, the behavior is undefined.
     */
    slice(start?: number, stop?: number): RandomRange<T> {
      let len = this.source.length();
      if (start === void 0) start = 0;
      if (stop === void 0) stop = len;
      return new RandomRange<T>(this.source.slice(len - stop, len - start));
    }
  }
}


/**
 * Iterate a mutable bidirectional range in reverse order.
 *
 * @param range - The mutable bidirectional range of interest.
 *
 * @returns A mutable range which iterates the given range in reverse.
 *
 * #### Notes
 * If a random access range is provided, the returned range will also
 * support random access.
 */
export
function mutableBackward<T>(range: IMutableRandomAccessRange<T>): mutableBackward.RandomRange<T>;
export
function mutableBackward<T>(range: IMutableBidirectionalRange<T>): mutableBackward.Range<T>;
export
function mutableBackward<T>(range: any): any {
  if (typeof range.setAt === 'function') {
    return new mutableBackward.RandomRange<T>(range);
  }
  return new mutableBackward.Range<T>(range);
}


/**
 * The namespace which holds the mutable backward range implementations.
 */
export
namespace mutableBackward {
  /**
   * A mutable bidirectional backward range.
   *
   * #### Notes
   * This range iterates a mutable bidirectional source range in
   * reverse order.
   */
  export
  class Range<T> extends backward.Range<T> implements IMutableBidirectionalRange<T> {
    /**
     * Construct a new mutable backward range.
     *
     * @param source - The mutable bidirectional range to iterate.
     */
    constructor(source: IMutableBidirectionalRange<T>) {
      super(source);
    }

    /**
     * The source range for the backward range.
     */
    source: IMutableBidirectionalRange<T>;

    /**
     * Set the value at the front of the range.
     *
     * @param value - The value to set at the front of the range.
     *
     * #### Notes
     * This is equivalent to `setBack()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    setFront(value: T): void {
      this.source.setBack(value);
    }

    /**
     * Set the value at the back of the range.
     *
     * @param value - The value to set at the back of the range.
     *
     * #### Notes
     * This is equivalent to `setFront()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    setBack(value: T): void {
      this.source.setFront(value);
    }

    /**
     * Create an independent slice of the range.
     *
     * @returns A new slice of the current range.
     */
    slice(): Range<T> {
      return new Range<T>(this.source.slice());
    }
  }

  /**
   * A mutable random access backward range.
   *
   * #### Notes
   * This range iterates a mutable random access source range in
   * reverse order.
   */
  export
  class RandomRange<T> extends backward.RandomRange<T> implements IMutableRandomAccessRange<T> {
    /**
     * Construct a new mutable random access backward range.
     *
     * @param source - The mutable random access range to iterate.
     */
    constructor(source: IMutableRandomAccessRange<T>) {
      super(source);
    }

    /**
     * The source range for the backward range.
     */
    source: IMutableRandomAccessRange<T>;

    /**
     * Set the value at the front of the range.
     *
     * @param value - The value to set at the front of the range.
     *
     * #### Notes
     * This is equivalent to `setBack()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    setFront: (value: T) => void; // mixin

    /**
     * Set the value at the back of the range.
     *
     * @param value - The value to set at the back of the range.
     *
     * #### Notes
     * This is equivalent to `setFront()` on the source range.
     *
     * If the range is empty, the behavior is undefined.
     */
    setBack: (value: T) => void; // mixin

    /**
     * Set the value at a specific index in the range.
     *
     * @param index - The index of the value of interest. Negative
     *   indices are not supported.
     *
     * @param value - The value to set at the specified index.
     *
     * #### Notes
     * If the index is out of range, the behavior is undefined.
     *
     * If the range is empty, the behavior is undefined.
     */
    setAt(index: number, value: T): void {
      this.source.setAt(this.source.length() - index - 1, value);
    }

    /**
     * Create an independent slice of the range.
     *
     * @param start - The starting index of the slice, inclusive.
     *   The default is zero. Negative indices are not supported.
     *
     * @param stop - The ending index of the slice, exclusive. The
     *   default is the length of the range. Negative indices are
     *   not supported.
     *
     * @returns A new slice of the current range.
     *
     * #### Notes
     * If the start index is out of range, the behavior is undefined.
     *
     * If the stop index out of range, the behavior is undefined.
     */
    slice(start?: number, stop?: number): RandomRange<T> {
      let len = this.source.length();
      if (start === void 0) start = 0;
      if (stop === void 0) stop = len;
      return new RandomRange<T>(this.source.slice(len - stop, len - start));
    }
  }

  // Apply the relevant mixin methods.
  RandomRange.prototype.setFront = Range.prototype.setFront;
  RandomRange.prototype.setBack = Range.prototype.setBack;
}