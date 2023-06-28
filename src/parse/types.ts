declare type Number = PointNumber | FractionNumber | Integer;

declare interface PointNumber {
  type: 'PointNumber';
  intPart: Digits;
  fracPart?: Digits;
  cyclicPart?: Digits;
  sign: 1n | -1n;
  exponent: bigint;
}

declare interface FractionNumber {
  type: 'FractionNumber';
  numerator: Integer;
  denominator: Integer;
}

declare interface Integer {
  type: 'Integer';
  base: bigint;
  sign: 1n | -1n;
  number: bigint;
  exponent: bigint;
}

declare interface Digits {
  base: bigint;
  number: bigint;
  length: number;
}

export { type Number, type Digits, type PointNumber, type FractionNumber, type Integer };
