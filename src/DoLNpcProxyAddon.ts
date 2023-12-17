import JSZip from "jszip";
import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type {ModBootJson, ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {isArray, isNil, isNumber, isString} from 'lodash';
import {NpcProxyManager} from "./NpcProxyManager";
import {NpcListProxy, NpcListProxyWithSc2Polyfill} from "./NpcListProxy";
import {NpcFastAccessor} from "./NpcFastAccessor";
import {NpcNameListProxy, NpcNameListProxyWithSc2Polyfill} from "./NpcNameListProxy";

export class DoLNpcProxyAddon {
    private logger: LogWrapper;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        this.logger = gModUtils.getLogger();
        this.npcProxyManager = new NpcProxyManager(gSC2DataManager, gModUtils);
        this.npcListProxy = new NpcListProxyWithSc2Polyfill(this.npcProxyManager);
        this.npcNameListProxy = new NpcNameListProxyWithSc2Polyfill(this.npcProxyManager);
        this.npcFastAccessor = new NpcFastAccessor(this.npcProxyManager);
    }

    npcProxyManager: NpcProxyManager;
    npcListProxy: NpcListProxyWithSc2Polyfill;
    npcNameListProxy: NpcNameListProxyWithSc2Polyfill;
    npcFastAccessor: NpcFastAccessor;

    setupProxy() {
        if (isNil(window.V)) {
            console.error('[DoLNpcProxyAddon] setupProxy() window.V is nil. maybe SugarCube not init.');
            return;
        }
        if (isNil(window.V.NPCName) || isNil(window.V.NPCNameList)) {
            console.error('[DoLNpcProxyAddon] setupProxy() window.V.NPCName or window.V.NPCNameList is nil. maybe Game not init end.');
            return;
        }
        if (
            (window.V.NPCName as NpcListProxy)?.tag === 'NpcListProxyTag' &&
            (window.V.NPCNameList as NpcNameListProxy)?.tag === 'NpcNameListProxyTag' &&
            !isNil(window.V.npcs) && window.V.npcs.tag === 'NpcFastAccessorTag' &&
            // to check it is the same gid, avoid it is recovered from save file
            (window.V.NPCName as NpcListProxy).gui === this.npcProxyManager.gid &&
            (window.V.NPCNameList as NpcNameListProxy).gui === this.npcProxyManager.gid &&
            (window.V.npcs as NpcFastAccessor).gui === this.npcProxyManager.gid
        ) {
            // was setup ok
            return;
        }

        console.log('[DoLNpcProxyAddon] setupProxy()', [window.V.NPCName, window.V.NPCNameList, window.V.npcs]);

        // use V.NPCNameList, V.NPCName to reset this.npcProxyManager
        this.npcProxyManager.reset(
            window.V.NPCName,
            window.V.NPCNameList
        );

        // set the V.NPCNameList, V.NPCName

        window.V.NPCName = this.npcListProxy;
        window.V.NPCNameList = this.npcNameListProxy;
        window.V.npcs = this.npcFastAccessor;
        // window.C.npc = this.npcFastAccessor;
    }

    beforeFirstPassageInit() {

    }

    init() {
        window.npcProxyManager = this.npcProxyManager;
    }

}


// /* simple alias C.npc.Robin => V.NPCName[V.NPCNameList.indexOf("Robin")]
//  * `C.npc.Black Hawk` won't work however, use `C.npc["Great Wolf"]` instead
//  * run this after V.NPCName exists */
// function initCNPC() {
//     C.npc = {};
//     for (const name of setup.NPCNameList) {
//         Object.defineProperty(C.npc, name, {
//             get() {
//                 return V.NPCName[setup.NPCNameList.indexOf(name)];
//             },
//             set(val) {
//                 V.NPCName[setup.NPCNameList.indexOf(name)] = val;
//             },
//         });
//     }
// }
// window.initCNPC = initCNPC;

