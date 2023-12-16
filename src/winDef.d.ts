import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type jQuery from "jquery/misc";
import {NpcProxyManager} from "./NpcProxyManager";
import {NpcFastAccessor} from "./NpcFastAccessor";

interface NpcInfo {
    name: string;

    "penis": string,
    "vagina": string,
    "gender": "f" | "m",
    "description": string,
    "title": string,
    "insecurity": string,
    "pronoun": "f" | "m",
    "penissize": number,
    "penisdesc": string,
    "bottomsize": number,
    "ballssize": number,
    "breastsize": number,
    "breastdesc": string,
    "breastsdesc": string,
    "skincolour": string,
    "teen": number,
    "adult": number,
    "init": number,
    "intro": number,
    "type": "human",
    "trust": number,
    "love": number,
    "dom": number,
    "lust": number,
    "rage": number,
    "state": "",
    "trauma": number,
    "eyeColour": string,
    "hairColour": string,
    "chastity": {
        "penis": "",
        "vagina": "",
        "anus": ""
    },
    "nam": string,
    "purity": number,
    "corruption": number,
    "pregnancy": {},
    "pregnancyAvoidance": number,
    "virginity": {
        "anal": true,
        "oral": true,
        "penile": true,
        "vaginal": true,
        "handholding": true,
        "temple": true,
        "kiss": true
    },
    "sextoys": {},
    "pronouns": {
        "he": string,
        "his": string,
        "hers": string,
        "him": string,
        "himself": string,
        "man": string,
        "boy": string,
        "men": string,
    }
}

interface SugarCube {
    State: {
        active: {
            variables: {
                NPCName: NpcInfo[];
                NPCNameList: string[];
            }
        }
    }
    setup: {
        NPCNameList: string[];
    }
}

interface V {
    NPCName: NpcInfo[];
    NPCNameList: string[];
}

interface V {
    npcs: NpcFastAccessor;
}

declare global {
    interface Window {
        modUtils: ModUtils;
        modSC2DataManager: SC2DataManager;

        jQuery: jQuery;

        modDoLNpcProxyAddon: DoLNpcProxyAddon;
        npcProxyManager: NpcProxyManager;

        SugarCube: SugarCube;

        V: V;
    }
}
