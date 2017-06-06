"use strict";

const describe = require("mocha").describe;
const assert = require("assert");
const it = require("mocha").it;
const P = require('bluebird');
const filterP = require('../hofp').filterP;
const mapP = require('../hofp').mapP;
const negateCondition = require('../hofp').negateCondition;

describe("filterP", () => {

    const conditionReturningPromise = value =>
        P.resolve().then(() => value === "a" || value === "c");

    it("should filter values using promise as condition", () =>
        filterP(conditionReturningPromise, ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["b", "d", "e"]))
    );

    it("should work with negative condition too", () =>
        filterP(negateCondition(conditionReturningPromise), ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["a", "c"]))
    );
});

describe("mapP", () => {

    const mapFunction = value => P.resolve().then(() => value * value);

    it("should map values using promise as map function", () =>
        mapP(mapFunction, [1, 2, 3])
            .then(result => assert.deepEqual(result, [1, 4, 9]))
    );
});