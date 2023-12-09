import type {LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import {isArray, isNil, isNumber, isString} from 'lodash';
import {NpcInfo} from "./winDef";
import {CustomReadonlyMapHelper} from "./CustomReadonlyMapHelper";


export interface NpcItem {
    index: number,
    name: string,
    npcInfo: NpcInfo,
}

export abstract class NpcProxyManagerCore extends CustomReadonlyMapHelper<number, NpcInfo> {
    protected abstract logger: LogWrapper;

    private nextId = 0;

    private npc: Map<string, NpcItem> = new Map<string, NpcItem>();
    private npcIndex: Map<number, NpcItem> = new Map<number, NpcItem>();
    private npcList: NpcItem[] = [];

    getNpcItemRef(key: string | number): NpcItem | undefined {
        if (isString(key)) {
            return this.npc.get(key);
        }
        if (isNumber(key)) {
            return this.npcIndex.get(key);
        }
        return undefined;
    }

    set(k: string | number, npcInfo: NpcInfo) {
        if (this.has(k)) {
            const npcItem = this.getNpcItemRef(k)!;
            this.npc.set(npcItem.name, npcItem);
            this.npcIndex.set(npcItem.index, npcItem);
            this.npcList.splice(this.npcList.findIndex(T => T.name === npcItem.name), 1, npcItem);
            return;
        }
        console.error(`[NpcProxyManager] set npc[${k}] not found!`, [k, npcInfo]);
    }

    push(npcInfo: NpcInfo) {
        if (this.npc.has(npcInfo.nam)) {
            console.error(`[NpcProxyManager] push npc[${npcInfo.nam}] already exists!`, [npcInfo]);
            this.logger.error(`[NpcProxyManager] push npc[${npcInfo.nam}] already exists!`);
            return;
        }
        const npcItem: NpcItem = {
            index: this.nextId++,
            name: npcInfo.nam,
            npcInfo: npcInfo,
        };
        this.npc.set(npcItem.name, npcItem);
        this.npcIndex.set(npcItem.index, npcItem);
        this.npcList.push(npcItem);
    }

    readList(): ReadonlyArray<NpcItem> {
        return this.npcList;
    }

    get size(): number {
        return this.npc.size;
    }

    entriesIndex(): IterableIterator<[number, NpcInfo]> {
        return this.npcList.map(T => T.npcInfo).entries();
    }

    entries(): IterableIterator<[number, NpcInfo]> {
        return this.npcList.map(T => T.npcInfo).entries();
    }

    get(key: string | number): NpcInfo | undefined {
        if (isString(key)) {
            return this.npc.get(key)?.npcInfo;
        }
        if (isNumber(key)) {
            return this.npcIndex.get(key)?.npcInfo;
        }
        return undefined;
    }

    has(key: string | number): boolean {
        if (isString(key)) {
            return this.npc.has(key);
        }
        if (isNumber(key)) {
            return this.npcIndex.has(key);
        }
        return false;
    }


}

export class NpcProxyManager extends NpcProxyManagerCore {
    protected logger: LogWrapper;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        super();
        this.logger = gModUtils.getLogger();
    }

    // TODO init

}

