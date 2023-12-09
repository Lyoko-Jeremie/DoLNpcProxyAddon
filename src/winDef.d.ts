import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import type jQuery from "jquery/misc";

interface NpcInfo {
    name: string;

    "penis": "none",
    "vagina": "clothed",
    "gender": "f",
    "description": "Sydney",
    "title": "faithful",
    "insecurity": "skill",
    "pronoun": "f",
    "penissize": 0,
    "penisdesc": "none",
    "bottomsize": 0,
    "ballssize": 0,
    "breastsize": 8,
    "breastdesc": "丰腴的乳房",
    "breastsdesc": "丰腴的乳房",
    "skincolour": "white",
    "teen": 1,
    "adult": 0,
    "init": 0,
    "intro": 0,
    "type": "human",
    "trust": 0,
    "love": 0,
    "dom": 0,
    "lust": 0,
    "rage": 0,
    "state": "",
    "trauma": 0,
    "eyeColour": "amber",
    "hairColour": "strawberryblond",
    "chastity": { "penis": "", "vagina": "", "anus": "" },
    "nam": "Sydney",
    "purity": 0,
    "corruption": 0,
    "pregnancy": {},
    "pregnancyAvoidance": 100,
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
        "he": "她",
        "his": "她",
        "hers": "她",
        "him": "她",
        "himself": "她自己",
        "man": "女人",
        "boy": "女孩",
        "men": "女人们"
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

declare global {
    interface Window {
        modUtils: ModUtils;
        modSC2DataManager: SC2DataManager;

        jQuery: jQuery;

        modDoLNpcProxyAddon: DoLNpcProxyAddon;

        SugarCube: SugarCube;
    }
}
