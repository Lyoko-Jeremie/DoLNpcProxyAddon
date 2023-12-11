import {expect, assert, should} from 'chai';
import {it, describe} from 'mocha';
import {NpcProxyManagerCore} from '../src/NpcProxyManager';
import {NpcListProxy} from '../src/NpcListProxy';

import type {LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {NpcInfo} from "../src/winDef";
import * as console from "console";

class ConsoleLogger {
    logList: { t: 'log' | 'warn' | 'err', m: string }[] = [];

    log(s: string) {
        this.logList.push({t: 'log', m: s});
        console.log(s);
    }

    warn(s: string) {
        this.logList.push({t: 'warn', m: s});
        console.warn(s);
    }

    error(s: string) {
        this.logList.push({t: 'err', m: s});
        console.error(s);
    }
}

class NpcProxyManagerTest extends NpcProxyManagerCore {
    public logger: LogWrapper;

    constructor() {
        super();
        this.logger = new ConsoleLogger();
    }
}

function createNpcInfo(name: string) {
    return {
        nam: name,
    } as NpcInfo;
}

describe('NpcProxyManagerTest', function () {
    describe('NpcProxyManagerTest base', function () {

        it('can init', function () {
            const a = new NpcProxyManagerTest();
        });

        it('can checkDataValid', function () {
            const a = new NpcProxyManagerTest();
            expect(a.checkDataValid()).to.be.true;
        });

        it('can add', function () {
            const a = new NpcProxyManagerTest();

            a.add(createNpcInfo("a"));

            expect(a.checkDataValid()).to.be.true;

            a.add(createNpcInfo("b"));

            expect(a.checkDataValid()).to.be.true;

            expect(a.size).to.be.equal(2);

            expect(a.get(0) === a.get("a")).to.be.true;
            expect(a.get(1) === a.get("b")).to.be.true;
            expect(a.get("a") !== a.get("b")).to.be.true;

            expect(a.get("0")).to.be.undefined;
            expect(a.get("1")).to.be.undefined;
        });

        it('can add duplicate need silently ignore, but make error log', function () {
            const a = new NpcProxyManagerTest();

            a.add(createNpcInfo("a"));

            expect(a.checkDataValid()).to.be.true;

            a.add(createNpcInfo("a"));

            expect(a.checkDataValid()).to.be.true;

            expect(a.size).to.be.equal(1);

            expect((a.logger as ConsoleLogger).logList.find(
                v => v.t === 'err' && v.m.includes("already exists"))
            ).to.be.not.undefined;

        });

        it('can addAlias', function () {
            const a = new NpcProxyManagerTest();

            a.add(createNpcInfo("a"));

            expect(a.checkDataValid()).to.be.true;

            expect(a.size).to.be.equal(1);

            a.addAlias("a", "b");

            expect(a.checkDataValid()).to.be.true;

            expect(a.size).to.be.equal(1);

            let ra = a.get("a");
            expect(ra).to.be.not.undefined;
            expect(ra).to.be.deep.equal({nam: "a"});
            ra = a.get("b");
            expect(ra).to.be.not.undefined;
            expect(ra).to.be.deep.equal({nam: "a"});
            ra = a.get(0);
            expect(ra).to.be.not.undefined;
            expect(ra).to.be.deep.equal({nam: "a"});

            expect(a.get(0) === a.get("a")).to.be.true;
            expect(a.get("a") === a.get("b")).to.be.true;

            expect(a.get("0")).to.be.undefined;
        });

    });
});
