import {NpcProxyManager} from "./NpcProxyManager";
import {NpcInfo} from "./winDef";
import {isNaN, isNumber, isSafeInteger, isString, parseInt} from "lodash";

export interface NpcFastAccessorInterface {
    // 声明当前对象为 object like
    [n: string]: NpcInfo | undefined;

    // 声明当前对象为 array like
    [n: number]: NpcInfo | undefined;

    // other flag
    [n: symbol]: any | undefined;
}

class NpcFastAccessorBase {
    tag: string = "NpcFastAccessorTag";
    protected thisProxy!: NpcFastAccessor;

    get gui() {
        return this.m.gid;
    }

    set gui(value) {
        return; // ignore it
    }

    constructor(
        protected m: NpcProxyManager,
    ) {
    }
}

// export interface NpcFastAccessor {
//     // 声明当前对象为 object like
//     [n: string]: NpcInfo | undefined;
//
//     // 声明当前对象为 array like
//     [n: number]: NpcInfo | undefined;
//
//     // other flag
//     [n: symbol]: any | undefined;
// }

type ExcludeKeys = 'm' | 'toJSON' | 'tag' | 'thisProxy' | 'gui';

type OtherProperties = {
    [key in Exclude<string, ExcludeKeys>]?: NpcInfo;
};

interface SpecialProperties extends NpcFastAccessorBase {

}

// 结合两种属性
type MyClassProperties = OtherProperties & SpecialProperties;


// @ts-ignore
export class NpcFastAccessor extends NpcFastAccessorBase implements MyClassProperties {
    // 声明当前对象为 object like
    // [n in Exclude<string, 'm' | 'toJSON' | 'tag' | 'thisProxy' | 'gui'>]: NpcInfo | undefined;
    // [n: ('a' | 'b' | 'c')]: any;
    // 使用条件类型排除特定的键
    // [n in string]: n extends ExcludeKeys ? any : NpcInfo | undefined;
    // @ts-ignore
    [key: string]: NpcInfo | undefined;

    // 声明当前对象为 array like
    [n: number]: NpcInfo | undefined;

    // other flag
    [n: symbol]: any | undefined;

    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
        this.thisProxy = new Proxy(this, {
            // @ts-ignore
            get: (target, prop: keyof NpcFastAccessor | symbol, receiver) => {
                if (isString(prop)) {
                    const index = parseInt(prop);
                    if (!isNaN(index)) {
                        return this.m.get(index);
                    } else {
                        const r = this.m.get(prop);
                        if (r) {
                            return r;
                        }
                    }
                }
                // other [symbol]
                return target[prop as keyof NpcFastAccessor];
            },
            // @ts-ignore
            set: (target, prop: keyof NpcFastAccessor | symbol, value) => {
                if (isString(prop)) {
                    const index = parseInt(prop);
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
                        } else {
                            this.m.set(prop, value);
                        }
                    }
                }
                // other [symbol]
                target[prop as keyof NpcFastAccessor] = value;
                return true;
            }
        });
        return this.thisProxy;
    }

}

export class NpcFastAccessorEx extends NpcFastAccessor {

    // used by js when JSON.stringify()
    // @ts-ignore
    toJSON() {
        const obj: { [k: string]: NpcInfo } = {};
        for (const [name, npc] of this.m.entriesName()) {
            obj[name] = npc;
        }
        return obj;
    }
}
