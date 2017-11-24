'use strict';

const P = require("bluebird");
const R = require("ramda");

module.exports = {filter, reject, map, parallelLimit, pipe};

async function filter(condition, values) {
    return reject(negateCondition(condition), values)
}

async function reject(condition, values) {
    const prepCondition = value => condition(value)
        .then(res => res ? null : value);
    const resolvedValues = await map(prepCondition, values);
    return R.reject(R.isNil, resolvedValues)
}

async function map(fun, values) {
    const newFun = input => () => fun(input);
    const valuesToResolve = R.map(newFun, values);
    return await P.mapSeries(valuesToResolve, res => res());
}

async function parallelLimit(fun, values, limit, batchCallback = null) {
    const newFun = input => () => fun(input);
    const valuesToResolve = R.map(newFun, values);
    const splitValues = R.splitEvery(limit, valuesToResolve);
    const functionsToResolve = R.map(batch => () => map(val => val(), batch))(splitValues);
    const splitResult = await P.mapSeries(functionsToResolve, async res => {
        const result = await res();
        if (batchCallback) batchCallback(result);
        return result;
    });
    return R.flatten(splitResult)
}

async function pipe(functions, values) {
    return functions.length > 0
        ? await pipe(R.tail(functions), await R.head(functions)(values))
        : values
}

function negateCondition(condition) {
    return value => condition(value).then(res => !res);
}