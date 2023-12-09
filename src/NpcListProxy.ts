import {NpcInfo} from "./winDef";
import {NpcItem, NpcProxyManager} from "./DoLNpcProxyAddon";
import {clone} from "lodash";


export class NpcListIndexProxy {
    thisProxy: typeof this;

    constructor(
        protected m: NpcProxyManager,
    ) {
        this.thisProxy = new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    const index = Number(prop);
                    if (isNaN(index)) {
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
                            this.m.set(index, value);
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

    [n: number]: NpcInfo;
}

export class NpcListProxy extends NpcListIndexProxy implements Array<NpcInfo> {
    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
    }

    // @ts-ignore
    readonly [Symbol.unscopables](): { [K in keyof (typeof this)[]]?: boolean } {
        return {};
    }

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

    copyWithin(target: number, start: number, end?: number): this {
        // TODO
        console.error(`[NpcListProxy] copyWithin not implemented!`,);
        throw new Error(`[NpcListProxy] copyWithin not implemented!`);
        return this;
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

    fill(value: NpcInfo, start?: number, end?: number): this {
        // TODO
        console.error(`[NpcListProxy] fill not implemented!`,);
        throw new Error(`[NpcListProxy] fill not implemented!`);
        return this;
    }

    filter<S extends NpcInfo>(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => value is S, thisArg?: any): S[];
    filter(predicate: (value: NpcInfo, index: number, array: NpcInfo[]) => unknown, thisArg?: any): NpcInfo[];
    filter(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.filter(T => predicate(T.npcInfo, T.index, r));
    }

    find<S extends NpcInfo>(predicate: (value: NpcInfo, index: number, obj: NpcInfo[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: NpcInfo, index: number, obj: NpcInfo[]) => unknown, thisArg?: any): NpcInfo | undefined;
    find(predicate: any, thisArg?: any): any {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.find(T => predicate(T.npcInfo, T.index, r));
    }

    findIndex(predicate: (value: NpcInfo, index: number, obj: NpcInfo[]) => unknown, thisArg?: any): number {
        const arr = this.m.readList();
        const r = arr.map(T => T.npcInfo);
        return arr.findIndex(T => predicate(T.npcInfo, T.index, r));
    }

    flat<A, D extends number = 1>(depth?: D): FlatArray<A, D>[] {
        // TODO
        console.error(`[NpcListProxy] flat not implemented!`,);
        throw new Error(`[NpcListProxy] flat not implemented!`);
        return [];
    }

    flatMap<U, This = undefined>(callback: (this: This, value: NpcInfo, index: number, array: NpcInfo[]) => (ReadonlyArray<U> | U), thisArg?: This): U[] {
        // TODO
        console.error(`[NpcListProxy] flatMap not implemented!`,);
        throw new Error(`[NpcListProxy] flatMap not implemented!`);
        return [];
    }

    forEach(callbackfn: (value: NpcInfo, index: number, array: NpcInfo[]) => void, thisArg?: any): void {
    }

    includes(searchElement: NpcInfo, fromIndex?: number): boolean {
        return this.m.readList().map(T => T.npcInfo).includes(searchElement, fromIndex);
    }

    indexOf(searchElement: NpcInfo, fromIndex?: number): number {
        return this.m.readList().map(T => T.npcInfo).indexOf(searchElement, fromIndex);
    }

    join(separator?: string): string {
        // TODO
        console.error(`[NpcListProxy] join not implemented!`, [separator]);
        throw new Error(`[NpcListProxy] join not implemented!`);
        return "";
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

    pop(): NpcInfo | undefined {
        // TODO
        console.error(`[NpcListProxy] pop not implemented!`,);
        throw new Error(`[NpcListProxy] pop not implemented!`);
        return undefined;
    }

    push(...items: NpcInfo[]): number {
        // TODO
        console.error(`[NpcListProxy] pop not implemented!`,);
        throw new Error(`[NpcListProxy] pop not implemented!`);
        return 0;
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

    reverse(): NpcInfo[] {
        // TODO
        console.error(`[NpcListProxy] reverse not implemented!`,);
        throw new Error(`[NpcListProxy] reverse not implemented!`);
        return [];
    }

    shift(): NpcInfo | undefined {
        // TODO
        console.error(`[NpcListProxy] shift not implemented!`,);
        throw new Error(`[NpcListProxy] shift not implemented!`);
        return undefined;
    }

    slice(start?: number, end?: number): NpcInfo[] {
        // TODO
        console.error(`[NpcListProxy] slice not implemented!`,);
        throw new Error(`[NpcListProxy] slice not implemented!`);
        return [];
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
        // TODO
        console.error(`[NpcListProxy] unshift not implemented!`,);
        throw new Error(`[NpcListProxy] unshift not implemented!`);
        return 0;
    }

    values(): IterableIterator<NpcInfo> {
        return this.m.values();
    }

}
