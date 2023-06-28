Root = Number 

Number = PointNumber / FractionNumber / Integer

PointNumber = BinaryPointNumber / OctalPointNumber / DecimalPointNumber / HexPointNumber
FractionNumber = n:Integer '/' d:UnsignedInteger { return {type: 'FractionNumber', numerator: n, denominator: d}}
Integer = BinaryInteger / OctalInteger / DecimalInteger / HexInteger
UnsignedInteger = UnsignedBinaryInteger / UnsignedOctalInteger / UnsignedDecimalInteger / UnsignedHexInteger


// Binary Numbers (0b...)
BinaryPointNumber = s:SignSpecifier? n:UnsignedBinaryPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: 0n}; }
UnsignedBinaryPointNumber = '0b' n:BinaryDigits '.' f:BinaryDigits c:BinaryPointNumberCyclicPart?  { return {intPart: n, fracPart: f, cyclicPart: c}; }
	/ '0b' n:BinaryDigits '.' c:BinaryPointNumberCyclicPart  { return {intPart: n, fracPart: null, cyclicPart: c}; }
BinaryPointNumberCyclicPart = '(' c:BinaryDigits ')' { return c; } 
BinaryInteger = s:SignSpecifier? '0b' n:BinaryDigits
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: 0n}; }
UnsignedBinaryInteger = '0b' n:BinaryDigits { return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: 0n}; } 
BinaryDigits = n:$(BinaryDigit+) { return {base: 2n, number:BigInt(`0b${n}`), length: n.length }; }
BinaryDigit = [0-1]

// Octal Numbers (0o...)
OctalPointNumber = s:SignSpecifier? n:UnsignedOctalPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: 0n}; }
UnsignedOctalPointNumber = '0o' n:OctalDigits '.' f:OctalDigits c:OctalPointNumberCyclicPart?  { return {intPart: n, fracPart: f, cyclicPart: c}; }
	/ '0o' n:OctalDigits '.' c:OctalPointNumberCyclicPart  { return {intPart: n, fracPart: null, cyclicPart: c}; }
OctalPointNumberCyclicPart = '(' c:OctalDigits ')' { return c; } 
OctalInteger = s:SignSpecifier? '0o' n:OctalDigits
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: 0n}; }
UnsignedOctalInteger = '0o' n:OctalDigits { return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: 0n}; } 
OctalDigits = n:$(OctalDigit+) { return {base: 8n, number:BigInt(`0o${n}`), length: n.length }; }
OctalDigit = [0-7]

// Decimal Numbers
DecimalPointNumber = s:SignSpecifier? n:UnsignedDecimalPointNumber e:DecimalExponentSpecifier?
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: e ?? 0n}; }
UnsignedDecimalPointNumber = n:DecimalDigits_StartsWithNonZero '.' f:DecimalDigits c:DecimalPointNumberCyclicPart? { return {intPart: n, fracPart: f, cyclicPart: c}; }
	/ n:DecimalDigits_StartsWithNonZero '.' c:DecimalPointNumberCyclicPart { return {intPart: n, fracPart: null, cyclicPart: c}; }
DecimalPointNumberCyclicPart = '(' c:DecimalDigits ')' { return c; } 
DecimalInteger = s:SignSpecifier? n:UnsignedDecimalInteger
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: n.exponent}; }
UnsignedDecimalInteger = n:DecimalDigits_StartsWithNonZero e:DecimalExponentSpecifier?
	{ return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: e ?? 0n}} 
DecimalExponentSpecifier = [eE] s:SignSpecifier? e:DecimalDigits { return (s ?? 1n) * e.number; }
DecimalDigits_StartsWithNonZero =  n:$(DecimalNonZeroDigit DecimalDigit*) { return {base: 10n, number:BigInt(n), length: n.length }; }
DecimalDigits = n:$(DecimalDigit+) { return {base: 10n, number:BigInt(n), length: n.length }; }
DecimalNonZeroDigit = [1-9]
DecimalDigit = [0-9]

// Hex Numbers (0x...)
HexPointNumber = s:SignSpecifier? n:UnsignedHexPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: 0n}; }
UnsignedHexPointNumber = '0x' n:HexDigits '.' f:HexDigits c:HexPointNumberCyclicPart? { return {intPart: n, fracPart: f, cyclicPart: c}; }
	/ '0x' n:HexDigits '.' c:HexPointNumberCyclicPart { return {intPart: n, fracPart: null, cyclicPart: c}; }
HexPointNumberCyclicPart = '(' c:HexDigits ')' { return c; }
HexInteger = s:SignSpecifier? '0x' n:HexDigits
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: 0n}; }
UnsignedHexInteger = '0x' n:HexDigits { return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: 0n}; } 
HexDigits = n:$(HexDigit+) { return {base: 16n, number:BigInt(`0x${n}`), length: n.length }; }
HexDigit = [0-9a-fA-F]

SignSpecifier = s:[-+] { return s == '-' ? -1n : 1n; }