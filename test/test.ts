import {expect, assert, should} from 'chai';
import {it, describe} from 'mocha';
import {NpcItem, NpcProxyManager, NpcProxyManagerCore} from '../src/NpcProxyManager';
import {NpcListProxy, NpcListReadOnlyProxy} from '../src/NpcListProxy';

import type {LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {NpcInfo} from "../src/winDef";
import * as console from "console";

// https://mochajs.org/#-require-module-r-module
// --require ts-node/register

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

/**
 * NpcProxyManager like mook
 */
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

        it('can Array.from entries/entriesName', function () {
            const a = new NpcProxyManagerTest();

            a.add(createNpcInfo("a"));
            a.add(createNpcInfo("b"));

            expect(Array.from(a.entries())).to.deep.equal([
                [0, {nam: "a"}],
                [1, {nam: "b"}],
            ]);
            expect(Array.from(a.entriesName())).to.deep.equal([
                ["a", {nam: "a"}],
                ["b", {nam: "b"}],
            ]);

        });

        it('can getNpcItemRef', function () {
            const a = new NpcProxyManagerTest();

            a.add(createNpcInfo("a"));

            expect(a.checkDataValid()).to.be.true;

            a.add(createNpcInfo("b"));

            expect(a.checkDataValid()).to.be.true;

            expect(a.size).to.be.equal(2);

            expect(a.getNpcItemRef(0)).to.be.deep.equal({
                name: "a",
                index: 0,
                alias: [],
                npcInfo: {
                    nam: "a",
                } as NpcInfo,
            } as NpcItem);
            expect(a.getNpcItemRef(1)).to.be.deep.equal({
                name: "b",
                index: 1,
                alias: [],
                npcInfo: {
                    nam: "b",
                } as NpcInfo,
            } as NpcItem);
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


    describe('NpcProxyManagerTest NpcListReadOnlyProxy', function () {

        let a: NpcProxyManager;
        let l: ReadonlyArray<NpcInfo>;
        beforeEach(function () {
            a = new NpcProxyManagerTest() as unknown as NpcProxyManager;

            a.add(createNpcInfo("a"));
            expect(a.checkDataValid()).to.be.true;
            a.add(createNpcInfo("b"));
            expect(a.checkDataValid()).to.be.true;

            // l = new NpcListReadOnlyProxy(a);
            l = new NpcListProxy(a);
        });

        it('can base array index', function () {

            // console.log(a)
            // console.log(l)
            // console.log((l as any).m.size)

            expect(l.length).to.be.equal(2);
            expect(l.at(0)).to.be.deep.equal({nam: "a"});
            expect(l.at(1)).to.be.deep.equal({nam: "b"});
            expect(l.at(2)).to.be.undefined;
            expect(l[0]).to.be.deep.equal({nam: "a"});
            expect(l[1]).to.be.deep.equal({nam: "b"});
            expect(l[2]).to.be.undefined;

        });

        it('can array function', function () {

            expect(Array.from(l.entries())).to.deep.equal([
                [0, {nam: "a"}],
                [1, {nam: "b"}],
            ]);

            expect(l.filter(T => T.nam === 'a')).to.deep.equal([{nam: "a"},]);
            expect(l.find(T => T.nam === 'a')).to.deep.equal({nam: "a"});
            expect(l.findIndex(T => T.nam === 'a')).to.be.equal(0);
            l.forEach((v, i) => {
                expect(v).to.be.deep.equal({nam: i === 0 ? "a" : "b"});
            });

        });

        it('can array push pop', function () {
            const ll = l as NpcInfo[];

            expect(ll.length).to.be.equal(2);

            ll.push(
                createNpcInfo("c"),
                createNpcInfo("d"),
                createNpcInfo("e"),
            );
            expect(ll.length).to.be.equal(2 + 3);
            expect(ll.at(2)).to.be.deep.equal({nam: "c"});
            expect(ll.at(3)).to.be.deep.equal({nam: "d"});
            expect(ll.at(4)).to.be.deep.equal({nam: "e"});

            ll.pop();
            ll.pop();
            ll.pop();
            expect(ll.length).to.be.equal(2);
            expect(ll.at(2)).to.be.undefined;

        });

        it('cannot push duplicate', function () {
            const ll = l as NpcInfo[];

            expect(ll.length).to.be.equal(2);

            ll.push(
                createNpcInfo("c"),
                createNpcInfo("c"),
            );
            ll.push(
                createNpcInfo("c"),
            );
            expect(ll.length).to.be.equal(2 + 1);
            expect(ll.at(2)).to.be.deep.equal({nam: "c"});

            ll.pop();
            expect(ll.length).to.be.equal(2);
            expect(ll.at(2)).to.be.undefined;

        });

    });

});

