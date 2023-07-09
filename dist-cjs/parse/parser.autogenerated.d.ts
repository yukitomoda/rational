export interface FilePosition {
    offset: number;
    line: number;
    column: number;
}
export interface FileRange {
    start: FilePosition;
    end: FilePosition;
    source: string;
}
export interface LiteralExpectation {
    type: "literal";
    text: string;
    ignoreCase: boolean;
}
export interface ClassParts extends Array<string | ClassParts> {
}
export interface ClassExpectation {
    type: "class";
    parts: ClassParts;
    inverted: boolean;
    ignoreCase: boolean;
}
export interface AnyExpectation {
    type: "any";
}
export interface EndExpectation {
    type: "end";
}
export interface OtherExpectation {
    type: "other";
    description: string;
}
export type Expectation = LiteralExpectation | ClassExpectation | AnyExpectation | EndExpectation | OtherExpectation;
declare class _PeggySyntaxError extends Error {
    static buildMessage(expected: Expectation[], found: string | null): string;
    message: string;
    expected: Expectation[];
    found: string | null;
    location: FileRange;
    name: string;
    constructor(message: string, expected: Expectation[], found: string | null, location: FileRange);
    format(sources: {
        source?: any;
        text: string;
    }[]): string;
}
export interface TraceEvent {
    type: string;
    rule: string;
    result?: any;
    location: FileRange;
}
export interface ParseOptions {
    filename?: string;
    startRule?: "Root";
    tracer?: any;
    [key: string]: any;
}
export type ParseFunction = <Options extends ParseOptions>(input: string, options?: Options) => Options extends {
    startRule: infer StartRule;
} ? StartRule extends "Root" ? Root : Root : Root;
export declare const parse: ParseFunction;
export declare const RatioSyntaxError: typeof _PeggySyntaxError;
export type RatioSyntaxError = _PeggySyntaxError;
export type Root = Number_1;
export type Number_1 = FractionNumber | PointNumber | Integer;
export type PointNumber = BinaryPointNumber | OctalPointNumber | HexPointNumber | DecimalPointNumber;
export type UnsignedPointNumber = UnsignedBinaryPointNumber | UnsignedOctalPointNumber | UnsignedHexPointNumber | UnsignedDecimalPointNumber;
export type FractionNumber = {
    type: "FractionNumber";
    numerator: Numerator;
    denominator: Denominator;
};
export type Numerator = PointNumber | Integer;
export type Denominator = UnsignedPointNumber | UnsignedInteger;
export type Integer = BinaryInteger | OctalInteger | HexInteger | DecimalInteger;
export type UnsignedInteger = UnsignedBinaryInteger | UnsignedOctalInteger | UnsignedHexInteger | UnsignedDecimalInteger;
export type BinaryPointNumber = {
    type: "PointNumber";
    intPart: any;
    fracPart: any;
    cyclicPart: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    exponent: 0n;
};
export type UnsignedBinaryPointNumber = {
    type: "PointNumber";
    intPart: BinaryDigits;
    fracPart: BinaryDigits;
    cyclicPart: BinaryPointNumberCyclicPart | null;
} | {
    type: "PointNumber";
    intPart: BinaryDigits;
    cyclicPart: BinaryPointNumberCyclicPart;
};
export type BinaryPointNumberCyclicPart = BinaryDigits;
export type BinaryInteger = {
    type: "Integer";
    base: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    number: any;
    exponent: 0n;
};
export type UnsignedBinaryInteger = {
    type: "Integer";
    base: any;
    sign: 1n;
    number: any;
    exponent: 0n;
};
export type BinaryDigits = {
    base: 2n;
    number: bigint;
    length: number;
};
export type BinaryDigit = string;
export type OctalPointNumber = {
    type: "PointNumber";
    intPart: any;
    fracPart: any;
    cyclicPart: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    exponent: 0n;
};
export type UnsignedOctalPointNumber = {
    type: "PointNumber";
    intPart: OctalDigits;
    fracPart: OctalDigits;
    cyclicPart: OctalPointNumberCyclicPart | null;
} | {
    type: "PointNumber";
    intPart: OctalDigits;
    cyclicPart: OctalPointNumberCyclicPart;
};
export type OctalPointNumberCyclicPart = OctalDigits;
export type OctalInteger = {
    type: "Integer";
    base: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    number: any;
    exponent: 0n;
};
export type UnsignedOctalInteger = {
    type: "Integer";
    base: any;
    sign: 1n;
    number: any;
    exponent: 0n;
};
export type OctalDigits = {
    base: 8n;
    number: bigint;
    length: number;
};
export type OctalDigit = string;
export type DecimalPointNumber = {
    type: "PointNumber";
    intPart: any;
    fracPart: any;
    cyclicPart: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    exponent: any;
};
export type UnsignedDecimalPointNumber = {
    type: "PointNumber";
    intPart: DecimalDigits;
    fracPart: DecimalDigits;
    cyclicPart: DecimalPointNumberCyclicPart | null;
    exponent: 0n | NonNullable<DecimalExponentSpecifier | null>;
} | {
    type: "PointNumber";
    intPart: DecimalDigits;
    cyclicPart: DecimalPointNumberCyclicPart;
    exponent: 0n | NonNullable<DecimalExponentSpecifier | null>;
};
export type DecimalPointNumberCyclicPart = DecimalDigits;
export type DecimalInteger = {
    type: "Integer";
    base: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    number: any;
    exponent: any;
};
export type UnsignedDecimalInteger = {
    type: "Integer";
    base: any;
    sign: 1n;
    number: any;
    exponent: 0n | NonNullable<DecimalExponentSpecifier | null>;
};
export type DecimalExponentSpecifier = any;
export type DecimalDigits = {
    base: 10n;
    number: bigint;
    length: number;
};
export type DecimalNonZeroDigit = string;
export type DecimalDigit = string;
export type HexPointNumber = {
    type: "PointNumber";
    intPart: any;
    fracPart: any;
    cyclicPart: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    exponent: 0n;
};
export type UnsignedHexPointNumber = {
    type: "PointNumber";
    intPart: HexDigits;
    fracPart: HexDigits;
    cyclicPart: HexPointNumberCyclicPart | null;
} | {
    type: "PointNumber";
    intPart: HexDigits;
    cyclicPart: HexPointNumberCyclicPart;
};
export type HexPointNumberCyclicPart = HexDigits;
export type HexInteger = {
    type: "Integer";
    base: any;
    sign: 1n | NonNullable<SignSpecifier | null>;
    number: any;
    exponent: 0n;
};
export type UnsignedHexInteger = {
    type: "Integer";
    base: any;
    sign: 1n;
    number: any;
    exponent: 0n;
};
export type HexDigits = {
    base: 16n;
    number: bigint;
    length: number;
};
export type HexDigit = string;
export type SignSpecifier = 1n | -1n;
export {};
