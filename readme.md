# rational

リファレンスは[こちら](https://gitbucket.littleescaper.net/gitbucket/tomoda/Rational/pages/index.html)

## installation

```sh
npm i git+https://gitbucket.littleescaper.net/gitbucket/git/tomoda/Rational.git
```

## example

```js
const { ratio } = require('rational');

// 7/6
console.log(ratio(1, 2).add(ratio(2, 3)).toString());
// true
console.log(ratio(7, 6).eq(ratio(1, 2).add(ratio(1, 2))));
```
