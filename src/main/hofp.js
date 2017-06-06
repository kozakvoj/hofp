'use strict';

const P = require("bluebird");
const R = require("ramda");

module.exports = {filterP, negateCondition};

async function filterP(condition, values) {
    const prepCondition = value => condition(value)
        .then(res => res ? null : value);
    const valuesToResolve = R.map(prepCondition, values);
    const resolvedValues = await P.mapSeries(valuesToResolve, res => res);
    return R.reject(R.isNil, resolvedValues)
}

function negateCondition(condition) {
    return value => condition(value).then(res => !res);
}