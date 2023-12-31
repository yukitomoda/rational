import { Ratio } from './Ratio';

/**
 * BigIntに暗黙的に変換可能な型を表します。
 */
type ConvertableToBigInt = number | string | bigint | boolean;
function isConvertableToBigInt(value: any): value is ConvertableToBigInt {
  const type = typeof value;
  return type === 'number' || type === 'string' || type === 'bigint' || type === 'boolean';
}

/**
 * Ratioに暗黙的に変換可能な型を表します。
 */
type ConvertableToRatio = Ratio | bigint | number | string;
function isConvertableToRatio(value: any): value is ConvertableToRatio {
  return value instanceof Ratio || typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string';
}

export { type ConvertableToBigInt, isConvertableToBigInt, type ConvertableToRatio, isConvertableToRatio };
