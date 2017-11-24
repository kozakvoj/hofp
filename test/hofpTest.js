"use strict";

const describe = require("mocha").describe;
const assert = require("assert");
const it = require("mocha").it;
const P = require('bluebird');
const H = require('../index');
const R = require('ramda');
const sleep = require('sleep-promise');

describe("filter", () => {

    const conditionReturningPromise = value =>
        P.resolve().then(() => value === "a" || value === "c");

    it("should filter values using promise as condition", () =>
        H.filter(conditionReturningPromise, ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["a", "c"]))
    );
});

describe("reject", () => {

    const conditionReturningPromise = value =>
        P.resolve().then(() => value === "a" || value === "c");

    it("should reject values using promise as condition", () =>
        H.reject(conditionReturningPromise, ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["b", "d", "e"]))
    );
});

describe("map", () => {

    const mapFunction = value => P.resolve().then(() => value * value);

    const sleepAndReturn = async val => {
        await sleep(val);
        return val;
    };

    it("should map values using promise as map function", () =>
        H.map(mapFunction, [1, 2, 3])
            .then(result => assert.deepEqual(result, [1, 4, 9]))
    );

    it("should work together with ramda", () =>
        P.resolve([1, 2, 3, 4])
            .then(R.map(value => value * value))
            .then(R.curry(H.map)(mapFunction))
            .then(R.filter(n => n % 2 === 0))
            .then(result => assert.deepEqual(result, [16, 256]))
    );

    it("should work sequentially", () =>
        H.map(sleepAndReturn, [10, 5, 1])
            .then(result => assert.deepEqual(result, [10, 5, 1]))
    );
});

describe("parallelLimit", () => {
    it("should return correct result", () => {
        const fce = nr => P.resolve(nr).delay(200);
        return H.parallelLimit(fce, [11, 12, 21, 22, 31, 32], 2)
            .then(result => assert.deepEqual(result, [11, 12, 21, 22, 31, 32]))
    });
});

describe("pipe", () => {
    it("should return correct result", async () => {
        const fce1 = values => P.resolve().then(() => H.map(it => it * 2, values)).delay(200);
        const fce2 = values => P.resolve().then(() => H.map(it => it - 1, values)).delay(200);

        const result = await H.pipe([
            fce1, fce2
        ], [1, 2, 3, 4]);

        assert.deepEqual(result, [ 1, 3, 5, 7 ])
    });
});