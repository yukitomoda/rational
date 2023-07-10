# rational

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/yukitomoda/rational/ci.yml)

リファレンスは[こちら](https://yukitomoda.github.io/rational/)

## installation

```sh
npm i git+https://github.com/yukitomoda/rational.git
```

## example

### 演算

有理数として計算可能な演算子は一通り実装されています。

```js
const { ratio } = require('rational');

const a = ratio(1, 2);
const b = ratio(2, 3);

console.log(a.add(b).toString());
console.log(a.sub(b).toString());
console.log(a.mul(b).toString());
console.log(a.div(b).toString());
```

他にどのような演算子が実装されているか知るには、[リファレンス](https://yukitomoda.github.io/rational/)を参照してください。

### 他の型からの変換

#### number からの変換

JavaScript で使用されている number 型からの変換が可能です。
ただし`0.1`など number 型で正確に表すことができない値を使用した場合、直感と反する結果となることがあります。
（これは、実際に格納されている数値を忠実に再現しようとするためです。）

「表記の通り」に変換したい場合は、後述の string からの変換を使用してください。

```js
const { ratio } = require('rational');

// 5/4
console.log(ratio(1.75));

// 注意：0.1はnumber型では正確に表せないため、1/10にはなりません！
// 3602879701896397/36028797018963968
console.log(ratio(0.1));

// 注意：分子、分母を指定する場合は、必ず整数でなければなりません。
// Error!
// console.log(ratio(1.7, 2.4));
```

#### string からの変換

string からの変換では、2, 8, 10, 16 進数をサポートします。
2, 8, 16 進数を使用する場合は、それぞれ `0b`, `0o`, `0x` プレフィクスを付けます。

```js
const { ratio } = require('rational');

// 3/4
console.log(ratio('0b0.11'));
// 3/8
console.log(ratio('0o0.3'));
// 1/10
console.log(ratio('0.1'));
// 10進数の場合は、指数表記を使用することができます。
// 123/100000
console.log(ratio('1.23e-3'));
// 11/16
console.log(ratio('0x0.b'));
console.log(ratio('0x0.B'));
```

分数表記を使用する場合は、単に分子、分母の間に `/` を挿入します。
ただし分数表記では、分母に負の数を使用することはできません。

```js
// -123/456
console.log(ratio('-123/456'));
// プレフィクスを付ければ、10進数以外も指定できます。
// 10/255
console.log(ratio('0x0a/0xff'));
```

### 文字列への変換

```js
// '-3/5'
console.log(ratio(-3, 5).toString());
// '-1/3'
console.log(ratio(3, -9).toString());
```
