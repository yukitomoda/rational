import { type ConvertableToRatio, type ConvertableToBigInt } from './types';
/**
 * 指定した整数を表す有理数のインスタンスに変換します。
 *
 * @param value 有理数に変換する値。
 */
declare function ratio(value: bigint): Ratio;
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
declare function ratio(value: number): Ratio;
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
declare function ratio(value: string): Ratio;
/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
 * この関数は分子、分母をともに整数として扱います。
 * 整数でない数を分子、分母に指定する場合は、`ratio(a).div(ratio(b))`を使用してください。
 *
 * @param num 分子の値。この値は整数でなければなりません。
 * @param denom 分母の値。この値は整数でなければなりません。
 * @returns 既約分数の有理数インスタンス。
 */
declare function ratio(num: ConvertableToBigInt, denom: ConvertableToBigInt): Ratio;
/**
 * 任意精度の有理数を表します。
 */
declare class Ratio {
    /**
     * 分子を取得します。
     */
    readonly num: bigint;
    /**
     * 分母を取得します。
     */
    readonly denom: bigint;
    private _reducedCache;
    /**
     * この有理数が0であるときtrueを返します。
     * そうでないとき、falseを返します。
     */
    get isZero(): boolean;
    /**
     * この有理数が0未満であるときtrueを返します。
     * そうでないとき、falseを返します。
     */
    get isNegative(): boolean;
    /**
     * この有理数が0より大きい場合にtrueを返します。
     * そうでないとき、falseを返します。
     */
    get isPositive(): boolean;
    /**
     * この値が正の数のとき1、0のとき0、負の数のとき-1を返します。
     */
    get sign(): -1 | 0 | 1;
    /**
     * 指定した分子、分母で有理数のインスタンスを作成します。
     *
     * このコンストラクタでは、分子、分母の値はそのまま保持され、既約分数への変換は行われません。
     * あらかじめ既約分数として作成する場合は、`ratio()` を使用してください。
     * @param num 分子
     * @param denom 分母
     */
    constructor(num: ConvertableToBigInt, denom: ConvertableToBigInt);
    /**
     * 分子と分母を指定して、既約分数を返します。
     * この既約分数は、有理数が負の場合numプロパティが負となります。
     * @param num 分子
     * @param denom 分母
     * @returns 指定した分子、分母を持つ分数と等しい既約分数
     */
    static reduced(num: ConvertableToBigInt, denom: ConvertableToBigInt): Ratio;
    /**
     * 指定した値を有理数のインスタンスに変換します。
     * @param value 有理数に変換する値。
     */
    static from(value: ConvertableToRatio): Ratio;
    /**
     * 指定した数値を有理数に変換します。
     * @param value 有理数に変換する値。
     */
    static fromNumber(value: number): Ratio;
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
    static parse(str: string): Ratio;
    private getReduced;
    /**
     * この有理数を既約分数に変換した値を返します。
     */
    reduce(): Ratio;
    /**
     * この有理数の逆数を計算して返します。
     * @throws 値が0のとき
     */
    inv(): Ratio;
    /**
     * この有理数の符号を反転した値を返します。
     */
    neg(): Ratio;
    /**
     * この有理数の絶対値を返します。
     */
    abs(): Ratio;
    /**
     * この有理数に指定した値を加えて得られる値を返します。
     * @param rhs 加算する値。
     */
    add(rhs: ConvertableToRatio): Ratio;
    /**
     * この有理数から指定した値を引いて得られる値を返します。
     * @param rhs 減算する値。
     */
    sub(rhs: ConvertableToRatio): Ratio;
    /**
     * この有理数に指定した値をかけて得られる値を返します。
     * @param rhs 乗算する値。
     */
    mul(rhs: ConvertableToRatio): Ratio;
    /**
     * この有理数を指定した値で割って得られる値を返します。
     * @param rhs 除算する値。
     */
    div(rhs: ConvertableToRatio): Ratio;
    /**
     * この有理数が指定した値と等しいかどうかを調べます。
     * @param rhs この値と等しいか調べる値。
     */
    eq(rhs: ConvertableToRatio): boolean;
    /**
     * この有理数が指定した値より大きいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    gt(rhs: ConvertableToRatio): boolean;
    /**
     * この有理数が指定した値より大きいか、指定した値と等しいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    geq(rhs: ConvertableToRatio): boolean;
    /**
     * この有理数が指定した値より小さいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    lt(rhs: ConvertableToRatio): boolean;
    /**
     * この有理数が指定した値より小さいか、指定した値と等しいときtrueを返します。そうでないとき、falseを返します。
     * @param rhs 比較する値。
     */
    leq(rhs: ConvertableToRatio): boolean;
    /**
     * この有理数以下で最大の整数を返します。
     */
    floor(): bigint;
    /**
     * この有理数以上で最小の整数を返します。
     */
    ceil(): bigint;
    /**
     * この有理数のうち1未満単位の値を取り除いた整数部を返します。
     */
    trunc(): bigint;
    /**
     * この有理数を四捨五入します。
     *
     * Math.roundと同様に、小数部分がちょうど0.5のとき、正の無限大の方向へ丸められます。
     */
    round(): bigint;
    /**
     * この値を指定した小数点以下桁数までの10進法表記文字列に変換します。
     * @param digits 文字列に含める小数点以下桁数。
     */
    toDecimal(digits?: number): string;
    /**
     * このインスタンスを文字列表現に変換します。
     *
     * 文字列は、`num/denom`形式です。ただし、denomが負の場合、`num/(denom)`表記となります。
     */
    toString(): string;
}
/**
 * 指定した値をすべて有理数に変換し、もっとも大きいものを返します。
 * @param values 比較する値。
 */
declare function max(...values: ConvertableToRatio[]): Ratio;
/**
 * 指定した値をすべて有理数に変換し、もっとも小さいものを返します。
 * @param values 比較する値。
 */
declare function min(...values: ConvertableToRatio[]): Ratio;
export { ratio, Ratio, max, min };
