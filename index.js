'use strict';

const P = require("bluebird");
const R = require("ramda");

module.exports = {filter, reject, map, parallelLimit, retry};

async function filter(condition, values) {
    return reject(negateCondition(condition), values)
}

async function reject(condition, values) {
    const prepCondition = value => condition(value)
        .then(res => res ? null : value);
    const resolvedValues = await map(prepCondition, values);
    return R.reject(R.isNil, resolvedValues)
}

async function map(fn, values) {
    const newFn = input => () => fn(input);
    const valuesToResolve = R.map(newFn, values);
    return await P.mapSeries(valuesToResolve, res => res());
}

async function parallelLimit(fn, values, limit, batchCallback = null) {
    const newFn = input => () => fn(input);
    const valuesToResolve = R.map(newFn, values);
    const splitValues = R.splitEvery(limit, valuesToResolve);
    const functionsToResolve = R.map(batch => () => map(val => val(), batch))(splitValues);
    const splitResult = await P.mapSeries(functionsToResolve, async res => {
        const result = await res();
        if (batchCallback) batchCallback(result);
        return result;
    });
    return R.flatten(splitResult)
}

function retry(fun, retries, timeout) {
    return _retry(fun, retries, timeout, 1);

    function _retry(fn, retries, timeout, tryCount) {
        return P.resolve()
            .then(fn)
            .timeout(timeout)
            .catch(() => {
                if (retries > tryCount) {
                    return _retry(fn, retries, timeout, ++tryCount);
                }
            })
    }
}

function negateCondition(condition) {
    return value => condition(value).then(res => !res);
}