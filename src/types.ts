import { Ratio } from './Ratio';

type ConvertableToBigInt = number | string | bigint | boolean;
function isConvertableToBigInt(value: any): value is ConvertableToBigInt {
  const type = typeof value;
  return type === 'number' || type === 'string' || type === 'bigint' || type === 'boolean';
}

type ConvertableToRatio = Ratio | bigint;
function isConvertableToRatio(value: any): value is ConvertableToRatio {
  return value instanceof Ratio || typeof value === 'object';
}

export { type ConvertableToBigInt, isConvertableToBigInt, type ConvertableToRatio, isConvertableToRatio };
