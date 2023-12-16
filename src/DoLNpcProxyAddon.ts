import JSZip from "jszip";
import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type {ModBootJson, ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {isArray, isNil, isNumber, isString} from 'lodash';
import {NpcProxyManager} from "./NpcProxyManager";
import {NpcListProxy} from "./NpcListProxy";
import {NpcFastAccessor} from "./NpcFastAccessor";

export class DoLNpcProxyAddon {
    private logger: LogWrapper;

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        this.logger = gModUtils.getLogger();
        this.npcProxyManager = new NpcProxyManager(gSC2DataManager, gModUtils);
        this.npcListProxy = new NpcListProxy(this.npcProxyManager);
        this.npcFastAccessor = new NpcFastAccessor(this.npcProxyManager);
    }

    npcProxyManager: NpcProxyManager;
    npcListProxy: NpcListProxy;
    npcFastAccessor: NpcFastAccessor;

    init() {
        window.npcProxyManager = this.npcProxyManager;
    }
}
