"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDigits = exports.roundTo = exports.bitOff = exports.bitOn = exports.bitAt = exports.lcm = exports.gcd = exports.odd = exports.even = exports.abs = void 0;
function abs(value) {
    return value < 0 ? -value : value;
}
exports.abs = abs;
function even(value) {
    return (value & 1n) === 0n;
}
exports.even = even;
function odd(value) {
    return (value & 1n) !== 0n;
}
exports.odd = odd;
function gcd(lhs, rhs) {
    let x = abs(lhs);
    let y = abs(rhs);
    let k = 0;
    while (even(x) && even(y)) {
        k++;
        x >>= 1n;
        y >>= 1n;
    }
    let z = odd(x) ? -y : x;
    while (z !== 0n) {
        while (even(z)) {
            z >>= 1n;
        }
        if (z > 0) {
            x = z;
        }
        else {
            y = -z;
        }
        z = x - y;
    }
    return (1n << BigInt(k)) * x;
}
exports.gcd = gcd;
function lcm(lhs, rhs) {
    return abs((lhs * rhs) / gcd(lhs, rhs));
}
exports.lcm = lcm;
function bitAt(value, pos) {
    return (value & (1n << BigInt(pos))) !== 0n;
}
exports.bitAt = bitAt;
function bitOn(value, pos) {
    return (value |= 1n << BigInt(pos));
}
exports.bitOn = bitOn;
function bitOff(value, pos) {
    const mask = 1n << BigInt(pos);
    return (value & mask) !== 0n ? value - mask : value;
}
exports.bitOff = bitOff;
function roundTo(value, exponent, base = 10) {
    const absValue = abs(value);
    const divisor = BigInt(base) ** BigInt(exponent);
    const remainder = absValue % divisor;
    const roundUp = divisor <= remainder * 2n;
    const absResult = roundUp ? absValue - remainder + divisor : absValue - remainder;
    return value < 0 ? -absResult : absResult;
}
exports.roundTo = roundTo;
function countDigits(value, base = 10) {
    base = BigInt(base);
    value = abs(value);
    let n = 1;
    while ((value /= base) !== 0n) {
        n++;
    }
    return n;
}
exports.countDigits = countDigits;
//# sourceMappingURL=BigMath.js.map