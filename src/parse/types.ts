declare type Number = PointNumber | FractionNumber | Integer;

declare interface PointNumber {
  type: 'PointNumber';
  intPart: Digits;
  fracPart?: Digits | null;
  cyclicPart?: Digits | null;
  sign?: 1n | -1n;
  exponent?: bigint;
}

declare interface FractionNumber {
  type: 'FractionNumber';
  numerator: Integer | PointNumber;
  denominator: Integer | PointNumber;
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
