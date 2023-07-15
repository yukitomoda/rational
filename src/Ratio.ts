import { abs, gcd, roundTo } from './BigMath';
import { type ConvertableToRatio, type ConvertableToBigInt, isConvertableToBigInt } from './types';
import { parse } from './parse/parser';

/**
 * 指定した整数を表す有理数のインスタンスに変換します。
 *
 * @param value 有理数に変換する値。
 */
function ratio(value: bigint): Ratio;
/**
 * 指定した数値を有理数のインスタンスに変換します。
 *
 * この変換は実際の値を正確に再現しようと試みます。
 * 例えば0.1のようなnumber型で正確に表現できないような値を変換した場合、
 * 直感とは反するような結果に変換されることがあります。
 * 表記通りの数値に変換したい場合は、ratio(string)を使用してください。
 *
 * @param value 有理数に変換する値。この値はNaN, Infinityであってはなりません。
 */
function ratio(value: number): Ratio;
/**
 * 指定した文字列を有理数のインスタンスに変換します。
 *
 * この変換では、
 *
 * - 整数形式: `123`
 * - 小数形式: `1.2(3)`
 * - 分数形式: `3/5`
 *
 * の三つの形式が指定できます。
 *
 * またそれぞれ、`0b`、`0o`、`0x`プレフィクスを付けることによって、2、8、16進数を記述できます。
 *
 * @example
 * // 整数形式
 * ratio('0xff');
 * ratio('-123e5');
 *
 * // 小数形式
 * ratio('1.23e8');
 * // 小数部で()で囲った部分は、循環節とみなされます。
 * ratio('-1.2(3)');
 * ratio('0b10101111.(1110)');
 *
 * // 分数形式
 * ratio('3/5');
 * ratio('-4/3');
 * ratio('0x0a/0xff');
 *
 * @param value
 */
function ratio(value: string): Ratio;
/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
 * この関数は分子、分母をともに整数として扱います。
 * 整数でない数を分子、分母に指定する場合は、`ratio(a).div(ratio(b))`を使用してください。
 *
 * @param num 分子の値。この値は整数でなければなりません。
 * @param denom 分母の値。この値は整数でなければなりません。
 * @returns 既約分数の有理数インスタンス。
 */
function ratio(num: ConvertableToBigInt, denom: ConvertableToBigInt): Ratio;
function ratio(num: bigint | number | string | ConvertableToBigInt, denom?: ConvertableToBigInt): Ratio {
  if ((typeof num === 'bigint' || typeof num === 'number' || typeof num === 'string') && denom == null) {
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
   * 分子を取得します。
   */
  public readonly num: bigint;

  /**
   * 分母を取得します。
   */
  public readonly denom: bigint;

  private _reducedCache: Ratio | null = null;

  /**
   * この有理数が0であるときtrueを返します。
   * そうでないとき、falseを返します。
   */
  public get isZero(): boolean {
    return this.num === 0n;
  }

  /**
   * この有理数が0未満であるときtrueを返します。
   * そうでないとき、falseを返します。
   */
  public get isNegative(): boolean {
    return !this.isZero && this.num < 0 !== this.denom < 0;
  }

  /**
   * この有理数が0より大きい場合にtrueを返します。
   * そうでないとき、falseを返します。
   */
  public get isPositive(): boolean {
    return !this.isZero && this.num < 0 === this.denom < 0;
  }

  /**
   * この値が正の数のとき1、0のとき0、負の数のとき-1を返します。
   */
  public get sign(): -1 | 0 | 1 {
    if (this.num === 0n) return 0;
    if (this.num < 0 !== this.denom < 0) return -1;
    return 1;
  }

  /**
   * 指定した分子、分母で有理数のインスタンスを作成します。
   *
   * このコンストラクタでは、分子、分母の値はそのまま保持され、既約分数への変換は行われません。
   * あらかじめ既約分数として作成する場合は、`ratio()` を使用してください。
   * @param num 分子
   * @param denom 分母
   */
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

  /**
   * 指定した値を有理数のインスタンスに変換します。
   * @param value 有理数に変換する値。
   */
  public static from(value: ConvertableToRatio): Ratio {
    if (value instanceof Ratio) {
      return value;
    } else if (typeof value === 'bigint') {
      return new Ratio(value, 1n);
    } else if (typeof value === 'number') {
      return Ratio.fromNumber(value);
    } else if (typeof value === 'string') {
      return Ratio.parse(value);
    } else {
      throw new TypeError();
    }
  }

  /**
   * 指定した数値を有理数に変換します。
   * @param value 有理数に変換する値。
   */
  public static fromNumber(value: number): Ratio {
    const step = 2 ** 128;
    const bigIntStep = BigInt(step);
    if (Number.isNaN(value)) throw new Error('NaN cannot be converted to Ratio.');
    if (!Number.isFinite(value)) throw new Error('Infinity cannot be converted to Ratio.');
    const isNegative = value < 0;
    value = Math.abs(value);
    let num = 0n;
    let denom = 1n;
    while (true) {
      const intPart = Math.floor(value);
      num = num * bigIntStep + BigInt(intPart);
      value = (value - intPart) * step;
      if (value <= 0) break;
      denom *= bigIntStep;
    }

    if (isNegative) num = -num;

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
  public static parse(str: string): Ratio {
    return parse(str);
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

  /**
   * この有理数を既約分数に変換した値を返します。
   */
  public reduce(): Ratio {
    return this.getReduced();
  }

  /**
   * この有理数の逆数を計算して返します。
   * @throws 値が0のとき
   */
  public inv(): Ratio {
    if (this.isZero) throw new Error('Ratio cannot be divided by zero.');
    return Ratio.reduced(this.denom, this.num);
  }

  /**
   * この有理数の符号を反転した値を返します。
   */
  public neg(): Ratio {
    if (this.denom < 0) {
      return new Ratio(this.num, -this.denom);
    } else {
      return new Ratio(-this.num, this.denom);
    }
  }

  /**
   * この有理数の絶対値を返します。
   */
  public abs(): Ratio {
    if (this.isNegative) return this.neg();
    return this;
  }

  /**
   * この有理数に指定した値を加えて得られる値を返します。
   * @param rhs 加算する値。
   */
  public add(rhs: ConvertableToRatio): Ratio {
    if (rhs instanceof Ratio) {
      return Ratio.reduced(this.num * rhs.denom + rhs.num * this.denom, this.denom * rhs.denom);
    } else {
      return this.add(Ratio.from(rhs));
    }
  }

  /**
   * この有理数から指定した値を引いて得られる値を返します。
   * @param rhs 減算する値。
   */
  public sub(rhs: ConvertableToRatio): Ratio {
    if (rhs instanceof Ratio) {
      return this.add(rhs.neg());
    } else {
      return this.add(-rhs);
    }
  }

  /**
   * この有理数に指定した値をかけて得られる値を返します。
   * @param rhs 乗算する値。
   */
  public mul(rhs: ConvertableToRatio): Ratio {
    if (rhs instanceof Ratio) {
      return Ratio.reduced(this.num * rhs.num, this.denom * rhs.denom);
    } else {
      return this.mul(Ratio.from(rhs));
    }
  }

  /**
   * この有理数を指定した値で割って得られる値を返します。
   * @param rhs 除算する値。
   */
  public div(rhs: ConvertableToRatio): Ratio {
    if (rhs instanceof Ratio) {
      return this.mul(rhs.inv());
    } else {
      return this.div(Ratio.from(rhs));
    }
  }

  /**
   * この有理数の累乗を返します。
   * @param rhs 指数。この値は整数でなければなりません。
   */
  public pow(rhs: ConvertableToBigInt): Ratio {
    rhs = BigInt(rhs);
    const reduced = this.getReduced();
    if (rhs < 0) {
      rhs = -rhs;
      return new Ratio(reduced.denom ** rhs, reduced.num ** rhs);
    } else {
      return new Ratio(reduced.num ** rhs, reduced.denom ** rhs);
    }
  }

  /**
   * この有理数が指定した値と等しいかどうかを調べます。
   * @param rhs この値と等しいか調べる値。
   */
  public eq(rhs: ConvertableToRatio): boolean {
    const reduced = this.getReduced();
    if (rhs instanceof Ratio) {
      rhs = rhs.reduce();
    } else {
      rhs = Ratio.from(rhs);
    }
    return reduced.num === rhs.num && reduced.denom === rhs.denom;
  }

  /**
   * この有理数が指定した値より大きいときtrueを返します。そうでないとき、falseを返します。
   * @param rhs 比較する値。
   */
  public gt(rhs: ConvertableToRatio): boolean {
    const reduced = this.getReduced();
    if (rhs instanceof Ratio) {
      rhs = rhs.reduce();
    } else {
      rhs = Ratio.from(rhs);
    }
    return reduced.num * rhs.denom > rhs.num * reduced.denom;
  }

  /**
   * この有理数が指定した値より大きいか、指定した値と等しいときtrueを返します。そうでないとき、falseを返します。
   * @param rhs 比較する値。
   */
  public geq(rhs: ConvertableToRatio): boolean {
    const reduced = this.getReduced();
    if (rhs instanceof Ratio) {
      rhs = rhs.reduce();
    } else {
      rhs = Ratio.from(rhs);
    }
    return reduced.num * rhs.denom >= rhs.num * reduced.denom;
  }

  /**
   * この有理数が指定した値より小さいときtrueを返します。そうでないとき、falseを返します。
   * @param rhs 比較する値。
   */
  public lt(rhs: ConvertableToRatio): boolean {
    const reduced = this.getReduced();
    if (rhs instanceof Ratio) {
      rhs = rhs.reduce();
    } else {
      rhs = Ratio.from(rhs);
    }
    return reduced.num * rhs.denom < rhs.num * reduced.denom;
  }

  /**
   * この有理数が指定した値より小さいか、指定した値と等しいときtrueを返します。そうでないとき、falseを返します。
   * @param rhs 比較する値。
   */
  public leq(rhs: ConvertableToRatio): boolean {
    const reduced = this.getReduced();
    if (rhs instanceof Ratio) {
      rhs = rhs.reduce();
    } else {
      rhs = Ratio.from(rhs);
    }
    return reduced.num * rhs.denom <= rhs.num * reduced.denom;
  }

  /**
   * この有理数以下で最大の整数を返します。
   */
  public floor(): bigint {
    const reduced = this.getReduced();
    if (reduced.denom === 1n) return reduced.num;
    return reduced.num > 0 ? reduced.num / reduced.denom : reduced.num / reduced.denom - 1n;
  }

  /**
   * この有理数以上で最小の整数を返します。
   */
  public ceil(): bigint {
    const reduced = this.getReduced();
    if (reduced.denom === 1n) return reduced.num;
    return reduced.num > 0 ? reduced.num / reduced.denom + 1n : reduced.num / reduced.denom;
  }

  /**
   * この有理数のうち1未満単位の値を取り除いた整数部を返します。
   */
  public trunc(): bigint {
    const reduced = this.getReduced();
    if (reduced.denom === 1n) return reduced.num;
    return reduced.num / reduced.denom;
  }

  /**
   * この有理数を四捨五入します。
   *
   * Math.roundと同様に、小数部分がちょうど0.5のとき、正の無限大の方向へ丸められます。
   */
  public round(): bigint {
    const reduced = this.getReduced();
    const floor = reduced.floor();
    const fracPart = reduced.sub(floor);
    if (fracPart.num * 2n < fracPart.denom) {
      return floor;
    } else {
      return floor + 1n;
    }
  }

  /**
   * この値を指定した小数点以下桁数までの10進法表記文字列に変換します。
   * @param digits 文字列に含める小数点以下桁数。
   */
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

  /**
   * このインスタンスを文字列表現に変換します。
   *
   * 文字列は、`num/denom`形式です。ただし、denomが負の場合、`num/(denom)`表記となります。
   */
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

function reduceAsRatio(values: ConvertableToRatio[], selector: (a: Ratio, b: Ratio) => Ratio): Ratio {
  return values.map((e) => Ratio.from(e)).reduce(selector);
}

/**
 * 指定した値をすべて有理数に変換し、もっとも大きいものを返します。
 * @param values 比較する値。
 */
function max(...values: ConvertableToRatio[]): Ratio {
  return reduceAsRatio(values, (a, b) => (a.gt(b) ? a : b));
}

/**
 * 指定した値をすべて有理数に変換し、もっとも小さいものを返します。
 * @param values 比較する値。
 */
function min(...values: ConvertableToRatio[]): Ratio {
  return reduceAsRatio(values, (a, b) => (a.lt(b) ? a : b));
}

export { ratio, Ratio, max, min };
