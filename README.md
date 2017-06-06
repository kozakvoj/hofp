# hofp - Higher-order functions with promises

[![Build Status](https://travis-ci.org/kozakvoj/hofp.svg?branch=master)](https://travis-ci.org/kozakvoj/hofp)

### filterP
`(Promise filterCondition → Boolean, Iterable\<any>) → Promise → Iterable\<any>`

Sequential filter.

### mapP
`(Promise mapFunction → any, Iterable\<any>) → Promise → Iterable\<any>`

Sequential map.

### negateCondition
`(Promise<any> condition → Boolean) → !Promise<any> condition → Boolean`