import {} from 'lodash';
import {NpcProxyManager} from "./NpcProxyManager";
import {NpcInfo} from "./winDef";

// https://stackoverflow.com/questions/44593961/why-does-abstract-class-have-to-implement-all-methods-from-interface
// tell the type system we have `Array` function
// but we not actually implement it
// the `Array` function will be implement by the other part when `mixin`
export interface SC2ArrayPolyfillBase<T> extends Array<T> {
    m: NpcProxyManager;

    getReadOnlyArrayRef(): ReadonlyArray<T>;

    deleteBy(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];

    deleteByObj(v: T[]): T[];

}

export interface SC2ArrayPolyfill<T> extends SC2ArrayPolyfillBase<T> {
}

// all the function come from SugarCube-2 `src/lib/extensions.js`
export abstract class SC2ArrayPolyfill<T> {

    /**
     Concatenates one or more unique elements to the end of the base array
     and returns the result as a new array.  Elements which are arrays will
     be merged—i.e. their elements will be concatenated, rather than the
     array itself.
     */
    concatUnique(...args: any[]): any[] {
        const result = Array.from(this);
        if (args.length === 0) {
            return result;
        }

        const items = args.reduce((prev: any, cur: any) => prev.concat(cur));
        const addSize = items.length;

        if (addSize === 0) {
            return result;
        }

        const indexOf = this.indexOf;
        const push = this.push;

        for (let i = 0; i < addSize; ++i) {
            const value = items[i];

            if (indexOf.call(result, value) === -1) {
                push.call(result, value);
            }
        }

        return result;
    }

    /*
        Returns the number of times the given element was found within the array.
    */
    count(needle: T, fromIndex?: number) {
        let pos = Number(arguments[1]) || 0;
        let count = 0;

        while ((pos = this.indexOf.call(this, needle, pos)) !== -1) {
            ++count;
            ++pos;
        }

        return count;
    }

    /*
        Returns the number elements within the array that pass the test
        implemented by the given predicate function.
    */
    countWith(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any) {
        const length = this.length >>> 0;

        if (length === 0) {
            return 0;
        }

        let count = 0;

        for (let i = 0; i < length; ++i) {
            if (predicate.call(thisArg, this[i], i, this)) {
                ++count;
            }
        }

        return count;
    }

    /*
        Removes and returns all of the given elements from the array.
    */
    delete(...args: T[]) {
        return this.deleteByObj(args);
    }

    /*
        Removes and returns all of the elements at the given indices from the array.
    */
    deleteAt(...args: number[]) {
        this.m.deleteByIndex(args);
    }

    /*
        Removes and returns all of the elements that pass the test implemented
        by the given predicate function from the array.
    */
    deleteWith(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any) {
        return this.deleteBy(predicate as any, thisArg);
    }

    /*
        Returns the first element from the array.
    */
    first() {
        return this[0];
    }


    /*
        Returns whether all of the given elements were found within the array.
    */
    includesAll(a?: T[][]): boolean;
    includesAll(a?: T[]): boolean;
    includesAll(...args: (T | T[] | any)[]) {

        if (args.length === 1) {
            if (Array.isArray(args[0])) {
                const aa: T[][] = (args as T[][][])[0];
                return this.includesAll.apply(this, aa as any);
            }

            return this.includes.call(this, args as T);
        }

        for (let i = 0, iend = args.length; i < iend; ++i) {
            if (
                !this.some.call(this, function (this: any, val) {
                    return val === this.val || val !== val && this.val !== this.val;
                }, {val: args[i]})
            ) {
                return false;
            }
        }

        return true;
    }

    /*
        Returns whether any of the given elements were found within the array.
    */
    includesAny(a?: T[][]): boolean;
    includesAny(a?: T[]): boolean;
    includesAny(...args: (T | T[] | any)[]) {
        if (args.length === 1) {
            if (Array.isArray(args[0])) {
                const aa: T[][] = (args as T[][][])[0];
                return this.includesAny.call(this, aa as any);
            }

            return this.includes.call(this, args as T);
        }

        for (let i = 0, iend = args.length; i < iend; ++i) {
            if (
                this.some.call(this, function (this: any, val) {
                    return val === this.val || val !== val && this.val !== this.val;
                }, {val: args[i]})
            ) {
                return true;
            }
        }

        return false;
    }

    /*
        Returns the last element from the array.
    */
    last() {
        return this[this.length - 1];
    }

    /*
        Appends one or more unique elements to the end of the base array and
        returns its new length.
    */
    pushUnique(...args: any[]) {

        for (let i = 0, iend = args.length; i < iend; ++i) {
            const value = args[i];
            if (this.indexOf.call(this, value) === -1) {
                this.push.call(this, value);
            }
        }

        return this.length;
    }

    // /*
    //     Randomly selects the given number of unique elements from the base array
    //     and returns the selected elements as a new array.
    // */
    // randomMany() {
    // }

    // /*
    //     Randomly shuffles the array and returns it.
    // */
    // shuffle() {
    // }

    // /*
    //     Prepends one or more unique elements to the beginning of the base array
    //     and returns its new length.
    // */
    // unshiftUnique() {
    // }

}

