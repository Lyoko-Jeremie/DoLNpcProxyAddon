import {NpcItem, NpcProxyManager} from "./NpcProxyManager";
import {isNil, isString, parseInt} from "lodash";
import {Mixin} from 'ts-mixer';
import {NpcInfo} from "./winDef";


export class NpcNameListProxyTag {
    tag: string = "NpcNameListProxyTag";
}

export class NpcNameListIndexProxy extends NpcNameListProxyTag {
    thisProxy: typeof this;

    get gui() {
        return this.m.gid;
    }

    set gui(value) {
        return; // ignore it
    }

    constructor(
        protected m: NpcProxyManager,
    ) {
        super();
        this.thisProxy = new Proxy(this, {
            get: (target, prop) => {
                if (isString(prop)) {
                    const index = parseInt(prop);
                    if (!isNaN(index)) {
                        const r = this.m.getNpcItemRef(index);
                        if (isNil(r)) {
                            console.error(`[NpcNameListIndexProxy] get , cannot find index [${index}]`);
                        }
                        return r?.index;
                    }
                    // else {
                    //     const r = this.m.get(prop);
                    //     if (r) {
                    //         return r;
                    //     }
                    // }
                }
                return target[prop as any];
            },
            set: (target, prop, value) => {
                if (isString(prop)) {
                    const index = parseInt(prop);
                    if (!isNaN(index)) {
                        // TODO
                        // if (!this.m.has(index)) {
                        //     this.m.set(index, value);
                        //     return true;
                        // }
                        return false;
                    }
                    // else {
                    //     if (this.m.has(prop)) {
                    //         this.m.set(prop, value);
                    //         return true;
                    //     }
                    // }
                }
                target[prop as any] = value;
                return true;
            }
        });
        return this.thisProxy;
    }

    // 声明当前对象为数组 like
    [n: number]: string;

}


export class NpcNameListReadOnlyProxy extends NpcNameListIndexProxy implements ReadonlyArray<string> {
    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
    }

    readonly [Symbol.unscopables] = {};

    get length(): number {
        return this.m.size;
    }

    [Symbol.iterator](): IterableIterator<string> {
        return this.m.readList().map(T => T.name).values();
    }

    at(index: number): string | undefined {
        return this.m.getNpcItemRef(index)?.name;
    }

    /**
     * this operator need high level optimize
     */
    includes(searchElement: string, fromIndex?: number): boolean {
        return this.m.has(searchElement);
    }

    /**
     * this operator need high level optimize
     */
    indexOf(searchElement: string, fromIndex?: number): number {
        const r = this.m.getNpcItemRef(searchElement);
        if (isNil(r)) {
            console.error(`[NpcNameListReadOnlyProxy] indexOf , cannot find [${searchElement}]`);
            return -1;
        }
        return r.index;
    }

    concat(...items: ConcatArray<string>[]): string[];
    concat(...items: (ConcatArray<string> | string)[]): string[];
    concat(...items: (ConcatArray<string> | string)[]): string[] {
        return [];
    }

    entries(): IterableIterator<[number, string]> {
        return this.m.readList().map(T => T.name).entries();
    }

    every<S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): this is S[];
    every(predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean;
    every(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return arr.every((T, i) => predicate(T.name, T.index, r));
    }

    filter<S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[];
    filter(predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
    filter(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return arr.filter((T, i) => predicate(T.name, T.index, r));
    }

    find<S extends string>(predicate: (value: string, index: number, obj: string[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
    find(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return arr.find(T => predicate(T.name, T.index, r));
    }

    findIndex(predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): number {
        return this.m.readList().findIndex(T => predicate(T.name, T.index, thisArg));
    }

    flat<A, D extends number = 1>(depth?: D): FlatArray<A, D>[] {
        return this.m.readList().map(T => T.name).flat(depth) as any;
    }

    flatMap<U, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => (ReadonlyArray<U> | U), thisArg?: This): U[] {
        return this.m.readList().map(T => T.name).flatMap(callback);
    }

    forEach(callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any): void {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        arr.forEach((T, i) => callbackfn(T.name, T.index, r));
    }

    join(separator?: string): string {
        return this.m.readList().map(T => T.name).join(separator);
    }

    keys(): IterableIterator<number> {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return r.keys();
    }

    lastIndexOf(searchElement: string, fromIndex?: number): number {
        return this.m.getNpcItemRef(searchElement)?.index || -1;
    }

    map<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any): U[] {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        const ra: U[] = [];
        for (const a of arr) {
            ra.push(callbackfn(a.name, a.index, r));
        }
        return ra;
    }

    reduce(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
    reduce(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
    reduce<U>(callbackfn: (previousValue: U, currentValue: string, currentIndex: number, array: string[]) => U, initialValue: U): U;
    reduce(callbackfn: any, initialValue?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return arr.reduce((acc, T, i) => callbackfn(acc, T.name, T.index, r), initialValue);
    }

    reduceRight(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
    reduceRight(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: string, currentIndex: number, array: string[]) => U, initialValue: U): U;
    reduceRight(callbackfn: any, initialValue?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return arr.reduceRight((acc, T, i) => callbackfn(acc, T.name, T.index, r), initialValue);
    }

    slice(start?: number, end?: number): string[] {
        return this.m.readList().map(T => T.name).slice(start, end);
    }

    some(predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean {
        const arr = this.m.readList();
        const r = arr.map(T => T.name);
        return arr.some((T, i) => predicate(T.name, T.index, r));
    }

    values(): IterableIterator<string> {
        return this.m.readList().map(T => T.name).values();
    }

    getReadOnlyArrayRef(): ReadonlyArray<string> {
        return this.m.readList().map(T => T.name);
    }

}


export class NpcNameListProxy extends NpcNameListReadOnlyProxy implements Array<string> {
    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
    }

    pop(): string | undefined {
        // TODO
        // // redirect to parent
        // return this.m.pop()?.npcInfo;
        return undefined;
    }

    push(...items: string[]): number {
        // TODO
        // // redirect to parent
        // for (const item of items) {
        //     this.m.push(item);
        // }
        return this.length;
    }

    readonly [Symbol.unscopables] = {};

    copyWithin(target: number, start: number, end?: number): this {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return this;
    }

    fill(value: string, start?: number, end?: number): this {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return this;
    }

    reverse(): string[] {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return [];
    }

    shift(): string | undefined {
        if (this.length > 0) {
            return this.m.deleteByIndex([0])[0].name;
        }
        return undefined;
    }

    sort(compareFn?: (a: string, b: string) => number): this {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return this;
    }

    splice(start: number, deleteCount?: number): string[];
    splice(start: number, deleteCount: number, ...items: string[]): string[];
    splice(start: number, deleteCount?: number, ...items: string[]): string[] {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return [];
    }

    unshift(...items: string[]): number {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return 0;
    }

    deleteBy(predicate: (value: string, index: number, array: string[]) => boolean, thisArg?: any): string[] {
        const rr = this.m.readList();
        const aa = rr.map(T => T.name);
        const deletedItem: NpcItem[] = [];
        for (let i = rr.length - 1; i >= 0; i--) {
            if (predicate.call(thisArg, rr[i].name, i, aa)) {
                deletedItem.push(rr[i]);
            }
        }
        this.m.deleteByIndex(deletedItem.map(T => T.index));
        this.m.reCalcOrder();
        return deletedItem.map(T => T.name);
    }
}


// https://github.com/tannerntannern/ts-mixer
export class NpcNameListProxyWithSc2Polyfill extends Mixin(NpcNameListProxy) {
    // empty

    // used by js when JSON.stringify()
    toJSON() {
        return this.m.readList().map(T => T.name);
    }
}

