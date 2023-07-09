Root = Number 

Number = FractionNumber / PointNumber / Integer

PointNumber = BinaryPointNumber / OctalPointNumber / HexPointNumber / DecimalPointNumber
UnsignedPointNumber = UnsignedBinaryPointNumber / UnsignedOctalPointNumber / UnsignedHexPointNumber / UnsignedDecimalPointNumber
FractionNumber = n:Numerator '/' d:Denominator { return {type: 'FractionNumber', numerator: n, denominator: d}}
Numerator =  PointNumber / Integer
Denominator = UnsignedPointNumber / UnsignedInteger
Integer = BinaryInteger / OctalInteger / HexInteger / DecimalInteger
UnsignedInteger = UnsignedBinaryInteger / UnsignedOctalInteger / UnsignedHexInteger / UnsignedDecimalInteger


// Binary Numbers (0b...)
BinaryPointNumber = s:SignSpecifier? n:UnsignedBinaryPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: 0n}; }
UnsignedBinaryPointNumber = '0b' n:BinaryDigits '.' f:BinaryDigits c:BinaryPointNumberCyclicPart?  { return {type: 'PointNumber', intPart: n, fracPart: f, cyclicPart: c}; }
	/ '0b' n:BinaryDigits '.' c:BinaryPointNumberCyclicPart  { return {type: 'PointNumber', intPart: n, cyclicPart: c}; }
BinaryPointNumberCyclicPart = '(' c:BinaryDigits ')' { return c; } 
BinaryInteger = s:SignSpecifier? '0b' n:BinaryDigits
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: 0n}; }
UnsignedBinaryInteger = '0b' n:BinaryDigits { return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: 0n}; } 
BinaryDigits = n:$(BinaryDigit+) { return {base: 2n, number:BigInt(`0b${n}`), length: n.length }; }
BinaryDigit = [0-1]

// Octal Numbers (0o...)
OctalPointNumber = s:SignSpecifier? n:UnsignedOctalPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: 0n}; }
UnsignedOctalPointNumber = '0o' n:OctalDigits '.' f:OctalDigits c:OctalPointNumberCyclicPart?  { return {type: 'PointNumber', intPart: n, fracPart: f, cyclicPart: c}; }
	/ '0o' n:OctalDigits '.' c:OctalPointNumberCyclicPart  { return {type: 'PointNumber', intPart: n, cyclicPart: c}; }
OctalPointNumberCyclicPart = '(' c:OctalDigits ')' { return c; } 
OctalInteger = s:SignSpecifier? '0o' n:OctalDigits
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: 0n}; }
UnsignedOctalInteger = '0o' n:OctalDigits { return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: 0n}; } 
OctalDigits = n:$(OctalDigit+) { return {base: 8n, number:BigInt(`0o${n}`), length: n.length }; }
OctalDigit = [0-7]

// Decimal Numbers
DecimalPointNumber = s:SignSpecifier? n:UnsignedDecimalPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: n.exponent}; }
UnsignedDecimalPointNumber = n:DecimalDigits '.' f:DecimalDigits c:DecimalPointNumberCyclicPart? e:DecimalExponentSpecifier? { return {type: 'PointNumber', intPart: n, fracPart: f, cyclicPart: c, exponent: e ?? 0n}; }
	/ n:DecimalDigits '.' c:DecimalPointNumberCyclicPart e:DecimalExponentSpecifier? { return {type: 'PointNumber', intPart: n, cyclicPart: c, exponent: e ?? 0n}; }
DecimalPointNumberCyclicPart = '(' c:DecimalDigits ')' { return c; } 
DecimalInteger = s:SignSpecifier? n:UnsignedDecimalInteger
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: n.exponent}; }
UnsignedDecimalInteger = n:DecimalDigits e:DecimalExponentSpecifier?
	{ return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: e ?? 0n}} 
DecimalExponentSpecifier = [eE] s:SignSpecifier? e:DecimalDigits { return (s ?? 1n) * e.number; }
DecimalDigits = n:$(DecimalDigit+) { return {base: 10n, number:BigInt(n), length: n.length }; }
DecimalNonZeroDigit = [1-9]
DecimalDigit = [0-9]

// Hex Numbers (0x...)
HexPointNumber = s:SignSpecifier? n:UnsignedHexPointNumber
	{ return {type: 'PointNumber', intPart: n.intPart, fracPart: n.fracPart, cyclicPart: n.cyclicPart, sign: s ?? 1n, exponent: 0n}; }
UnsignedHexPointNumber = '0x' n:HexDigits '.' f:HexDigits c:HexPointNumberCyclicPart? { return {type: 'PointNumber', intPart: n, fracPart: f, cyclicPart: c}; }
	/ '0x' n:HexDigits '.' c:HexPointNumberCyclicPart { return {type: 'PointNumber', intPart: n, cyclicPart: c}; }
HexPointNumberCyclicPart = '(' c:HexDigits ')' { return c; }
HexInteger = s:SignSpecifier? '0x' n:HexDigits
	{ return {type: 'Integer', base: n.base, sign: s ?? 1n, number: n.number, exponent: 0n}; }
UnsignedHexInteger = '0x' n:HexDigits { return {type: 'Integer', base: n.base, sign: 1n, number: n.number, exponent: 0n}; } 
HexDigits = n:$(HexDigit+) { return {base: 16n, number:BigInt(`0x${n}`), length: n.length }; }
HexDigit = [0-9a-fA-F]

SignSpecifier = s:[-+] { return s == '-' ? -1n : 1n; }