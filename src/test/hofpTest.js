"use strict";

const describe = require("mocha").describe;
const assert = require("assert");
const it = require("mocha").it;
const P = require('bluebird');
const R = require('ramda');
const filterP = require('../main/hofp').filterP;
const negateCondition = require('../main/hofp').negateCondition;

describe("promisedFilter", () => {

    const conditionReturningPromise = value =>
        P.resolve().then(() => value === "a" || value === "c");

    it("should filter values asynchronously", () =>
        filterP(conditionReturningPromise, ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["b", "d", "e"]))
    );

    it("should work with negative condition too", () =>
        filterP(negateCondition(conditionReturningPromise), ["a", "b", "c", "d", "e"])
            .then(result => assert.deepEqual(result, ["a", "c"]))
    );
});