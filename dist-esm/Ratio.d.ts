import { type ConvertableToRatio, type ConvertableToBigInt } from './types';
/**
 * 有理数のインスタンスを作成して返します。有理数の作成の際には、あらかじめ既約分数に直されます。
 *
 * @param value 有理数に変換する値。
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
    get isZero(): boolean;
    get isNegative(): boolean;
    get isPositive(): boolean;
    constructor(num: ConvertableToBigInt, denom: ConvertableToBigInt);
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
