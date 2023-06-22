import { abs, gcd, roundTo } from './BigMath';
import {
  type ConvertableToRatio,
  type ConvertableToBigInt,
  isConvertableToRatio,
  isConvertableToBigInt,
} from './types';

/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
 *
 * @param value 有理数に変換する値。
 * @returns 既約分数の有理数インスタンス。
 */
function ratio(value: ConvertableToRatio): Ratio;
/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
 *
 * @param num 分子の値。この値は整数でなければなりません。
 * @param denom 分母の値。この値は整数でなければなりません。
 * @returns 既約分数の有理数インスタンス。
 */
function ratio(num: ConvertableToBigInt, denom: ConvertableToBigInt): Ratio;
function ratio(num: ConvertableToRatio | ConvertableToBigInt, denom?: ConvertableToBigInt): Ratio {
  if (isConvertableToRatio(num) && denom == null) {
    return Ratio.from(num);
  } else if (isConvertableToBigInt(num) && isConvertableToBigInt(denom)) {
    return Ratio.reduced(num, denom);
  } else {
    throw new Error();
  }
}

/**
 * 任意精度の有理数を表します。
 */
class Ratio {
  /**
   * 分子
   */
  public readonly num: bigint;

  /**
   * 分母
   */
  public readonly denom: bigint;

  private _reducedCache: Ratio | null = null;

  /**
   * この有理数が0であるかどうかを取得します。
   */
  public get isZero(): boolean {
    return this.num === 0n;
  }

  /**
   * この有理数が0未満であるときtrueを返します。
   * そうでないとき、falseを返します。
   */
  public get isNegative(): boolean {
    return this.num < 0 !== this.denom < 0;
  }

  /**
   * この有理数が0より大きい場合にtrueを返します。
   * そうでないとき、falseを返します。
   */
  public get isPositive(): boolean {
    return this.num <= 0 === this.denom <= 0;
  }

  public constructor(num: ConvertableToBigInt, denom: ConvertableToBigInt) {
    num = BigInt(num);
    denom = BigInt(denom);
    if (denom === 0n) throw new Error('denom must not be zero.');
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
  public static reduced(num: ConvertableToBigInt, denom: ConvertableToBigInt): Ratio {
    return new Ratio(num, denom).reduce();
  }

  public static from(value: ConvertableToRatio): Ratio {
    if (value instanceof Ratio) {
      return value;
    } else if (typeof value === 'bigint') {
      return new Ratio(value, 1n);
    } else {
      throw new TypeError();
    }
  }

  private getReduced(): Ratio {
    if (this._reducedCache != null) return this._reducedCache;

    const _gcd = gcd(this.num, this.denom);
    if (_gcd === 1n) {
      if (this.denom < 0) {
        this._reducedCache = new Ratio(-this.num, -this.denom);
      } else {
        this._reducedCache = this;
      }
    } else if (this.denom < 0) {
      this._reducedCache = new Ratio(-this.num / _gcd, -this.denom / _gcd);
    } else {
      this._reducedCache = new Ratio(this.num / _gcd, this.denom / _gcd);
    }

    return this._reducedCache;
  }

  public reduce(): Ratio {
    return this.getReduced();
  }

  public inv(): Ratio {
    if (this.isZero) throw new Error('Ratio cannot be divided by zero.');
    return Ratio.reduced(this.denom, this.num);
  }

  public neg(): Ratio {
    if (this.denom < 0) {
      return new Ratio(this.num, -this.denom);
    } else {
      return new Ratio(-this.num, this.denom);
    }
  }

  public add(rhs: Ratio | bigint | number): Ratio {
    if (rhs instanceof Ratio) {
      return Ratio.reduced(this.num * rhs.denom + rhs.num * this.denom, this.denom * rhs.denom);
    } else {
      rhs = BigInt(rhs);
      return Ratio.reduced(this.num + this.denom * rhs, this.denom);
    }
  }

  public sub(rhs: Ratio | bigint | number): Ratio {
    if (rhs instanceof Ratio) {
      return this.add(rhs.neg());
    } else {
      return this.add(-rhs);
    }
  }

  public mul(rhs: Ratio | bigint | number): Ratio {
    if (rhs instanceof Ratio) {
      return Ratio.reduced(this.num * rhs.num, this.denom * rhs.denom);
    } else {
      rhs = BigInt(rhs);
      return Ratio.reduced(this.num * rhs, this.denom);
    }
  }

  public div(rhs: Ratio | bigint | number): Ratio {
    if (rhs instanceof Ratio) {
      return this.mul(rhs.inv());
    } else {
      rhs = BigInt(rhs);
      return Ratio.reduced(this.num, this.denom * rhs);
    }
  }

  public eq(rhs: ConvertableToRatio): boolean {
    const reduced = this.getReduced();
    if (rhs instanceof Ratio) {
      rhs = rhs.reduce();
    } else {
      rhs = Ratio.reduced(rhs, 1n);
    }
    return reduced.num === rhs.num && reduced.denom === rhs.denom;
  }

  public toDecimal(digits = 10): string {
    const reduced = this.getReduced();
    const sign = reduced.num < 0;
    const num = abs(reduced.num);
    const denom = reduced.denom;
    const intPart = (num / denom).toString();
    if (digits <= 0) return `${sign ? '-' : ''}${intPart}`;

    const remainder = num % denom;
    if (remainder === 0n) return `${sign ? '-' : ''}${intPart}.${''.padStart(digits, '0')}`;

    // 割った後にdigits+1桁まで整数になるよう10をかけてから割る。
    // 丸めてから10で割る（表示する部分の小数を整数にした形）
    const fracDigitsAsInt = roundTo((remainder * 10n ** (BigInt(digits) + 1n)) / denom, 1) / 10n;
    const fracPart = fracDigitsAsInt.toString().padStart(digits, '0');

    return `${sign ? '-' : ''}${intPart}.${fracPart}`;
  }

  public toString(): string {
    if (this.denom < 0) {
      return `${this.num}/(${this.denom})`;
    } else if (this.denom === 0n) {
      return this.num.toString();
    } else {
      return `${this.num}/${this.denom}`;
    }
  }
}

export { ratio, Ratio };
