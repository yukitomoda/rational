function abs(value) {
    return value < 0 ? -value : value;
}
function even(value) {
    return (value & 1n) === 0n;
}
function odd(value) {
    return (value & 1n) !== 0n;
}
function gcd(lhs, rhs) {
    let x = abs(lhs);
    let y = abs(rhs);
    if (x === 0n)
        return y;
    if (y === 0n)
        return x;
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
function lcm(lhs, rhs) {
    return abs((lhs * rhs) / gcd(lhs, rhs));
}
function bitAt(value, pos) {
    return (value & (1n << BigInt(pos))) !== 0n;
}
function bitOn(value, pos) {
    return (value |= 1n << BigInt(pos));
}
function bitOff(value, pos) {
    const mask = 1n << BigInt(pos);
    return (value & mask) !== 0n ? value - mask : value;
}
function roundTo(value, exponent, base = 10) {
    const absValue = abs(value);
    const divisor = BigInt(base) ** BigInt(exponent);
    const remainder = absValue % divisor;
    const roundUp = divisor <= remainder * 2n;
    const absResult = roundUp ? absValue - remainder + divisor : absValue - remainder;
    return value < 0 ? -absResult : absResult;
}
function countDigits(value, base = 10) {
    base = BigInt(base);
    value = abs(value);
    let n = 1;
    while ((value /= base) !== 0n) {
        n++;
    }
    return n;
}
export { abs, even, odd, gcd, lcm, bitAt, bitOn, bitOff, roundTo, countDigits };
//# sourceMappingURL=BigMath.js.map