# hofp - Higher-order functions with promises

[![Build Status](https://travis-ci.org/kozakvoj/hofp.svg?branch=master)](https://travis-ci.org/kozakvoj/hofp)

### filterP
`(Promise\<any> filterCondition, Iterable\<any>) → Promise<Iterable\<any>>`

Sequential filter.

### negateCondition
`(Promise<any> condition) → !Promise<any> condition`