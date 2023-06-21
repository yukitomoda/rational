import { Ratio } from './Ratio';
type ConvertableToBigInt = number | string | bigint | boolean;
declare function isConvertableToBigInt(value: any): value is ConvertableToBigInt;
type ConvertableToRatio = Ratio | bigint;
declare function isConvertableToRatio(value: any): value is ConvertableToRatio;
export { type ConvertableToBigInt, isConvertableToBigInt, type ConvertableToRatio, isConvertableToRatio };
