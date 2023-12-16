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

    constructor(
        protected m: NpcProxyManager,
    ) {
    }
}

// @ts-ignore
export class NpcFastAccessor extends NpcFastAccessorBase implements NpcFastAccessorInterface {

    constructor(
        m: NpcProxyManager,
    ) {
        super(m);
        this.thisProxy = new Proxy(this, {
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

