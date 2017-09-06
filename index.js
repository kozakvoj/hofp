'use strict';

const P = require("bluebird");
const R = require("ramda");

module.exports = {filter, reject, map, mapv2, parallelLimit};

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

async function mapv2(mapFunction, values) {
    const valuesToResolve = R.map(mapFunction, values);
    return await P.mapSeries(valuesToResolve, res => res());
}

async function parallelLimit(fun, values, limit) {
    const valuesToResolve = R.map(fun, values);
    const splitValues = R.splitEvery(limit, valuesToResolve);
    const functionsToResolve = R.map(batch => () => mapv2(val => () => val(), batch))(splitValues);
    return P.mapSeries(functionsToResolve, res => res())
}

function negateCondition(condition) {
    return value => condition(value).then(res => !res);
}