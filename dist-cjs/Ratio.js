"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratio = exports.ratio = void 0;
const BigMath_1 = require("./BigMath");
const types_1 = require("./types");
const parser_1 = require("./parse/parser");
function ratio(num, denom) {
    if ((typeof num === 'bigint' || typeof num === 'number' || typeof num === 'string') && denom == null) {
        return Ratio.from(num);
    }
    else if ((0, types_1.isConvertableToBigInt)(num) && (0, types_1.isConvertableToBigInt)(denom)) {
        return Ratio.reduced(num, denom);
    }
    else {
        throw new Error();
    }
}
exports.ratio = ratio;
/**
 * 任意精度の有理数を表します。
 */
class Ratio {
    /**
     * この有理数が0であるときtrueを返します。
     * そうでないとき、falseを返します。
     */
    get isZero() {
        return this.num === 0n;
    }
    /**
     * この有理数が0未満であるときtrueを返します。
     * そうでないとき、falseを返します。
     */
    get isNegative() {
        return this.num < 0 !== this.denom < 0;
    }
    /**
     * この有理数が0より大きい場合にtrueを返します。
     * そうでないとき、falseを返します。
     */
    get isPositive() {
        return this.num <= 0 === this.denom <= 0;
    }
    /**
     * 指定した分子、分母で有理数のインスタンスを作成します。
     *
     * このコンストラクタでは、分子、分母の値はそのまま保持され、既約分数への変換は行われません。
     * あらかじめ既約分数として作成する場合は、`ratio()` を使用してください。
     * @param num 分子
     * @param denom 分母
     */
    constructor(num, denom) {
        /**
         * 分子を取得します。
         */
        Object.defineProperty(this, "num", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 分母を取得します。
         */
        Object.defineProperty(this, "denom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_reducedCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        num = BigInt(num);
        denom = BigInt(denom);
        if (denom === 0n)
            throw new Error('denom must not be zero.');
        this.num = num;
        this.denom = denom;
    }
    /**
     * 分子と分母を指定して、既約分数を返します。
     * この既約分数は、有理数が負の場合numプロパティが負となります。
     * @param num 分子
     * @param denom 分母
     * @returns 指定した分子、分母を持つ分数と等しい既約分数
     */
    static reduced(num, denom) {
        return new Ratio(num, denom).reduce();
    }
    /**
     * 指定した値を有理数のインスタンスに変換します。
     * @param value 有理数に変換する値。
     */
    static from(value) {
        if (value instanceof Ratio) {
            return value;
        }
        else if (typeof value === 'bigint') {
            return new Ratio(value, 1n);
        }
        else if (typeof value === 'number') {
            return Ratio.fromNumber(value);
        }
        else if (typeof value === 'string') {
            return Ratio.parse(value);
        }
        else {
            throw new TypeError();
        }
    }
    /**
     * 指定した数値を有理数に変換します。
     * @param value 有理数に変換する値。
     */
    static fromNumber(value) {
        const step = 2 ** 128;
        const bigIntStep = BigInt(step);
        if (Number.isNaN(value))
            throw new Error('NaN cannot be converted to Ratio.');
        if (!Number.isFinite(value))
            throw new Error('Infinity cannot be converted to Ratio.');
        const isNegative = value < 0;
        value = Math.abs(value);
        let num = 0n;
        let denom = 1n;
        while (true) {
            const intPart = Math.floor(value);
            num = num * bigIntStep + BigInt(intPart);
            value = (value - intPart) * step;
            if (value <= 0)
                break;
            denom *= bigIntStep;
        }
        if (isNegative)
            num = -num;
        return Ratio.reduced(num, denom);
    }
    /**
     * 指定した文字列をパースし、有理数に変換します。
     * @param str パースする文字列。
     * @example
     * // -1.233333...(111/90)
     * Ratio.parse('-1.2(3)');
     * @example
     * // 1/255
     * Ratio.parse('1/0xFF');
     */
    static parse(str) {
        return (0, parser_1.parse)(str);
    }
    getReduced() {
        if (this._reducedCache != null)
            return this._reducedCache;
        const _gcd = (0, BigMath_1.gcd)(this.num, this.denom);
        if (_gcd === 1n) {
            if (this.denom < 0) {
                this._reducedCache = new Ratio(-this.num, -this.denom);
            }
            else {
                this._reducedCache = this;
            }
        }
        else if (this.denom < 0) {
            this._reducedCache = new Ratio(-this.num / _gcd, -this.denom / _gcd);
        }
        else {
            this._reducedCache = new Ratio(this.num / _gcd, this.denom / _gcd);
        }
        return this._reducedCache;
    }
    /**
     * この有理数を既約分数に変換した値を返します。
     */
    reduce() {
        return this.getReduced();
    }
    /**
     * この有理数の逆数を計算して返します。
     * @throws 値が0のとき
     */
    inv() {
        if (this.isZero)
            throw new Error('Ratio cannot be divided by zero.');
        return Ratio.reduced(this.denom, this.num);
    }
    /**
     * この有理数の符号を反転した値を返します。
     */
    neg() {
        if (this.denom < 0) {
            return new Ratio(this.num, -this.denom);
        }
        else {
            return new Ratio(-this.num, this.denom);
        }
    }
    /**
     * この有理数に指定した値を加えて得られる値を返します。
     * @param rhs 加算する値。
     */
    add(rhs) {
        if (rhs instanceof Ratio) {
            return Ratio.reduced(this.num * rhs.denom + rhs.num * this.denom, this.denom * rhs.denom);
        }
        else {
            return this.add(Ratio.from(rhs));
        }
    }
    /**
     * この有理数から指定した値を引いて得られる値を返します。
     * @param rhs 減算する値。
     */
    sub(rhs) {
        if (rhs instanceof Ratio) {
            return this.add(rhs.neg());
        }
        else {
            return this.add(-rhs);
        }
    }
    /**
     * この有理数に指定した値をかけて得られる値を返します。
     * @param rhs 乗算する値。
     */
    mul(rhs) {
        if (rhs instanceof Ratio) {
            return Ratio.reduced(this.num * rhs.num, this.denom * rhs.denom);
        }
        else {
            return this.mul(Ratio.from(rhs));
        }
    }
    /**
     * この有理数を指定した値で割って得られる値を返します。
     * @param rhs 除算する値。
     */
    div(rhs) {
        if (rhs instanceof Ratio) {
            return this.mul(rhs.inv());
        }
        else {
            return this.div(Ratio.from(rhs));
        }
    }
    /**
     * この有理数が指定した値と等しいかどうかを調べます。
     * @param rhs この値と等しいか調べる値。
     */
    eq(rhs) {
        const reduced = this.getReduced();
        if (rhs instanceof Ratio) {
            rhs = rhs.reduce();
        }
        else {
            rhs = Ratio.from(rhs);
        }
        return reduced.num === rhs.num && reduced.denom === rhs.denom;
    }
    /**
     * この有理数が指定した値より大きいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    gt(rhs) {
        const reduced = this.getReduced();
        if (rhs instanceof Ratio) {
            rhs = rhs.reduce();
        }
        else {
            rhs = Ratio.from(rhs);
        }
        return reduced.num * rhs.denom > rhs.num * reduced.denom;
    }
    /**
     * この有理数が指定した値より大きいか、指定した値と等しいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    geq(rhs) {
        const reduced = this.getReduced();
        if (rhs instanceof Ratio) {
            rhs = rhs.reduce();
        }
        else {
            rhs = Ratio.from(rhs);
        }
        return reduced.num * rhs.denom >= rhs.num * reduced.denom;
    }
    /**
     * この有理数が指定した値より小さいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    lt(rhs) {
        const reduced = this.getReduced();
        if (rhs instanceof Ratio) {
            rhs = rhs.reduce();
        }
        else {
            rhs = Ratio.from(rhs);
        }
        return reduced.num * rhs.denom < rhs.num * reduced.denom;
    }
    /**
     * この有理数が指定した値より小さいか、指定した値と等しいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    leq(rhs) {
        const reduced = this.getReduced();
        if (rhs instanceof Ratio) {
            rhs = rhs.reduce();
        }
        else {
            rhs = Ratio.from(rhs);
        }
        return reduced.num * rhs.denom <= rhs.num * reduced.denom;
    }
    /**
     * この有理数以下で最大の整数を返します。
     */
    floor() {
        const reduced = this.getReduced();
        if (reduced.denom === 1n)
            return reduced.num;
        return reduced.num > 0 ? reduced.num / reduced.denom : reduced.num / reduced.denom - 1n;
    }
    /**
     * この有理数以上で最小の整数を返します。
     */
    ceil() {
        const reduced = this.getReduced();
        if (reduced.denom === 1n)
            return reduced.num;
        return reduced.num > 0 ? reduced.num / reduced.denom + 1n : reduced.num / reduced.denom;
    }
    /**
     * この有理数のうち1未満単位の値を取り除いた整数部を返します。
     */
    trunc() {
        const reduced = this.getReduced();
        if (reduced.denom === 1n)
            return reduced.num;
        return reduced.num / reduced.denom;
    }
    /**
     * この値を指定した小数点以下桁数までの10進法表記文字列に変換します。
     * @param digits 文字列に含める小数点以下桁数。
     */
    toDecimal(digits = 10) {
        const reduced = this.getReduced();
        const sign = reduced.num < 0;
        const num = (0, BigMath_1.abs)(reduced.num);
        const denom = reduced.denom;
        const intPart = (num / denom).toString();
        if (digits <= 0)
            return `${sign ? '-' : ''}${intPart}`;
        const remainder = num % denom;
        if (remainder === 0n)
            return `${sign ? '-' : ''}${intPart}.${''.padStart(digits, '0')}`;
        // 割った後にdigits+1桁まで整数になるよう10をかけてから割る。
        // 丸めてから10で割る（表示する部分の小数を整数にした形）
        const fracDigitsAsInt = (0, BigMath_1.roundTo)((remainder * 10n ** (BigInt(digits) + 1n)) / denom, 1) / 10n;
        const fracPart = fracDigitsAsInt.toString().padStart(digits, '0');
        return `${sign ? '-' : ''}${intPart}.${fracPart}`;
    }
    /**
     * このインスタンスを文字列表現に変換します。
     *
     * 文字列は、`num/denom`形式です。ただし、denomが負の場合、`num/(denom)`表記となります。
     */
    toString() {
        if (this.denom < 0) {
            return `${this.num}/(${this.denom})`;
        }
        else if (this.denom === 0n) {
            return this.num.toString();
        }
        else {
            return `${this.num}/${this.denom}`;
        }
    }
}
exports.Ratio = Ratio;
//# sourceMappingURL=Ratio.js.map