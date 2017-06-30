'use strict';

const P = require("bluebird");
const R = require("ramda");

module.exports = {filter, reject, map};

async function filter(condition, values) {
    return reject(negateCondition(condition), values)
}

async function reject(condition, values) {
    const prepCondition = value => condition(value)
        .then(res => res ? null : value);
    const resolvedValues = await map(prepCondition, values);
    return R.reject(R.isNil, resolvedValues)
}

async function map(mapFunction, values) {
    const valuesToResolve = R.map(mapFunction, values);
    return await P.mapSeries(valuesToResolve, res => res);
}

function negateCondition(condition) {
    return value => condition(value).then(res => !res);
}