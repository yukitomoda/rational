import { Ratio } from './Ratio';
/**
 * BigIntに暗黙的に変換可能な型を表します。
 */
type ConvertableToBigInt = number | string | bigint | boolean;
declare function isConvertableToBigInt(value: any): value is ConvertableToBigInt;
/**
 * Rationalに暗黙的に変換可能な型を表します。
 */
type ConvertableToRational = Ratio | bigint;
declare function isConvertableToRatio(value: any): value is ConvertableToRational;
export { type ConvertableToBigInt, isConvertableToBigInt, type ConvertableToRational, isConvertableToRatio };
