# hofp - Higher-order functions for promises

[![Build Status](https://travis-ci.org/kozakvoj/hofp.svg?branch=master)](https://travis-ci.org/kozakvoj/hofp)

## Dependencies
- Node.js 7.4+
- bluebird
- ramda

## API

### reduce
`(Promise filterCondition → Boolean, Iterable<any>) → Promise → Iterable<any>`

### filter
`(Promise filterCondition → Boolean, Iterable<any>) → Promise → Iterable<any>`

Sequential filter.

### map
`(Promise mapFunction → any, Iterable<any>) → Promise → Iterable<any>`

Sequential map.

## Usage

```javascript
const H = require('hofp')
```

Using reject

```javascript
const conditionReturningPromise = value =>
    P.resolve().then(() => value === "a" || value === "c");

H.reject(conditionReturningPromise, ["a", "b", "c", "d", "e"])
    .then(result => assert.deepEqual(result, ["b", "d", "e"]))
```

With filter

```javascript
H.filter(conditionReturningPromise, ["a", "b", "c", "d", "e"])
    .then(result => assert.deepEqual(result, ["a", "c"]))
```

Using map

```javascript
const mapFunction = value => P.resolve().then(() => value * value);

H.map(mapFunction, [1, 2, 3])
    .then(result => assert.deepEqual(result, [1, 4, 9]))
```

Chaining with Ramda
```javascript
const mapFunction = value => P.resolve().then(() => value * value);

P.resolve([1, 2, 3, 4])
    .then(R.map(value => value * value))
    .then(R.curry(map)(mapFunction))
    .then(R.filter(n => n % 2 === 0))
    .then(result => assert.deepEqual(result, [16, 256]))
```