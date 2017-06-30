'use strict';

const P = require("bluebird");
const R = require("ramda");

module.exports = {rejectP, mapP, negateCondition};

async function rejectP(condition, values) {
    const prepCondition = value => condition(value)
        .then(res => res ? null : value);
    const resolvedValues = await mapP(prepCondition, values);
    return R.reject(R.isNil, resolvedValues)
}

async function mapP(mapFunction, values) {
    const valuesToResolve = R.map(mapFunction, values);
    return await P.mapSeries(valuesToResolve, res => res);
}

function negateCondition(condition) {
    return value => condition(value).then(res => !res);
}