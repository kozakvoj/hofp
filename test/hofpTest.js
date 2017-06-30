"use strict";

const describe = require("mocha").describe;
const assert = require("assert");
const it = require("mocha").it;
const P = require('bluebird');
const H = require('../index');
const R = require('ramda');
const sleep = require('sleep-promise');

describe("filterP", () => {

    const conditionReturningPromise = value =>
        P.resolve().then(() => value === "a" || value === "c");

    it("should filter values using promise as condition", () =>
        H.filterP(conditionReturningPromise, ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["a", "c"]))
    );
});

describe("rejectP", () => {

    const conditionReturningPromise = value =>
        P.resolve().then(() => value === "a" || value === "c");

    it("should reject values using promise as condition", () =>
        H.rejectP(conditionReturningPromise, ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["b", "d", "e"]))
    );
});

describe("mapP", () => {

    const mapFunction = value => P.resolve().then(() => value * value);

    it("should map values using promise as map function", () =>
        H.mapP(mapFunction, [1, 2, 3])
            .then(result => assert.deepEqual(result, [1, 4, 9]))
    );

    it("should work together with ramda", () =>
        P.resolve([1, 2, 3, 4])
            .then(R.map(value => value * value))
            .then(R.curry(H.mapP)(mapFunction))
            .then(R.filter(n => n % 2 === 0))
            .then(result => assert.deepEqual(result, [16, 256]))
    );

    it("should work sequentially", () =>
        H.mapP(sleepAndReturn, [10, 5, 1]).then(result => {
            assert.deepEqual(result, [10, 5, 1])
        })
    )
});

async function sleepAndReturn(val) {
    await sleep(val);
    return val;
}