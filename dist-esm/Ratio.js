import { abs, gcd, roundTo } from './BigMath';
import { isConvertableToRatio, isConvertableToBigInt, } from './types';
function ratio(num, denom = undefined) {
    if (isConvertableToRatio(num) && denom == null) {
        return Ratio.from(num);
    }
    else if (isConvertableToBigInt(num) && isConvertableToBigInt(denom)) {
        return Ratio.reduced(num, denom);
    }
    else {
        throw new Error();
    }
}
/**
 * 任意精度の有理数を表します。
 */
class Ratio {
    get isZero() {
        return this.num === 0n;
    }
    get isNegative() {
        return this.num < 0 !== this.denom < 0;
    }
    get isPositive() {
        return this.num < 0 === this.denom < 0;
    }
    constructor(num, denom) {
        /**
         * 分子
         */
        Object.defineProperty(this, "num", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 分母
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
    static reduced(num, denom) {
        return new Ratio(num, denom).reduce();
    }
    static from(value) {
        if (value instanceof Ratio) {
            return value;
        }
        else if (typeof value === 'bigint') {
            return new Ratio(value, 1n);
        }
        else {
            throw new TypeError();
        }
    }
    getReduced() {
        if (this._reducedCache != null)
            return this._reducedCache;
        const _gcd = gcd(this.num, this.denom);
        if (_gcd === 1n) {
            this._reducedCache = this;
        }
        else if (this.denom < 0) {
            this._reducedCache = new Ratio(-this.num / _gcd, -this.denom / _gcd);
        }
        else {
            this._reducedCache = new Ratio(this.num / _gcd, this.denom / _gcd);
        }
        return this._reducedCache;
    }
    reduce() {
        return this.getReduced();
    }
    inv() {
        if (this.isZero)
            throw new Error('Ratio cannot be divided by zero.');
        return Ratio.reduced(this.denom, this.num);
    }
    neg() {
        if (this.denom < 0) {
            return new Ratio(this.num, -this.denom);
        }
        else {
            return new Ratio(-this.num, this.denom);
        }
    }
    add(rhs) {
        if (rhs instanceof Ratio) {
            return Ratio.reduced(this.num * rhs.denom + rhs.num * this.denom, this.denom * rhs.denom);
        }
        else {
            rhs = BigInt(rhs);
            return Ratio.reduced(this.num + this.denom * rhs, this.denom);
        }
    }
    sub(rhs) {
        if (rhs instanceof Ratio) {
            return this.add(rhs.neg());
        }
        else {
            return this.add(-rhs);
        }
    }
    mul(rhs) {
        if (rhs instanceof Ratio) {
            return Ratio.reduced(this.num * rhs.num, this.denom * rhs.denom);
        }
        else {
            rhs = BigInt(rhs);
            return Ratio.reduced(this.num * rhs, this.denom);
        }
    }
    div(rhs) {
        if (rhs instanceof Ratio) {
            return this.mul(rhs.inv());
        }
        else {
            rhs = BigInt(rhs);
            return Ratio.reduced(this.num, this.denom * rhs);
        }
    }
    eq(rhs) {
        const reduced = this.getReduced();
        if (rhs instanceof Ratio) {
            rhs = rhs.reduce();
        }
        else {
            rhs = Ratio.reduced(rhs, 1n);
        }
        return reduced.num === rhs.num && reduced.denom === rhs.denom;
    }
    toDecimal(digits = 10) {
        const reduced = this.getReduced();
        const sign = reduced.num < 0;
        const num = abs(reduced.num);
        const denom = reduced.denom;
        const intPart = (num / denom).toString();
        if (digits <= 0)
            return `${sign ? '-' : ''}${intPart}`;
        const remainder = num % denom;
        if (remainder === 0n)
            return `${sign ? '-' : ''}${intPart}.${''.padStart(digits, '0')}`;
        // 割った後にdigits+1桁まで整数になるよう10をかけてから割る。
        // 丸めてから10で割る（表示する部分の小数を整数にした形）
        const fracDigitsAsInt = roundTo((remainder * 10n ** (BigInt(digits) + 1n)) / denom, 1) / 10n;
        const fracPart = fracDigitsAsInt.toString().padStart(digits, '0');
        return `${sign ? '-' : ''}${intPart}.${fracPart}`;
    }
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
export { ratio, Ratio };
//# sourceMappingURL=Ratio.js.map