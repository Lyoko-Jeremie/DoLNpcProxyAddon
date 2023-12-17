import {NpcInfo} from "./winDef";
import {NpcItem, NpcProxyManager} from "./NpcProxyManager";
import {clone, flatten, flatMap, flattenDeep} from "lodash";
import {Mixin} from 'ts-mixer';
import {SC2ArrayPolyfill, SC2ArrayPolyfillBase} from "./SC2ArrayPolyfill";

export class NpcListProxyTag {
    tag: string = "NpcListProxyTag";
}

export class NpcListIndexProxy extends NpcListProxyTag {
    thisProxy: typeof this;

    get gui() {
        return this.m.gid;
    }

    set gui(value) {
        return; // ignore it
    }

    constructor(
        public m: NpcProxyManager,
    ) {
        super();
        this.thisProxy = new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    const index = Number(prop);
                    if (!isNaN(index)) {
                        return this.m.get(index);
                    } else {
                        const r = this.m.get(prop);
                        if (r) {
                            return r;
                        }
                    }
                }
                return target[prop as any];
            },
            set: (target, prop, value) => {
                if (typeof prop === "string") {
                    const index = Number(prop);
                    if (!isNaN(index)) {
                        if (!this.m.has(index)) {
                            this.m.set(index, value);
                            return true;
                        }
                        return false;
                    } else {
                        if (this.m.has(prop)) {
                            this.m.set(prop, value);
                            return true;
                        }
                    }
                }
                target[prop as any] = value;
                return true;
            }
        });
        return this.thisProxy;
    }

    // 声明当前对象为数组 like
    [n: number]: NpcInfo;
}

export class NpcListReadOnlyProxy extends NpcListIndexProxy implements ReadonlyArray<NpcInfo> {
    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
    }

    readonly [Symbol.unscopables] = {};

    get length(): number {
        return this.m.size;
    }

    [Symbol.iterator](): IterableIterator<NpcInfo> {
        return this.m.values();
    }

    at(index: number): NpcInfo | undefined {
        return this.m.get(index);
    }

    concat(...items: ConcatArray<NpcInfo>[]): NpcInfo[];
    concat(...items: (ConcatArray<NpcInfo> | NpcInfo)[]): NpcInfo[];
    concat(...items: (ConcatArray<NpcInfo> | NpcInfo)[]): NpcInfo[] {
        return [];
    }

    entries(): IterableIterator<[number, NpcInfo]> {
        return this.m.entriesIndex();
    }

    every<S extends NpcInfo>(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => value is S, thisArg?: any): this is S[];
    every(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => unknown, thisArg?: any): boolean;
    every(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.every(T => predicate(T.npcInfo, T.index, r));
    }

    filter<S extends NpcInfo>(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => value is S, thisArg?: any): S[];
    filter(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => unknown, thisArg?: any): NpcInfo[];
    filter(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.filter(T => predicate(T.npcInfo, T.index, r)).map(T => T.npcInfo);
    }

    find<S extends NpcInfo>(predicate: (value: NpcInfo, index: number, obj: NpcInfo[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: NpcInfo, index: number, obj: NpcInfo[]) => unknown, thisArg?: any): NpcInfo | undefined;
    find(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.find(T => predicate(T.npcInfo, T.index, r))?.npcInfo;
    }

    findIndex(predicate: (value: NpcInfo, index: number, obj: NpcInfo[]) => unknown, thisArg?: any): number {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.findIndex(T => predicate(T.npcInfo, T.index, r));
    }

    flat<A, D extends number = 1>(depth?: D): FlatArray<A, D>[] {
        return this.m.readList().map(T => T.npcInfo).flat(depth) as any;
    }

    flatMap<U, This = undefined>(callback: (this: This, value: NpcInfo, index: number, array: NpcInfo[]) => (ReadonlyArray<U> | U), thisArg?: This): U[] {
        return this.m.readList().map(T => T.npcInfo).flatMap(callback);
    }

    forEach(callbackfn: (value: NpcInfo, index: number, array: NpcInfo[]) => void, thisArg?: any): void {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        for (const a of arr) {
            callbackfn(a.npcInfo, a.index, r);
        }
    }

    includes(searchElement: NpcInfo, fromIndex?: number): boolean {
        return this.m.readList().map(T => T.npcInfo).includes(searchElement, fromIndex);
    }

    indexOf(searchElement: NpcInfo, fromIndex?: number): number {
        return this.m.readList().map(T => T.npcInfo).indexOf(searchElement, fromIndex);
    }

    join(separator?: string): string {
        return this.m.readList().map(T => T.npcInfo).join(separator);
    }

    keys(): IterableIterator<number> {
        return this.m.keys();
    }

    lastIndexOf(searchElement: NpcInfo, fromIndex?: number): number {
        return this.m.readList().map(T => T.npcInfo).lastIndexOf(searchElement, fromIndex);
    }

    map<U>(callbackfn: (value: NpcInfo, index: number, array: NpcInfo[]) => U, thisArg?: any): U[] {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        const ra: U[] = [];
        for (const a of arr) {
            ra.push(callbackfn(a.npcInfo, a.index, r));
        }
        return ra;
    }


    reduce(callbackfn: (previousValue: NpcInfo, currentValue: NpcInfo, currentIndex: number, array: NpcInfo[]) => NpcInfo): NpcInfo;
    reduce(callbackfn: (previousValue: NpcInfo, currentValue: NpcInfo, currentIndex: number, array: NpcInfo[]) => NpcInfo, initialValue: NpcInfo): NpcInfo;
    reduce<U>(callbackfn: (previousValue: U, currentValue: NpcInfo, currentIndex: number, array: NpcInfo[]) => U, initialValue: U): U;
    reduce(callbackfn: any, initialValue?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        const R = initialValue;
        for (const a of arr) {
            callbackfn(R, a.npcInfo, a.index, r);
        }
        return R;
    }

    reduceRight(callbackfn: (previousValue: NpcInfo, currentValue: NpcInfo, currentIndex: number, array: NpcInfo[]) => NpcInfo): NpcInfo;
    reduceRight(callbackfn: (previousValue: NpcInfo, currentValue: NpcInfo, currentIndex: number, array: NpcInfo[]) => NpcInfo, initialValue: NpcInfo): NpcInfo;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: NpcInfo, currentIndex: number, array: NpcInfo[]) => U, initialValue: U): U;
    reduceRight(callbackfn: any, initialValue?: any): any {
        const arr = (clone(this.m.readList()) as any as NpcItem[]).reverse();
        const r = arr.map(T => T.npcInfo);
        const R = initialValue;
        for (const a of arr) {
            callbackfn(R, a.npcInfo, a.index, r);
        }
        return R;
    }

    slice(start?: number, end?: number): NpcInfo[] {
        // TODO
        console.error(`[NpcListProxy] slice not implemented!`,);
        throw new Error(`[NpcListProxy] slice not implemented!`);
        return this.m.readList().slice(start, end).map(T => T.npcInfo);
    }

    some(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => unknown, thisArg?: any): boolean {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        for (const a of arr) {
            if (predicate(a.npcInfo, a.index, r)) {
                return true;
            }
        }
        return false;
    }

    values(): IterableIterator<NpcInfo> {
        return this.m.values();
    }

    getReadOnlyArrayRef(): ReadonlyArray<NpcInfo> {
        return this.m.readList().map(T => T.npcInfo);
    }
}

export class NpcListProxy extends NpcListReadOnlyProxy implements Array<NpcInfo>, SC2ArrayPolyfillBase<NpcInfo> {
    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
    }

    pop(): NpcInfo | undefined {
        // redirect to parent
        return this.m.pop()?.npcInfo;
    }

    push(...items: NpcInfo[]): number {
        // redirect to parent
        for (const item of items) {
            this.m.push(item);
        }
        return this.length;
    }

    readonly [Symbol.unscopables] = {};

    copyWithin(target: number, start: number, end?: number): this {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return this;
    }

    fill(value: NpcInfo, start?: number, end?: number): this {
        // TODO
        console.error(`[NpcListProxy] fill not implemented!`,);
        throw new Error(`[NpcListProxy] fill not implemented!`);
        return this;
    }

    reverse(): NpcInfo[] {
        // TODO
        console.error(`[NpcListProxy] reverse not implemented!`,);
        throw new Error(`[NpcListProxy] reverse not implemented!`);
        return [];
    }

    shift(): NpcInfo | undefined {
        if (this.length > 0) {
            return this.m.deleteByIndex([0])[0].npcInfo;
        }
        return undefined;
    }


    sort(compareFn?: (a: NpcInfo, b: NpcInfo) => number): this {
        // TODO
        console.error(`[NpcListProxy] sort not implemented!`,);
        throw new Error(`[NpcListProxy] sort not implemented!`);
        return this;
    }

    splice(start: number, deleteCount?: number): NpcInfo[];
    splice(start: number, deleteCount: number, ...items: NpcInfo[]): NpcInfo[];
    splice(start: number, deleteCount?: number, ...items: NpcInfo[]): NpcInfo[] {
        // TODO
        console.error(`[NpcListProxy] splice not implemented!`,);
        throw new Error(`[NpcListProxy] splice not implemented!`);
        return [];
    }

    unshift(...items: NpcInfo[]): number {
        this.m.push_front_many(items);
        return this.length;
    }

    deleteBy(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => boolean, thisArg?: any): NpcInfo[] {
        const rr = this.m.readList();
        const aa = rr.map(T => T.npcInfo);
        const deletedItem: NpcItem[] = [];
        for (let i = rr.length - 1; i >= 0; i--) {
            if (predicate.call(thisArg, rr[i].npcInfo, i, aa)) {
                deletedItem.push(rr[i]);
            }
        }
        this.m.deleteByIndex(deletedItem.map(T => T.index));
        this.m.reCalcOrder();
        return deletedItem.map(T => T.npcInfo);
    }

    deleteByObj(v: NpcInfo[]): NpcInfo[] {
        return this.deleteBy((value, index, array) => {
            return v.includes(value);
        });
    }
}


// https://github.com/tannerntannern/ts-mixer
export class NpcListProxyWithSc2Polyfill extends Mixin(NpcListProxy) {
    // empty

    // used by js when JSON.stringify()
    toJSON() {
        return this.m.readList().map(T => T.npcInfo);
    }
}
