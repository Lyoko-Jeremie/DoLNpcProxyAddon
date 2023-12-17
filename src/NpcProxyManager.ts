import type {LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import {isArray, isNil, isNumber, isString, clone} from 'lodash';
import {NpcInfo} from "./winDef";
import {CustomIterableIterator, CustomReadonlyMapHelper} from "./CustomReadonlyMapHelper";

// https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
const genRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const NpcProxyManagerCoreGidLength = 32;

export interface NpcItem {
    /**
     * the index of game `NPCName` array
     */
    index: number,
    /**
     * the name of game `NPCName.nam` or `NPCNameList`
     */
    name: string,
    /**
     * the item of game `NPCName` item
     */
    npcInfo: NpcInfo,
    /**
     * the alias of name, example, for CN name
     */
    alias: string[],
}

export abstract class NpcProxyManagerCore extends CustomReadonlyMapHelper<number, NpcInfo> {
    protected abstract logger: LogWrapper;

    gid: string = genRandomHex(NpcProxyManagerCoreGidLength);
    protected nextId = 0;

    protected npc: Map<string, NpcItem> = new Map<string, NpcItem>();
    protected npcIndex: Map<number, NpcItem> = new Map<number, NpcItem>();
    protected npcList: NpcItem[] = [];
    protected npcAlias: Map<string, NpcItem> = new Map<string, NpcItem>();

    // the npc name only in `NPCNameList`(npc name) but not in `NPCName`(named npc data)
    // it must not have data
    // when the data is ready, it must be removed
    protected npcNamePlaceholder: string[] = [];

    cleanAll() {
        this.nextId = 0;
        this.npc.clear();
        this.npcIndex.clear();
        this.npcList = [];
        this.npcAlias.clear();
        this.npcNamePlaceholder = [];
        this.gid = genRandomHex(NpcProxyManagerCoreGidLength);
        this.checkDataValid();
    }

    public checkDataValid() {
        // check `this.npc` / `this.npcIndex` / `this.npcList` is same , and `this.npcList` is sorted by `NpcItem.index`
        if (this.npc.size !== this.npcIndex.size || this.npc.size !== this.npcList.length) {
            console.error(`[NpcProxyManager] checkDataValid failed! size not same.`, [this.npc, this.npcIndex, this.npcList]);
            this.logger.error(`[NpcProxyManager] checkDataValid failed! size not same.`);
            return false;
        }
        // check is sorted
        if (!this.npcList.every((T, i) => T.index === i)) {
            console.error(`[NpcProxyManager] checkDataValid failed! npcList not sorted.`, [this.npcList]);
            this.logger.error(`[NpcProxyManager] checkDataValid failed! npcList not sorted.`);
            return false;
        }
        for (const npcItem of this.npcList) {
            if (npcItem.index !== this.npcIndex.get(npcItem.index)?.index) {
                console.error(`[NpcProxyManager] checkDataValid failed! npcIndex index not same.`, [npcItem, this.npcIndex.get(npcItem.index)]);
                this.logger.error(`[NpcProxyManager] checkDataValid failed! npcIndex index not same.`);
                return false;
            }
            if (npcItem.name !== this.npc.get(npcItem.name)?.name) {
                console.error(`[NpcProxyManager] checkDataValid failed! npc name not same.`, [npcItem, this.npc.get(npcItem.name)]);
                this.logger.error(`[NpcProxyManager] checkDataValid failed! npc name not same.`);
                return false;
            }
            // is same object ref
            if (npcItem.npcInfo !== this.npcIndex.get(npcItem.index)?.npcInfo) {
                console.error(`[NpcProxyManager] checkDataValid failed! npcIndex npcInfo not same.`, [npcItem, this.npc.get(npcItem.name)]);
                this.logger.error(`[NpcProxyManager] checkDataValid failed! npcIndex npcInfo not same.`);
                return false;
            }
            if (npcItem.npcInfo !== this.npc.get(npcItem.name)?.npcInfo) {
                console.error(`[NpcProxyManager] checkDataValid failed! npc npcInfo not same.`, [npcItem, this.npc.get(npcItem.name)]);
                this.logger.error(`[NpcProxyManager] checkDataValid failed! npc npcInfo not same.`);
                return false;
            }
        }
        // check addAlias
        for (const [alias, npcItem] of this.npcAlias) {
            if (!npcItem.alias.includes(alias)) {
                console.error(`[NpcProxyManager] checkDataValid failed! npcAlias not same.`, [alias, npcItem]);
                this.logger.error(`[NpcProxyManager] checkDataValid failed! npcAlias not same.`);
                return false;
            }
        }
        for (const npcItem of this.npcList) {
            for (const alias of npcItem.alias) {
                if (this.npcAlias.get(alias) !== npcItem) {
                    console.error(`[NpcProxyManager] checkDataValid failed! npcAlias not same.`, [alias, npcItem]);
                    this.logger.error(`[NpcProxyManager] checkDataValid failed! npcAlias not same.`);
                    return false;
                }
            }
        }
        // check npcNamePlaceholder must not have data
        for (const nn of this.npcNamePlaceholder) {
            if (this.npc.has(nn) || this.npcAlias.has(nn)) {
                console.error(`[NpcProxyManager] checkDataValid failed! npcNamePlaceholder has data.`, [nn]);
                this.logger.error(`[NpcProxyManager] checkDataValid failed! npcNamePlaceholder has data.`);
                return false;
            }
        }
        return true;
    }

    /**
     *
     * @param key get by `NpcItem.name` or `NpcItem.index`
     */
    public getNpcItemRef(key: string | number): NpcItem | undefined {
        if (isString(key)) {
            return this.npc.get(key) || this.npcAlias.get(key);
        }
        if (isNumber(key)) {
            return this.npcIndex.get(key);
        }
        return undefined;
    }

    /**
     * change a item in-place
     * @param k  the `NpcItem.name` or `NpcItem.index`
     * @param npcInfo
     */
    public set(k: string | number, npcInfo: NpcInfo) {
        this.checkDataValid();
        if (this.has(k)) {
            const npcItem = this.getNpcItemRef(k)!;
            npcItem.npcInfo = npcInfo;
            // this.npc.set(npcItem.name, npcItem);
            // this.npcIndex.set(npcItem.index, npcItem);
            // this.npcList.splice(this.npcList.findIndex(T => T.name === npcItem.name), 1, npcItem);
            // for (const alias of npcItem.alias) {
            //     this.npcAlias.set(alias, npcItem);
            // }
            this.checkDataValid();
            return;
        }
        console.error(`[NpcProxyManager] set npc[${k}] not found!`, [k, npcInfo]);
    }

    /**
     * add at back
     * @param npcInfo
     */
    public add(npcInfo: NpcInfo) {
        this.push(npcInfo);
    }

    public addAlias(npcK: string | number, alias: string) {
        this.checkDataValid();
        const npcItem = this.getNpcItemRef(npcK);
        if (isNil(npcItem)) {
            console.error(`[NpcProxyManager] addAlias npc[${npcK}] not found!`, [npcK, alias]);
            this.logger.error(`[NpcProxyManager] addAlias npc[${npcK}] not found!`);
            return;
        }
        if (!npcItem.alias.includes(alias)) {
            npcItem.alias.push(alias);
            this.npcAlias.set(alias, npcItem);
            if (this.npcNamePlaceholder.find(T => T === alias)) {
                this.npcNamePlaceholder.splice(this.npcNamePlaceholder.findIndex(T => T === alias), 1);
            }
        }
        this.checkDataValid();
    }

    /**
     * pop_back
     */
    public pop() {
        this.checkDataValid();
        const npcItem = this.npcList.pop();
        if (isNil(npcItem)) {
            console.error(`[NpcProxyManager] pop npc failed!`, [npcItem]);
            this.logger.error(`[NpcProxyManager] pop npc failed!`);
            return undefined;
        }
        this.npc.delete(npcItem.name);
        this.npcIndex.delete(npcItem.index);
        for (const alias of npcItem.alias) {
            this.npcAlias.delete(alias);
        }
        this.checkDataValid();
        return npcItem;
    }

    /**
     * push_back
     * @param npcInfo
     */
    public push(npcInfo: NpcInfo) {
        this.checkDataValid();
        if (this.npc.has(npcInfo.nam)) {
            console.error(`[NpcProxyManager] push npc[${npcInfo.nam}] already exists!`, [npcInfo]);
            this.logger.error(`[NpcProxyManager] push npc[${npcInfo.nam}] already exists!`);
            return;
        }
        const npcItem: NpcItem = {
            index: this.nextId++,
            name: npcInfo.nam,
            npcInfo: npcInfo,
            alias: [],
        };
        this.npc.set(npcItem.name, npcItem);
        this.npcIndex.set(npcItem.index, npcItem);
        this.npcList.push(npcItem);
        if (this.npcNamePlaceholder.find(T => T === npcItem.name)) {
            this.npcNamePlaceholder.splice(this.npcNamePlaceholder.findIndex(T => T === npcItem.name), 1);
        }
        this.checkDataValid();
    }

    public readList(): ReadonlyArray<NpcItem> {
        return this.npcList;
    }

    public get size(): number {
        return this.npc.size;
    }

    public get length(): number {
        return this.npc.size;
    }

    entriesName(): IterableIterator<[string, NpcInfo]> {
        return new CustomIterableIterator<[string, NpcInfo], typeof this, NpcItem[]>(
            this,
            (index, p, ito) => {
                if (index >= ito.cache.length) {
                    return {
                        done: true,
                        value: undefined,
                    };
                } else {
                    const n = ito.cache[index];
                    return {
                        done: index >= ito.cache.length,
                        value: [n.name, n.npcInfo],
                    };
                }
            },
            this.npcList,
        );
    }

    entriesIndex(): IterableIterator<[number, NpcInfo]> {
        return this.entries();
    }

    public entries(): IterableIterator<[number, NpcInfo]> {
        return this.npcList.map(T => T.npcInfo).entries();
    }

    /**
     *
     * @param key get by `NpcItem.name` or `NpcItem.index`
     */
    public get(key: string | number): NpcInfo | undefined {
        if (isString(key)) {
            return this.npc.get(key)?.npcInfo || this.npcAlias.get(key)?.npcInfo;
        }
        if (isNumber(key)) {
            return this.npcIndex.get(key)?.npcInfo;
        }
        return undefined;
    }

    /**
     *
     * @param key get by `NpcItem.name` or `NpcItem.index`
     */
    public has(key: string | number): boolean {
        if (isString(key)) {
            return this.npc.has(key) || this.npcAlias.has(key);
        }
        if (isNumber(key)) {
            return this.npcIndex.has(key);
        }
        return false;
    }


}

export abstract class NpcProxyManagerCoreExFunction extends NpcProxyManagerCore {

    /**
     * use the npcList index to re calc index data
     * only by npcList
     */
    reCalcOrder() {
        if (this.npcList.every((T, i) => T.index === i)) {
            // all ok
            return false;
        }
        const arr = clone(this.npcList);
        arr.sort((a, b) => a.index - b.index);
        arr.forEach((T, i) => {
            T.index = i;
        });
        this.cleanAll();
        arr.forEach(T => {
            this.push(T.npcInfo);
        });
        this.checkDataValid();
        return true;
    }

    /**
     *
     * @param index list of index need to be deleted
     * @return deleted items
     */
    deleteByIndex(index: number[]) {
        const rm: NpcItem[] = [];
        const ls: NpcItem[] = [];
        for (const n of this.npcList) {
            if (index.includes(n.index)) {
                rm.push(n);
            } else {
                ls.push(n);
            }
        }
        this.npcList = ls;
        this.reCalcOrder();
        this.checkDataValid();
        return rm;
    }

    /**
     *
     * @param v list items need to be deleted, the item must be the same ref of target
     * @return deleted items
     */
    deleteByValue(v: NpcInfo[]) {
        const rm: NpcItem[] = [];
        const ls: NpcItem[] = [];
        for (const n of this.npcList) {
            if (v.includes(n.npcInfo)) {
                rm.push(n);
            } else {
                ls.push(n);
            }
        }
        this.npcList = ls;
        this.reCalcOrder();
        this.checkDataValid();
        return rm;
    }

    /**
     *
     * @param s list of name need to be deleted
     * @return deleted items
     */
    deleteByName(s: string[]) {
        const rm: NpcItem[] = [];
        const ls: NpcItem[] = [];
        for (const T of this.npcList) {
            if (
                !s.includes(T.name) && !T.alias.find(N => s.includes(N))
            ) {
                ls.push(T);
            } else {
                rm.push(T);
            }
        }
        this.npcList = ls;
        this.reCalcOrder();
        this.checkDataValid();
        return rm;
    }

    push_front_many(npcInfo: NpcInfo[]) {
        this.checkDataValid();
        const nnn = npcInfo.filter(T => {
            if (this.npc.has(T.nam)) {
                console.error(`[NpcProxyManager] push_front npc[${T.nam}] already exists!`, [T]);
                this.logger.error(`[NpcProxyManager] push_front npc[${T.nam}] already exists!`);
                return false;
            }
            return true;
        }).map((T, i) => {
            if (this.npcNamePlaceholder.find(N => N === T.nam)) {
                this.npcNamePlaceholder.splice(this.npcNamePlaceholder.findIndex(N => N === T.nam), 1);
            }
            return {
                index: i,
                name: T.nam,
                npcInfo: T,
                alias: [],
            };
        });
        this.npcList.forEach(T => T.index += nnn.length);
        this.npcList.unshift(...nnn);
        this.reCalcOrder();
        this.checkDataValid();
    }

    push_front(npcInfo: NpcInfo) {
        this.checkDataValid();
        if (this.npc.has(npcInfo.nam)) {
            console.error(`[NpcProxyManager] push_front npc[${npcInfo.nam}] already exists!`, [npcInfo]);
            this.logger.error(`[NpcProxyManager] push_front npc[${npcInfo.nam}] already exists!`);
            return;
        }
        const npcItem: NpcItem = {
            index: 0,
            name: npcInfo.nam,
            npcInfo: npcInfo,
            alias: [],
        };
        this.npcList.forEach(T => ++T.index);
        this.npcList.unshift(npcItem);
        if (this.npcNamePlaceholder.find(T => T === npcItem.name)) {
            this.npcNamePlaceholder.splice(this.npcNamePlaceholder.findIndex(T => T === npcItem.name), 1);
        }
        this.reCalcOrder();
        this.checkDataValid();
    }

    pop_front() {
        this.checkDataValid();
        this.npcList.forEach(T => T.index);
        this.npcList.shift();
        this.reCalcOrder();
        this.checkDataValid();
    }

}

export class NpcProxyManager extends NpcProxyManagerCoreExFunction {
    protected logger: LogWrapper;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        super();
        this.logger = gModUtils.getLogger();
    }

    reset(
        NPCName: NpcInfo[],
        NPCNameList: string[],
    ) {
        this.cleanAll();
        for (const npcInfo of NPCName) {
            this.push(npcInfo);
        }
        for (const [i, n] of this) {
            if (NPCNameList[i] !== n.nam) {
                console.error(`[NpcProxyManager] reset failed! NPCNameList[${i}] !== NPCName[${i}].nam`, [NPCNameList[i], n.nam]);
                this.logger.error(`[NpcProxyManager] reset failed! NPCNameList[${i}] !== NPCName[${i}].nam`);
            }
            if (NPCName[i] !== n) {
                console.error(`[NpcProxyManager] reset failed! NPCName[${i}] !== NPCName[${i}]`, [NPCName[i], n]);
                this.logger.error(`[NpcProxyManager] reset failed! NPCName[${i}] !== NPCName[${i}]`);
            }
        }
        for (const T of this.readList()) {
            if (NPCNameList[T.index] !== T.name) {
                console.error(`[NpcProxyManager] reset failed! NPCNameList[${T.index}] !== NPCName[${T.index}].nam`, [NPCNameList[T.index], T, T.name]);
                this.logger.error(`[NpcProxyManager] reset failed! NPCNameList[${T.index}] !== NPCName[${T.index}].nam`);
            }
            if (NPCName[T.index] !== T.npcInfo) {
                console.error(`[NpcProxyManager] reset failed! NPCName[${T.index}] !== NPCName[${T.index}]`, [NPCName[T.index], T, T.npcInfo]);
                this.logger.error(`[NpcProxyManager] reset failed! NPCName[${T.index}] !== NPCName[${T.index}]`);
            }
        }
    }

}
