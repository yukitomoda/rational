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
     * 分子
     */
    readonly num: bigint;
    /**
     * 分母
     */
    readonly denom: bigint;
    private _reducedCache;
    /**
     * この有理数が0であるかどうかを取得します。
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
    constructor(num: ConvertableToBigInt, denom: ConvertableToBigInt);
    /**
     * 分子と分母を指定して、既約分数を返します。
     * この既約分数は、有理数が負の場合numプロパティが負となります。
     * @param num 分子
     * @param denom 分母
     * @returns 指定した分子、分母を持つ分数と等しい既約分数
     */
    static reduced(num: ConvertableToBigInt, denom: ConvertableToBigInt): Ratio;
    static from(value: ConvertableToRatio): Ratio;
    private getReduced;
    reduce(): Ratio;
    inv(): Ratio;
    neg(): Ratio;
    add(rhs: Ratio | bigint | number): Ratio;
    sub(rhs: Ratio | bigint | number): Ratio;
    mul(rhs: Ratio | bigint | number): Ratio;
    div(rhs: Ratio | bigint | number): Ratio;
    eq(rhs: ConvertableToRatio): boolean;
    toDecimal(digits?: number): string;
    toString(): string;
}
export { ratio, Ratio };
