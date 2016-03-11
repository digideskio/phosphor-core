/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IInputRange
} from '../range/types';


/**
 * Invoke a function for each value in a range.
 *
 * @param range - The input range of values to iterate.
 *
 * @param fn - The callback function to invoke for each value.
 *
 * #### Notes
 * This function greedily iterates the range and invokes the callback
 * once for each value. Iteration cannot be terminated early.
 *
 * The callback is provided the value and the zero-based index of the
 * current iteration.
 */
export
function each<T>(range: IInputRange<T>, fn: (value: T, index: number) => void): void {
  for (let i = 0; !range.isEmpty(); ++i) {
    fn(range.popFront(), i);
  }
}


/**
 * Test whether all values in a range satisfy a predicate.
 *
 * @param range - The input range of values to iterate.
 *
 * @param fn - The predicate function to invoke for each value.
 *
 * @returns `true` if all values pass, `false` otherwise.
 *
 * #### Notes
 * This function greedily iterates the range and invokes the predicate
 * once for each value. Iteration terminates on the first non-match.
 *
 * The predicate is provided the value and the zero-based index of the
 * current iteration.
 */
export
function every<T>(range: IInputRange<T>, fn: (value: T, index: number) => boolean): boolean {
  for (let i = 0; !range.isEmpty(); ++i) {
    if (!fn(range.popFront(), i)) return false;
  }
  return true;
}


/**
 * Test whether any value in a range satisfies a predicate.
 *
 * @param range - The input range of values to iterate.
 *
 * @param fn - The predicate function to invoke for each value.
 *
 * @returns `true` if any value passes, `false` otherwise.
 *
 * #### Notes
 * This function greedily iterates the range and invokes the predicate
 * once for each value. Iteration terminates on the first match.
 *
 * The predicate is provided the value and the zero-based index of the
 * current iteration.
 */
export
function some<T>(range: IInputRange<T>, fn: (value: T, index: number) => boolean): boolean {
  for (let i = 0; !range.isEmpty(); ++i) {
    if (fn(range.popFront(), i)) return true;
  }
  return false;
}
