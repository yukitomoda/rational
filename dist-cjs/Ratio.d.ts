import { type ConvertableToRatio, type ConvertableToBigInt } from './types';
/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
 *
 * @param value 有理数に変換する値。
 * @returns 既約分数の有理数インスタンス。
 */
declare function ratio(value: ConvertableToRatio): Ratio;
/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
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
     * この有理数に指定した値を加えて得られる値を返します。
     * @param rhs 加算する値。
     */
    add(rhs: Ratio | bigint | number): Ratio;
    /**
     * この有理数から指定した値を引いて得られる値を返します。
     * @param rhs 減算する値。
     */
    sub(rhs: Ratio | bigint | number): Ratio;
    /**
     * この有理数に指定した値をかけて得られる値を返します。
     * @param rhs 乗算する値。
     */
    mul(rhs: Ratio | bigint | number): Ratio;
    /**
     * この有理数を指定した値で割って得られる値を返します。
     * @param rhs 除算する値。
     */
    div(rhs: Ratio | bigint | number): Ratio;
    /**
     * この有理数が指定した値と等しいかどうかを調べます。
     * @param rhs この値と等しいか調べる値。
     */
    eq(rhs: ConvertableToRatio): boolean;
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
export { ratio, Ratio };
