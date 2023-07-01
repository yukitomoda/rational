import { Ratio } from './Ratio';
/**
 * BigIntに暗黙的に変換可能な型を表します。
 */
type ConvertableToBigInt = number | string | bigint | boolean;
declare function isConvertableToBigInt(value: any): value is ConvertableToBigInt;
/**
 * Ratioに暗黙的に変換可能な型を表します。
 */
type ConvertableToRatio = Ratio | bigint | number | string;
declare function isConvertableToRatio(value: any): value is ConvertableToRatio;
export { type ConvertableToBigInt, isConvertableToBigInt, type ConvertableToRatio, isConvertableToRatio };
