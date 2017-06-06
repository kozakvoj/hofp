# hofp - Higher-order functions with promises

[![Build Status](https://travis-ci.org/kozakvoj/hofp.svg?branch=master)](https://travis-ci.org/kozakvoj/hofp)


## API
### filterP
`(Promise filterCondition → Boolean, Iterable\<any>) → Promise → Iterable\<any>`

Sequential filter.

### mapP
`(Promise mapFunction → any, Iterable\<any>) → Promise → Iterable\<any>`

Sequential map.

### negateCondition
`(Promise<any> condition → Boolean) → !Promise<any> condition → Boolean`

## Usage

Using filter

```javascript
const conditionReturningPromise = value =>
    P.resolve().then(() => value === "a" || value === "c");

filterP(conditionReturningPromise, ["a", "b", "c", "d", "e"])
    .then(result => assert.deepEqual(result, ["a", "c"]))
```

With negateCondition

```javascript
filterP(negateCondition(conditionReturningPromise), ["a", "b", "c", "d", "e"])
    .then(result => assert.deepEqual(result, ["a", "c"]))
```

Using map

```javascript
const mapFunction = value => P.resolve().then(() => value * value);

mapP(mapFunction, [1, 2, 3])
    .then(result => assert.deepEqual(result, [1, 4, 9]))
```

Chaining with Ramda
```javascript
const mapFunction = value => P.resolve().then(() => value * value);

P.resolve([1, 2, 3, 4])
    .then(R.map(value => value * value))
    .then(R.curry(mapP)(mapFunction))
    .then(R.filter(n => n % 2 === 0))
    .then(result => assert.deepEqual(result, [16, 256]))
```