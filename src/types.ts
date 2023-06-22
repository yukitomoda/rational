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
 * Rationalに暗黙的に変換可能な型を表します。
 */
type ConvertableToRational = Ratio | bigint;
function isConvertableToRatio(value: any): value is ConvertableToRational {
  return value instanceof Ratio || typeof value === 'object';
}

export { type ConvertableToBigInt, isConvertableToBigInt, type ConvertableToRational, isConvertableToRatio };
